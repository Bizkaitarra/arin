import { MetroStop, MetroTrain, MetroStopTrains } from "../MetroBilbaoStorage";
import { Display } from "../MetroBilbao/Display";
import i18next from "i18next";
import {Http} from "@capacitor-community/http";

// Helper to format date as YYYY-MM-DD
function formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
}

export async function fetchEuskotrenData(
    originCode: string,
    destinationCode: string,
    date: Date,
    maxTrains: number
): Promise<MetroTrain[]> {
    const formattedDate = formatDate(date);
    const url = `https://www.euskotren.eus/eu/horarios/resultados?parada_origen=${originCode}&parada_destino=${destinationCode}&fecha-hora=${formattedDate}&modo=L3`;

    try {
        const response = await Http.request({
            method: 'GET',
            url: url,
            params: {},
            headers: {
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
                'Accept-Language': 'es-ES,es;q=0.9',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36',
            }
        });
        const html = response.data;
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');

        const trainSchedules: MetroTrain[] = [];
        const resultsTable = doc.getElementById('tablaResultados');

        if (resultsTable) {
            const rows = resultsTable.querySelectorAll('tr');
            rows.forEach(row => {

                const horaSalidaElement = row.querySelector('#horaSalida h2');
                const horaLlegadaElement = row.querySelector('#horaLlegada h2');

                const departureTime = horaSalidaElement?.textContent?.trim() || '';
                const arrivalTime = horaLlegadaElement?.textContent?.trim() || '';

                const originName = (() => {
                    const text = row.querySelector('#resultados p:nth-child(1)')?.textContent
                        ?.replace('Jatorria:', '')
                        .trim() || '';

                    // Capitalizar cada palabra separada por espacios, '/', o '-'
                    return text
                        .split(/([ /-])/g) // separa y conserva los separadores
                        .map(word => {
                            // Si es un separador, devolver tal cual
                            if (word === ' ' || word === '/' || word === '-') return word;
                            return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
                        })
                        .join('');
                })();


                let destinationName = '';
                const destinationPTextContent = row.querySelector('#resultados p:nth-child(2)')?.textContent;

                if (destinationPTextContent) {
                    // Obtener la parte después de ':' si existe, o todo el texto
                    destinationName = destinationPTextContent.includes(':')
                        ? destinationPTextContent.split(':').pop().trim()
                        : destinationPTextContent.trim();

                    // Capitalizar cada palabra separada por espacios, '/', o '-'
                    destinationName = destinationName
                        .split(/([ /-])/g) // separa y conserva los separadores
                        .map(word => {
                            if (word === ' ' || word === '/' || word === '-') return word;
                            return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
                        })
                        .join('');
                }
                console.log('Raw destination name:', destinationName);

                if (destinationName.toLowerCase().includes('zazpi') || destinationName.toLowerCase().includes('casco')) {
                    destinationName = i18next.t('CASCO_VIEJO_DISPLAY_NAME');
                } else {
                    destinationName = destinationName.replace('-Bilbao', '').trim();
                }




                if (departureTime && arrivalTime && originName && destinationName) {
                    const now = new Date();
                    const [depHour, depMin] = departureTime.split(':').map(Number);
                    const departureDate = new Date(date.getFullYear(), date.getMonth(), date.getDate(), depHour, depMin);

                    if (departureDate.getTime() >= now.getTime()) {
                        const [arrHour, arrMin] = arrivalTime.split(':').map(Number);
                        const arrivalDate = new Date(date.getFullYear(), date.getMonth(), date.getDate(), arrHour, arrMin);

                        if (arrivalDate < departureDate) {
                            arrivalDate.setDate(arrivalDate.getDate() + 1);
                        }

                        const estimated = Math.max(0, Math.floor((departureDate.getTime() - now.getTime()) / 60000));
                        if (maxTrains < estimated) {
                            return;
                        }
                        const duration = Math.floor((arrivalDate.getTime() - departureDate.getTime()) / 60000);

                        const year = departureDate.getFullYear();
                        const month = String(departureDate.getMonth() + 1).padStart(2, '0');
                        const day = String(departureDate.getDate()).padStart(2, '0');
                        const hours = String(departureDate.getHours()).padStart(2, '0');
                        const minutes = String(departureDate.getMinutes()).padStart(2, '0');
                        const seconds = String(departureDate.getSeconds()).padStart(2, '0');
                        const formattedTime = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;

                        trainSchedules.push({
                            Wagons: 0,
                            Estimated: estimated,
                            Direction: destinationName,
                            Time: formattedTime,
                            TimeRounded: departureTime,
                            Duration: duration,
                            Transfer: false,
                        });
                    }
                }
            });
        }
        return trainSchedules;

    } catch (error) {
        console.error(`Error fetching Euskotren L3 data for ${originCode} to ${destinationCode}:`, error);
        return [];
    }
}

export async function getEuskotrenStopTrains(display: Display, maxTrains: number): Promise<MetroStopTrains> {
    const today = new Date();
    if (!display.origin || !display.destination) {
        return {
            Display: display,
            Platform1: [],
            Platform2: [],
            isRoute: false
        };
    }

    const platform1Trains = await fetchEuskotrenData(display.origin.Code, display.destination.Code, today, maxTrains);
    const platform2Trains = await fetchEuskotrenData(display.destination.Code, display.origin.Code, today, maxTrains);

    return {
        Display: display,
        Platform1: platform1Trains.sort((a, b) => a.Estimated - b.Estimated),
        Platform2: platform2Trains.sort((a, b) => a.Estimated - b.Estimated),
        isRoute: true
    };
}

export async function getEuskotrenDisplaysTrains(displays: Display[], maxTrains: number = 60): Promise<MetroStopTrains[]> {
    const promises = displays.map(display => getEuskotrenStopTrains(display, maxTrains));
    return Promise.all(promises);
}

export async function planTrip(params: {
    origen: string;
    destino: string;
    fecha: string; // DD-MM-YYYY
    hora_inicio: number; // float
    hora_fin: number; // float
}) {
    const url = `https://www.euskotren.eus/eu/horarios/resultados?parada_origen=${params.origen}&parada_destino=${params.destino}&fecha-hora=${params.fecha}&modo=L3`;

    try {
        const response = await Http.request({
            method: 'GET',
            url: url,
            params: {},
            headers: {
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
                'Accept-Language': 'es-ES,es;q=0.9',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36',
            }
        });
        const html = response.data;
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');

        const trips: any[] = [];
        const resultsTable = doc.getElementById('tablaResultados');

        let totalDuration = 0;
        let tripCount = 0;

        if (resultsTable) {
            const rows = resultsTable.querySelectorAll('tr');
            rows.forEach(row => {
                const horaSalidaElement = row.querySelector('#horaSalida h2');
                const horaLlegadaElement = row.querySelector('#horaLlegada h2');

                const departureTime = horaSalidaElement?.textContent?.trim() || '';
                const arrivalTime = horaLlegadaElement?.textContent?.trim() || '';

                if (departureTime && arrivalTime) {
                    const [depHour, depMin] = departureTime.split(':').map(Number);
                    const [arrHour, arrMin] = arrivalTime.split(':').map(Number);

                    const departureDate = new Date();
                    departureDate.setHours(depHour, depMin, 0, 0);

                    const arrivalDate = new Date();
                    arrivalDate.setHours(arrHour, arrMin, 0, 0);

                    if (arrivalDate < departureDate) {
                        arrivalDate.setDate(arrivalDate.getDate() + 1);
                    }

                    const duration = Math.floor((arrivalDate.getTime() - departureDate.getTime()) / 60000);

                    // Filter by time slot
                    if (depHour >= params.hora_inicio && depHour < params.hora_fin) {
                        trips.push({
                            originArrivalTimeRounder: departureTime,
                            destinyArrivalTimeRounder: arrivalTime,
                            duration: duration,
                        });
                        totalDuration += duration;
                        tripCount++;
                    }
                }
            });
        }

        const averageDuration = tripCount > 0 ? Math.round(totalDuration / tripCount) : 0;

        return {
            origin: { name: params.origen },
            destiny: { name: params.destino },
            time: averageDuration,
            trips: trips,
        };

    } catch (error) {
        console.error("Error planning Euskotren trip:", error);
        return null;
    }
}
