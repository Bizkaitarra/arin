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
    useIonToast,
    useIonViewWillEnter,
} from '@ionic/react';
import {reorderThreeOutline, settingsOutline, trashBinOutline} from 'ionicons/icons';
import {ItemReorderEventDetail} from '@ionic/core';
import Page from "../Page";
import {getMetroStops, MetroStop, saveMetroStops} from "../../services/MetroBilbaoStorage";
import {useTranslation} from "react-i18next";
import MetroBilbaoAddStopsButton from "./MetroBilbaoAddStopsButton";


const MetroBilbaoMyStops: React.FC = () => {
    const [selectedStops, setSelectedStops] = useState<MetroStop[]>([]);
    const [presentToast] = useIonToast();
    const { t } = useTranslation();

    useIonViewWillEnter(() => {
        setSelectedStops(getMetroStops(true).filter(parada => parada.IsFavorite));
    }, []);

    useEffect(() => {
        if (selectedStops.length > 0) {
            saveMetroStops(selectedStops);
        }
    }, [selectedStops]);


    const handleRemoveStop = (id: string) => {
        const stops = selectedStops.filter((stop) => stop.Code !== id);
        saveMetroStops(stops);
        setSelectedStops(stops);
        presentToast({
            message: `Parada eliminada`,
            duration: 2000,
            color: 'success'
        });
    };

    const handleReorder = (event: CustomEvent<ItemReorderEventDetail>) => {
        const fromIndex = event.detail.from;
        const toIndex = event.detail.to;

        const reorderedList = Array.from(selectedStops);
        const [movedItem] = reorderedList.splice(fromIndex, 1);
        reorderedList.splice(toIndex, 0, movedItem);

        setSelectedStops(reorderedList);
        event.detail.complete();
    };

    return (
        <Page title={`${t('Mis paradas')}`} icon={settingsOutline}>
        {selectedStops.length > 0 ? (
                <>
                    <p>{t('Ordena las paradas seleccionadas y elimina las que no desees seguir viendo')}</p>
                    <IonList>
                        <IonReorderGroup disabled={false} onIonItemReorder={handleReorder}>
                            {selectedStops.map((stop) => (
                                <IonItem key={stop.Code}>
                                    <IonLabel>
                                        <h3>{stop.Code} - {stop.Name}</h3>
                                        <p>{stop.Lines.join(',')}</p>
                                    </IonLabel>
                                    <IonButton
                                        size="large"
                                        fill="clear"
                                        slot="end"
                                        color="danger"
                                        onClick={() => handleRemoveStop(stop.Code)}
                                    >
                                        <IonIcon icon={trashBinOutline}/>
                                    </IonButton>
                                    <IonReorder slot="start">
                                        <IonIcon size="large" icon={reorderThreeOutline}/>
                                    </IonReorder>
                                </IonItem>
                            ))}
                        </IonReorderGroup>
                    </IonList>
                </>
            ) : (
                <div style={{textAlign: 'center', marginTop: '2rem'}}>
                    <IonText>
                        <h2>{t('No tienes paradas favoritas configuradas')}</h2>
                        <p>{t('Para poder ver tus paradas favoritas, debes configurarlas en la página de configuración')}.</p>
                    </IonText>

                </div>
            )}
            <MetroBilbaoAddStopsButton/>
        </Page>
    );
};

export default MetroBilbaoMyStops;
