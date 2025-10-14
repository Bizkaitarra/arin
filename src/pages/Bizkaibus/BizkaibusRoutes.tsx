import React, {useEffect, useState} from "react";
import {useHistory, useParams} from "react-router-dom";
import {
    IonButton,
    IonCard, IonCardContent,
    IonCardHeader,
    IonCardSubtitle,
    IonCardTitle,
    IonCol,
    IonGrid,
    IonIcon,
    IonRow,
    IonText
} from "@ionic/react";
import {BizkaibusRoute, getBizkaibusRoutes} from "../../services/Bizkaibus/Routes";
import {documentOutline, mapOutline, timerOutline} from "ionicons/icons";
import Page from "../Page";
import RouteItineraries from "./RouteItineraries";
import LineHeader from "../../components/Bizkaibus/LineHeader/LineHeader";

interface RouteParams {
    line: string;
}

const BizkaibusRoutes: React.FC = () => {
    const {line} = useParams<RouteParams>();
    const [routes, setRoutes] = useState<BizkaibusRoute[]>([]);
    const [lineName, setLineName] = useState<string>("");
    const history = useHistory();

    useEffect(() => {
        if (line) {
            getBizkaibusRoutes(line).then((data) => {
                setRoutes(data);
                if (data.length > 0) {
                    setLineName(data[0].LineName);
                }
            });
        }
    }, [line]);

    const handleGoToRoute = (route: BizkaibusRoute) => {
        history.push(`/bizkaibus/itinerary/${line}/${route.RouteNumber}`);
    }

    const handleGoToScheduled = (route: BizkaibusRoute) => {
        history.push(`/bizkaibus/scheduled/${line}/${route.RouteNumber}`);
    }

    return (
        <Page title={"Horario de " + line} icon={timerOutline} internalPage={true}>

            <LineHeader line={line} lineName={lineName} />

            <IonGrid>
                {routes.map((route, index) => (
                    <IonRow key={index} style={{borderBottom: "1px solid #ccc"}}>
                        <IonCol size="8">
                            <IonText>{route.RouteName} {route.IsPrincipal}</IonText>
                        </IonCol>

                        <IonCol size="2">
                            <IonButton onClick={() => handleGoToRoute(route)} size="small" color="danger"><IonIcon icon={mapOutline}></IonIcon></IonButton>
                        </IonCol>
                        <IonCol size="2">
                            <IonButton onClick={() => handleGoToScheduled(route)} size="small" color="danger"><IonIcon
                                icon={timerOutline}></IonIcon></IonButton>
                        </IonCol>
                    </IonRow>
                ))}
            </IonGrid>
        </Page>
    );
};

export default BizkaibusRoutes;