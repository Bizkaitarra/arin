import {Capacitor} from "@capacitor/core";
import {MetroStopTrains, MetroTrain} from "../MetroBilbaoStorage";
import {IncidentsResult, MetroBilbaoResponse} from "./Incidences";
import {HTTPClient} from "../HTTPClient";
import i18next from "i18next";
import {Display} from "./Display";
import {getMetroBilbaoL3StopTrains} from "../ApiMetroBilbaoL3";
import paradasMetro from "../../data/paradas_metro.json";
import {FareRate} from "./FareRate";
import {FareItem} from "./FareItem";
import {FareCategory} from "./FareCategory";
import {FaresResponse} from "./FaresResponse";

export class ApiMetroBilbao {
    private paradasMetro: any[];

    constructor() {
        this.paradasMetro = paradasMetro;
    }



    #isL3Station(stationCode: string): boolean {
        const station = this.paradasMetro.find(p => p.Code === stationCode);
        return station?.Lines.includes("L3") || false;
    }

    async #fetchTrainData(origin: string, destination: string, maxTrains: number): Promise<{ trains: MetroTrain[], duration: number | undefined }> {
        try {
            const url = `https://api.metrobilbao.eus/metro/real-time/${origin}/${destination}`;
            const response = await HTTPClient.get(url);
            const data = response.data;
            const duration = data.trip?.duration;

            const trains = data.trains
                .filter((train: any) => train.estimated <= maxTrains)
                .map((train: any) => ({
                    Wagons: train.wagons,
                    Estimated: train.estimated,
                    Direction: train.direction,
                    Time: train.time,
                    TimeRounded: train.timeRounded,
                    Duration: duration,
                    Transfer: data.trip.transfer
                }));
            return { trains, duration };
        } catch (error) {
            console.error(`Error fetching train data for ${origin} to ${destination}:`, error);
            return { trains: [], duration: undefined };
        }
    }

    async #getMetroStopTrains(display: Display, maxTrains: number): Promise<MetroStopTrains> {
        const originStation = this.paradasMetro.find(p => p.Code === display.origin.Code);
        if (!originStation) {
            console.error(`Origin station ${display.origin.Code} not found in paradasMetro.json`);
            return { Display: display, Platform1: [], Platform2: [], isRoute: false };
        }

        const processPlatform = async (platformDestinations: string[]): Promise<MetroTrain[]> => {
            const allTrains: MetroTrain[] = [];
            for (const destCode of platformDestinations) {
                const destinationStation = this.paradasMetro.find(p => p.Code === destCode);
                if (!destinationStation) {
                    console.warn(`Destination station ${destCode} not found in paradasMetro.json`);
                    continue;
                }

                const originIsL3 = this.#isL3Station(originStation.Code);
                const destinationIsL3 = this.#isL3Station(destinationStation.Code);

                if (originIsL3 && destinationIsL3) {
                    const tempDisplay: Display = {
                        origin: originStation,
                        destination: destinationStation,
                    };
                    const l3Trains = await getMetroBilbaoL3StopTrains(tempDisplay, maxTrains);
                    allTrains.push(...l3Trains.Platform1);
                } else {
                    const { trains } = await this.#fetchTrainData(originStation.Code, destCode, maxTrains);
                    allTrains.push(...trains);
                }
            }
            return allTrains;
        };

        if (!display.destination) {
            const platform1Trains = await processPlatform(originStation.Platform1);
            const platform2Trains = await processPlatform(originStation.Platform2);

            return {
                Display: display,
                Platform1: platform1Trains.flat().sort((a, b) => a.Estimated - b.Estimated),
                Platform2: platform2Trains.flat().sort((a, b) => a.Estimated - b.Estimated),
                isRoute: false
            };
        }

        const [platform1Data, platform2Data] = await Promise.all([
            this.#fetchTrainData(display.origin.Code, display.destination.Code, maxTrains),
            this.#fetchTrainData(display.destination.Code, display.origin.Code, maxTrains)
        ]);

        return {
            Display: display,
            Platform1: platform1Data.trains.flat().sort((a, b) => a.Estimated - b.Estimated),
            Platform2: platform2Data.trains.flat().sort((a, b) => a.Estimated - b.Estimated),
            isRoute: true,
            duration: platform1Data.duration,
            duration2: platform2Data.duration
        };
    }

    public async getMetroDisplaysTrains(displays: Display[], maxTrains: number = 60): Promise<MetroStopTrains[]> {
        const promises = displays.map(display => {
            const originIsL3 = this.#isL3Station(display.origin.Code);
            const destinationIsL3 = display.destination ? this.#isL3Station(display.destination.Code) : false;

            if (display.destination && originIsL3 && destinationIsL3) {
                // Both origin and destination are L3 stations, use the L3 API
                return getMetroBilbaoL3StopTrains(display, maxTrains);
            } else {
                // Otherwise, use the original Metro Bilbao API
                return this.#getMetroStopTrains(display, maxTrains);
            }
        });
        return Promise.all(promises);
    }

    public async fetchMetroBilbaoIncidents(): Promise<IncidentsResult> {
        let language = i18next.language || "es";

        if (language !== "es" && language !== "eu") {
            language = "es";
        }

        const endpoint = language === "eu" ? "abisuak" : "avisos";
        const url = `https://api.metrobilbao.eus/metro_page/${language}/${endpoint}`;

        try {
            const response = await HTTPClient.get(url);

            if (response.status !== 200) {
                console.error("Error fetching Metro Bilbao incidents: invalid status", response.status);
                return { serviceIssues: [], installationIssues: [] };
            }

            const data: MetroBilbaoResponse = response.data;

            return {
                serviceIssues: data.configuration.incidences.service_issue.map(incident => ({
                    ...incident,
                    station: { code: null },
                })),
                installationIssues: data.configuration.incidences.installation_issue.map(incident => ({
                    ...incident,
                    station: { code: incident.station.code },
                })),
            };
        } catch (error) {
            console.error("Error fetching Metro Bilbao incidents:", error);
            return { serviceIssues: [], installationIssues: [] };
        }
    }

    public async getBarikData(barikNumber: string) {
        const url = "https://www.ctb.eus/llamadaServicioBarik.php";
        const params = `p=IdTarjeta*${barikNumber}|vacio*vacio&metodo=consultaTitulosRecargablesAnt`;

        try {
            let response;

            const headers = {
                "Content-Type": "application/x-www-form-urlencoded",
                "Origin": "https://www.ctb.eus",  // Cabecera Origin
                "Referer": "https://www.ctb.eus",  // Cabecera Referer
                "Sec-Fetch-Dest": "empty",  // Cabecera Sec-Fetch-Dest
                "Sec-Fetch-Mode": "cors",   // Cabecera Sec-Fetch-Mode
                "Sec-Fetch-Site": "same-origin" // Cabecera Sec-Fetch-Site
            };

            response = await HTTPClient.post(url, params, {headers});
            const data = response.data;
            return this.#parseBarikResponse(data);
        } catch (error) {
            console.error("Error es:", error);
            return {
                Status: 'ERROR',
                Gizatrans: undefined,
                Creditrans: undefined
            };
        }
    }

    #parseBarikResponse(xmlString: string) {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlString, "text/xml");

        const status = xmlDoc.getElementsByTagName("resultado")[0]?.textContent || "";

        let gizatrans;
        let creditrans;

        const titulosMonedero = xmlDoc.getElementsByTagName("titulosMonedero");

        for (let monedero of titulosMonedero) {
            const tipoTitulo = monedero.getElementsByTagName("TipoTitulo")[0]?.textContent || "";
            const sldMon = monedero.getElementsByTagName("SldMon")[0]?.textContent;

            if (tipoTitulo === "Monedero Gizatrans") {
                gizatrans = sldMon !== undefined ? sldMon : undefined;
            }

            if (tipoTitulo === "Monedero Creditrans") {
                creditrans = sldMon !== undefined ? sldMon : undefined;
            }
        }

        return {
            Status: status,
            Gizatrans: gizatrans,
            Creditrans: creditrans
        };
    }

    public async planTrip(params: {
        origen: string;
        destino: string;
        fecha: string; // DD-MM-YYYY
        hora_inicio: number; // float
        hora_fin: number; // float
    }) {
        let language = i18next.language || "es";
        if (language !== "es" && language !== "eu") {
            language = "es";
        }

        const url = `https://api.metrobilbao.eus/metro/obtain-schedule-of-trip/${params.origen}/${params.destino}/${params.hora_inicio}/${params.hora_fin}/${params.fecha}/${language}`;

        try {
            const response = await HTTPClient.get(url);
            const data = response.data;
            return data;
        } catch (error) {
            console.error("Error planning trip:", error);
            return null;
        }
    }

    public async getFares(): Promise<FaresResponse> {
        let language = i18next.language || "es";
        if (language !== "es" && language !== "eu") {
            language = "es";
        }

        const endpoint = language === "eu" ? "tarifa-guztiak" : "todas-las-tarifas";
        const url = `https://api.metrobilbao.eus/metro_page/${language}/${endpoint}`;

        try {
            const response = await HTTPClient.get(url);
            const data = response.data;
            return data;
        } catch (error) {
            console.error("Error fetching fares:", error);
            return { title: "", description: "", configuration: { categorized: {} } };
        }
    }
}