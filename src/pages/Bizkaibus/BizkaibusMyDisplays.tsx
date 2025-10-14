import React, {useEffect, useState} from 'react';
import {
    IonButton,
    IonIcon,
    IonItem,
    IonLabel,
    IonList,
    IonReorder,
    IonReorderGroup,
    IonText,
    useIonViewWillEnter
} from '@ionic/react';
import {reorderThreeOutline, settingsOutline, trashBinOutline} from 'ionicons/icons';
import {getStations, Parada, saveRenamedStation, saveStationIds} from "../../services/BizkaibusStorage";
import Page from "../Page";
import {useTranslation} from "react-i18next";
import BizkaibusAddStopButton from "./BizkaibusAddStopsButton";
import RenameStopComponent from "../../components/Bizkaibus/RenameStopComponent/RenameStopComponent";
import {useCustomToast} from "../../components/ArinToast";

const BizkaibusMyDisplays: React.FC = () => {
    const [selectedStops, setSelectedStops] = useState<Parada[]>([]);
    const { presentArinToast } = useCustomToast();
    const { t } = useTranslation();


    useIonViewWillEnter(() => {

        const fetchStations = async () => {
            try {
                // Cargar paradas guardadas solo después de cargar estaciones
                const savedStations = getStations(true).filter(station => station.IS_FAVORITE);
                setSelectedStops(savedStations);
            } catch (error) {
                console.error(t("Error al cargar las estaciones:"), error);
            }
        };
        fetchStations();
    }, []);

    useEffect(() => {
        if (selectedStops.length > 0) {
            const stopIds = selectedStops.map((stop) => stop.PARADA);
            saveStationIds(stopIds);
        }
    }, [selectedStops]);

    const handleRemoveStop = (id: string) => {
        const stops = selectedStops.filter(stop => stop.PARADA !== id);
        saveStationIds(stops.map(stop => stop.PARADA));
        setSelectedStops(stops);
        presentArinToast({
            message: t('Parada eliminada'),
            duration: 2000,
            color: 'danger'
        });
    };
    const handleStopRename = (newStopName: string, stop: Parada) => {
        stop.CUSTOM_NAME = newStopName;
        const updatedStops = selectedStops.map(s =>
            s.PARADA === stop.PARADA ? { ...s, CUSTOM_NAME: newStopName } : s
        );
        saveRenamedStation(stop);
        setSelectedStops(updatedStops);
        presentArinToast({
            message: t('Parada renombrada'),
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
        <Page title={`${t('Mis visores')}`} icon={settingsOutline}>
            {selectedStops.length > 0 ? (
                <>
                    <IonList>
                        <IonReorderGroup disabled={false} onIonItemReorder={handleReorder}>
                            {selectedStops.map((stop) => (
                                <IonItem key={stop.PARADA}>
                                    <IonLabel>
                                        <h3>{stop.PARADA} - {stop.CUSTOM_NAME}</h3>
                                        <p>{stop.DESCRIPCION_MUNICIPIO}, {stop.DESCRIPCION_PROVINCIA}</p>
                                    </IonLabel>
                                    <RenameStopComponent stop={stop} onRename={handleStopRename} />

                                    <IonButton fill="clear" slot="end" color="danger" size="default"
                                               onClick={() => handleRemoveStop(stop.PARADA)}>
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
            <BizkaibusAddStopButton/>
        </Page>
    );
};

export default BizkaibusMyDisplays;
