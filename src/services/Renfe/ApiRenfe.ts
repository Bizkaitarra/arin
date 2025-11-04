import {RenfeStop} from "./RenfeStop";
import {Display} from "../Display";
import {Http} from '@capacitor-community/http';
import {RenfeStorage} from "./RenfeStorage";
import {TrainSchedule} from "./TrainSchedule";
import {Platforms} from "./Platforms";

export class ApiRenfe {
    private static readonly RENFE_URL = 'https://horarios.renfe.com/cer/HorariosServlet';
    private readonly storageService: RenfeStorage;

    constructor() {
        this.storageService = new RenfeStorage();
    }

    public async getPlatformsForDisplays(displays: Display[]): Promise<Platforms[]> {
        return await Promise.all(
            displays.map(display => this.#getPlatforms(display))
        );
    }

    async #getPlatforms(display: Display): Promise<Platforms> {
        const schedule1 = await this.#getTrainSchedules(display.origin.id, display.destination.id);
        const schedule2 = await this.#getTrainSchedules(display.destination.id, display.origin.id);
        return {
            origin: display.origin as RenfeStop,
            destiny: display.destination as RenfeStop,
            Platform1: schedule1,
            Platform2: schedule2,
            duration1: schedule1.length > 0 ? schedule1[0].duration : undefined,
            duration2: schedule2.length > 0 ? schedule2[0].duration : undefined
        };
    }

    async #getTrainSchedules(origin: string, destination: string): Promise<TrainSchedule[]> {
        const now = new Date();
        const currentHour = now.getUTCHours();
        const travelDateToday = this.#formatDate(now);
        const finalHourCandidate = currentHour + 12;
        let results: any[] = [];

        if (finalHourCandidate <= 26) {
            const hourFrom = this.#pad(currentHour);
            const hourTo = this.#pad(finalHourCandidate);
            const data = await this.#fetchSchedule(origin, destination, travelDateToday, hourFrom, hourTo);
            results = data.horario || [];
        } else {
            const hourFrom1 = this.#pad(currentHour);
            const hourTo1 = "26";
            const data1 = await this.#fetchSchedule(origin, destination, travelDateToday, hourFrom1, hourTo1);
            const results1 = data1.horario || [];
            const extraHours = finalHourCandidate - 26;
            const hourFrom2 = "00";
            const hourTo2 = this.#pad(extraHours);
            const tomorrow = new Date(now);
            tomorrow.setDate(tomorrow.getDate() + 1);
            const travelDateTomorrow = this.#formatDate(tomorrow);
            const data2 = await this.#fetchSchedule(origin, destination, travelDateTomorrow, hourFrom2, hourTo2);
            const results2 = data2.horario || [];
            results = [...results1, ...results2];
        }

        const mappedSchedule: TrainSchedule[] = results.map((item: any) => {
            const departure = item.horaSalida;
            const timeToGo = this.#computeTimeToGo(departure, now);
            let transStation = null;

            let data: TrainSchedule = {
                line: item.linea || item.lineaEstOrigen || "",
                trainId: item.cdgoTren,
                timeToGo,
                departure,
                arrival: item.horaLlegadaReal || item.horaLlegada,
                duration: item.duracion,
                isAccessible: item.accesible,
            };

            if (item.trans !== undefined) {
                const transStopCode = item.trans[0].cdgoEstacion;
                transStation = this.storageService.getStationById(transStopCode);
                const timeToGo = this.#computeTimeToGo(item.trans[0].horaSalida, now);
                data.transData = {
                    transStation: transStation,
                    arrival: item.trans[0].horaLlegada,
                    departure: item.trans[0].horaSalida,
                    line: item.trans[0].linea,
                    timeToGo
                };
            }

            return data;
        });

        return mappedSchedule
            .filter(item => item.timeToGo < 120)
            .sort((a, b) => a.timeToGo - b.timeToGo);
    }

    #pad(n: number): string {
        return n < 10 ? '0' + n : '' + n;
    }

    #formatDate(date: Date): string {
        const year = date.getFullYear();
        const month = this.#pad(date.getMonth() + 1);
        const day = this.#pad(date.getDate());
        return `${year}${month}${day}`;
    }

    #computeTimeToGo(departureTime: string, baseDate: Date): number {
        const [depHourStr, depMinStr] = departureTime.split(':');
        const depHour = parseInt(depHourStr, 10);
        const depMin = parseInt(depMinStr, 10);
        const departureDate = new Date(baseDate);
        departureDate.setUTCHours(depHour, depMin, 0, 0);
        if (departureDate.getTime() < baseDate.getTime()) {
            departureDate.setUTCDate(departureDate.getUTCDate() + 1);
        }
        return Math.round((departureDate.getTime() - baseDate.getTime()) / 60000);
    }

    async #fetchSchedule(
        origin: string,
        destination: string,
        travelDate: string,
        hourFrom: string,
        hourTo: string
    ): Promise<any> {
        const body = {
            nucleo: "60",
            origen: origin,
            destino: destination,
            fchaViaje: travelDate,
            validaReglaNegocio: true,
            tiempoReal: true,
            servicioHorarios: "VTI",
            horaViajeOrigen: hourFrom,
            horaViajeLlegada: hourTo,
            accesibilidadTrenes: false,
        };

        const response = await Http.request({
            method: 'POST',
            url: ApiRenfe.RENFE_URL,
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Accept-Language': 'es-ES,es;q=0.9',
                'Content-Type': 'application/json;charset=UTF-8',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36',
            },
            data: body,
        });

        if (response.status < 200 || response.status >= 300) {
            throw new Error(`Request failed with status ${response.status}`);
        }

        return response.data;
    }
}