import React, {useEffect, useState} from 'react';
import {useTranslation} from "react-i18next";
import {reorderThreeOutline, trashBinOutline} from "ionicons/icons";
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
    useIonViewWillEnter
} from "@ionic/react";
import {StopsStorage} from '../../../services/StopsStorage';
import RenfeAddButton from "../RenfeAddButton/RenfeAddButton";
import {Display} from "../../../services/Display";
import {saveMetroDisplays} from "../../../services/MetroBilbaoStorage";
import {ItemReorderEventDetail} from "@ionic/core";

interface MyDisplaysProps {
    storageService: StopsStorage;
    stopType: string;
}

const MyDisplays: React.FC<MyDisplaysProps> = ({storageService, stopType}) => {
    const [selectedStops, setSelectedStops] = useState<Display[]>([]);
    const [presentToast] = useIonToast();
    const { t } = useTranslation();


    useIonViewWillEnter(() => {

        const fetchStations = async () => {
            try {
                // Cargar paradas guardadas solo después de cargar estaciones
                const savedDisplays = storageService.getSavedDisplays();
                setSelectedStops(savedDisplays);
            } catch (error) {
                console.error(t("Error al cargar las estaciones:"), error);
            }
        };
        fetchStations();
    }, []);

    useEffect(() => {
        if (selectedStops.length > 0) {
            storageService.saveDisplays(selectedStops);
        }
    }, [selectedStops]);

    const handleRemoveDisplay = (display: Display) => {
        const stops = selectedStops.filter(
            (currentDisplay) => currentDisplay.origin.id !== display.origin.id || currentDisplay.destination?.id !== display.destination?.id
        );
        storageService.saveDisplays(stops);
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
        <>
            {selectedStops.length > 0 ? (
                <>
                    <IonList>
                        <IonReorderGroup disabled={false} onIonItemReorder={handleReorder}>
                            {selectedStops.map((display) => (
                                <IonItem key={display.origin.id + display.destination.id}>
                                    <IonLabel>{display.origin.name + ' - ' + display.destination.name}</IonLabel>

                                    <IonButton fill="clear" slot="end" color="danger" size="default"
                                               onClick={() => handleRemoveDisplay(display)}>
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
            <RenfeAddButton/>
        </>
    );

};

export default MyDisplays;
