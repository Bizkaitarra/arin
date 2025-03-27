import paradas from '../../data/paradas.json';
import {Parada} from "../BizkaibusStorage";

export interface Itinerary {
    Name: string;
    Line: string;
    Stops: Parada[];
}

export async function getItinerary(lineCode: string, routeNumber: string, direction: string): Promise<Itinerary> {
    const url = `https://apli.bizkaia.net/apps/danok/tqws/tq.asmx/GetItinerarioLinea_JSON?callback=jsonCallbackParadas&sCodigoLinea=${lineCode}&sNumeroRuta=${routeNumber}&sSentido=${direction}`;

    try {
        const response = await fetch(url);
        let text = await response.text();
        const data = parseJsonCallback(text)
        console.log('data consuilta' ,data.Consulta);

        if (data.STATUS !== "OK" || !data.Consulta || !data.Consulta.Paradas) {
            throw new Error("Respuesta inesperada de la API");
        }

        // Se obtiene la lista de paradas del itinerario en el orden devuelto por la API
        const apiStops = data.Consulta.Paradas;

        // Se mapean las paradas del itinerario al listado importado, respetando el orden
        const stops =  apiStops.map((apiStop: any) => {
            return paradas.find((p: Parada) => p.PARADA === apiStop.PR_CODRED);
        }).filter((stop: Parada | undefined): stop is Parada => Boolean(stop));
        return {
            Name: data.Consulta.DescripcionRuta,
            Line: data.Consulta.Linea,
            Stops: stops,
        }
    } catch (error) {
        console.error("Error al obtener el itinerario:", error);
        return {
            Name: "",
            Line: "",
            Stops: [],
        };
    }
}

function parseJsonCallback(input: string): any {
    const match = input.match(/jsonCallbackParadas\((.*)\);?/s);
    if (!match || match.length < 2) {
        throw new Error("Formato no válido");
    }

    const jsonString = match[1];
    try {
        return JSON.parse(jsonString.replace(/'(.*?)'/g, '"$1"'));
    } catch (error) {
        throw new Error("Error al parsear el JSON");
    }
}
