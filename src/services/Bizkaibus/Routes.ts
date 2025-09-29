import {loadScheduledBusesByRoute} from "./Schedule";

export interface BizkaibusRoute {
    CodigoLinea: string;
    RouteNumber: string;
    LineName: string;
    RouteName: string;
    Indicence: string;
    IsPrincipal: boolean;
}

export async function getBizkaibusRoutes(lineCode: string): Promise<BizkaibusRoute[]> {
    const url = `https://apli.bizkaia.net/apps/danok/tqws/tq.asmx/GetLineasPrincipalesSecundarias_JSON?callback=%22%22&sCodigoLinea=${lineCode}&sNumeroRuta=&sSentido=&sDescripcionLinea=&sListaCodigosLineas=`;

    try {
        const response = await fetch(url);
        let text = await response.text();

        // Eliminar el prefijo y sufijo no deseado en la respuesta JSONP
        text = text.replace(/^""\(/, '').replace(/\);$/, '');

        const data = JSON.parse(text);

        if (data.STATUS !== "OK" || !data.Consulta || !data.Consulta.Lineas) {
            return [];
        }

        const uniqueRoutes = new Map<string, BizkaibusRoute>();

        for (const line of data.Consulta.Lineas) {
            if (line.Activa === "1") {
                const key = `${line.NumeroRuta}-${line.DenominacionLinea}-${line.DenominacionRuta}-${line.IncidenciaCastellano}`;
                if (!uniqueRoutes.has(key)) {
                    uniqueRoutes.set(key, {
                        CodigoLinea: line.CodigoLinea,
                        RouteNumber: line.NumeroRuta,
                        LineName: line.DenominacionLinea,
                        RouteName: line.DenominacionRuta,
                        Indicence: line.IncidenciaCastellano,
                        IsPrincipal: line.DescripcionTipoRuta === "Principal",
                    });
                }
            }
        }
        return Array.from(uniqueRoutes.values());
    } catch (error) {
        console.error("Error al obtener las rutas de Bizkaibus:", error);
        return [];
    }
}

export async function getBizkaibusLinesByMunicipality(municipalityCode: string): Promise<BizkaibusRoute[]> {
    const url = `https://apli.bizkaia.net/apps/danok/tqws/tq.asmx/GetLineasPrincipalesSecundariasMunicipio_JSON?callback=%22%22&iCodigoProvincia=48&sCodigoMunicipio=${municipalityCode}&sDescripcionMunicipio=`;

    try {
        const response = await fetch(url);
        let text = await response.text();

        text = text.replace(/^""\(/, '').replace(/\);$/, '');

        const data = JSON.parse(text);

        if (data.STATUS !== "OK" || !data.Consulta || !data.Consulta.Lineas) {
            return [];
        }

        const uniqueRoutes = new Map<string, BizkaibusRoute>();

        for (const line of data.Consulta.Lineas) {
            if (line.Activa === "1") {
                const key = `${line.NumeroRuta}-${line.DenominacionLinea}-${line.DenominacionRuta}-${line.IncidenciaCastellano}`;
                if (!uniqueRoutes.has(key)) {
                    uniqueRoutes.set(key, {
                        CodigoLinea: line.CodigoLinea,
                        RouteNumber: line.NumeroRuta,
                        LineName: line.DenominacionLinea,
                        RouteName: line.DenominacionRuta,
                        Indicence: line.IncidenciaCastellano,
                        IsPrincipal: line.DescripcionTipoRuta === "Principal",
                    });
                }
            }
        }
        return Array.from(uniqueRoutes.values());
    } catch (error) {
        console.error("Error al obtener las rutas de Bizkaibus por municipio:", error);
        return [];
    }
}