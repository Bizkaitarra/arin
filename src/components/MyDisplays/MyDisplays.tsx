import React, {useEffect, useState} from 'react';
import {useTranslation} from "react-i18next";
import Page from "../../pages/Page";
import {reorderThreeOutline, settingsOutline, trashBinOutline} from "ionicons/icons";
import {
    IonButton,
    IonIcon,
    IonItem,
    IonList,
    IonReorder,
    IonReorderGroup,
    IonText,
    useIonToast,
    useIonViewWillEnter
} from "@ionic/react";

import {StopsStorage} from "../../services/StopsStorage";
import {Stop} from "../../services/Stop";
import KBusStopTitle from "../KBus/StopTitle/KBusStopTitle";
import {KBusStop} from "../../services/KBus/KbusStop";
import RenameStopComponent from "../RenameStopComponent/RenameStopComponent";
import BizkaibusAddStopButton from "../../pages/Bizkaibus/BizkaibusAddStopsButton";
import {BIZKAIBUS_TYPE, KBUS_TYPE, METRO_TYPE, RENFE_TYPE} from "../../services/StopType";
import KBusAddButton from "../KBus/KBusAddButton/KBusAddButton";
import MetroBilbaoAddVisorButton from "../MetroBilbao/MetroBilbaoAddVisorButton";
import RenfeAddButton from "../Renfe/RenfeAddButton/RenfeAddButton";

interface MyDisplaysProps {
    storageService: StopsStorage;
    stopType: string;
}

const MyDisplays: React.FC<MyDisplaysProps> = ({storageService, stopType}) => {
    const [selectedStops, setSelectedStops] = useState<Stop[]>([]);
    const [presentToast] = useIonToast();
    const { t } = useTranslation();


    useIonViewWillEnter(() => {

        const fetchStations = async () => {
            try {
                // Cargar paradas guardadas solo después de cargar estaciones
                const savedStations = storageService.getStations(true).filter(station => station.isFavorite);
                console.log('stops', savedStations);
                setSelectedStops(savedStations);
            } catch (error) {
                console.error(t("Error al cargar las estaciones:"), error);
            }
        };
        fetchStations();
    }, []);

    useEffect(() => {
        if (selectedStops.length > 0) {
            const stopIds = selectedStops.map((stop) => stop.id);
            storageService.saveStationIds(stopIds);
        }
    }, [selectedStops]);

    const handleRemoveStop = (id: string) => {
        const stops = selectedStops.filter(stop => stop.id !== id);
        storageService.saveStationIds(stops.map(stop => stop.id));
        setSelectedStops(stops);
        presentToast({
            message: t('`Parada eliminada`'),
            duration: 2000,
            color: 'success'
        });
    };
    const handleStopRename = (newStopName: string, stop: Stop) => {
        stop.customName = newStopName;
        const updatedStops = selectedStops.map(s =>
            s.id === stop.id ? { ...s, customName: newStopName } : s
        );
        storageService.saveRenamedStation(stop);
        setSelectedStops(updatedStops);
        presentToast({
            message: t('`Parada renombrada`'),
            duration: 2000,
            color: 'success'
        });
    };

    const handleReorder = (event: CustomEvent) => {
        const fromIndex = event.detail.from;
        const toIndex = event.detail.to;
        const reorderedList = [...selectedStops];
        const [movedItem] = reorderedList.splice(fromIndex, 1);
        reorderedList.splice(toIndex, 0, movedItem);
        setSelectedStops(reorderedList);
        event.detail.complete();
    };

    return (
        <>
            {selectedStops.length > 0 ? (
                <>
                    <IonList>
                        <IonReorderGroup disabled={false} onIonItemReorder={handleReorder}>
                            {selectedStops.map((stop) => (
                                <IonItem key={stop.id}>
                                    {
                                        (() => {
                                            switch (stopType) {
                                                case KBUS_TYPE:
                                                    return <KBusStopTitle stop={stop as KBusStop}/>;
                                                case 'BizkaibusStop':
                                                    return <p>Conexión con líneas interurbanas</p>;
                                                case 'MetroBilbaoStop':
                                                    return <p>Acceso adaptado y parking cercano</p>;
                                                default:
                                                    return null;
                                            }
                                        })()
                                    }
                                    <RenameStopComponent stop={stop} stopType={stopType} onRename={handleStopRename} />

                                    <IonButton fill="clear" slot="end" color="danger" size="default"
                                               onClick={() => handleRemoveStop(stop.id)}>
                                        <IonIcon icon={trashBinOutline}/>
                                    </IonButton>

                                    <IonReorder slot="start">
                                        <IonIcon size="default" icon={reorderThreeOutline}/>
                                    </IonReorder>
                                </IonItem>
                            ))}
                        </IonReorderGroup>
                    </IonList>
                </>
            ) : (
                <div style={{ textAlign: 'center', marginTop: '2rem' }}>
                    <IonText>
                        <h2>{t('No tienes visores favoritos configurados')}</h2>
                        <p>{t('Para poder ver tus visores favoritos, debes configurarlos en la página de configuración')}.</p>
                    </IonText>

                </div>
            )}
            {
                (() => {
                    switch (stopType) {
                        case KBUS_TYPE:
                            return <KBusAddButton/>;
                        case BIZKAIBUS_TYPE:
                            return <BizkaibusAddStopButton/>;
                        case METRO_TYPE:
                            return <MetroBilbaoAddVisorButton/>;
                        case RENFE_TYPE:
                            return <RenfeAddButton/>;
                        default:
                            return null;
                    }
                })()
            }
        </>
    );

};

export default MyDisplays;
