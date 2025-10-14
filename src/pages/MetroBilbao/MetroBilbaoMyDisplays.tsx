import {
    IonButton,
    IonIcon,
    IonItem,
    IonLabel,
    IonList,
    IonReorder,
    IonReorderGroup,
    IonText,
    useIonViewWillEnter,
} from '@ionic/react';
import {reorderThreeOutline, settingsOutline, trashBinOutline} from 'ionicons/icons';
import {ItemReorderEventDetail} from '@ionic/core';
import Page from "../Page";
import {getSavedDisplays, saveMetroDisplays} from "../../services/MetroBilbaoStorage";
import {useTranslation} from "react-i18next";
import MetroBilbaoAddTripButton from "../../components/MetroBilbao/MetroBilbaoAddVisorButton";
import {Display} from "../../services/MetroBilbao/Display";
import {useCustomToast} from "../../components/ArinToast";
import {useEffect, useState} from "react";


const MetroBilbaoMyDisplays: React.FC = () => {
    const [selectedStops, setSelectedStops] = useState<Display[]>([]);
    const { presentArinToast } = useCustomToast();
    const {t} = useTranslation();

    useIonViewWillEnter(() => {
        setSelectedStops(getSavedDisplays);
    }, []);

    useEffect(() => {
        if (selectedStops.length > 0) {
            saveMetroDisplays(selectedStops);
        }
    }, [selectedStops]);


    const handleRemoveDisplay = (display: Display) => {
        const stops = selectedStops.filter(
            (currentDisplay) => currentDisplay.origin.Code !== display.origin.Code || currentDisplay.destination?.Code !== display.destination?.Code
        );

        saveMetroDisplays(stops);
        setSelectedStops(stops);

        presentArinToast({
            message: t('Parada eliminada'),
            duration: 2000,
            color: 'danger'
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
        <Page title={`${t('Mis visores')}`} icon={settingsOutline}>
            {selectedStops.length > 0 ? (
                <>
                    <p>{t('Ordena las paradas seleccionadas y elimina las que no desees seguir viendo')}</p>
                    <IonList>
                        <IonReorderGroup disabled={false} onIonItemReorder={handleReorder}>
                            {selectedStops.map((display) => (
                                <IonItem key={display.origin.Code}>
                                    <IonLabel>
                                        <h3>
                                            {display.origin.Name}
                                            {display.destination && ` → ${display.destination.Name}`}
                                        </h3>
                                        <p>{display.origin.Lines.join(',')}</p>
                                    </IonLabel>
                                    <IonButton
                                        size="large"
                                        fill="clear"
                                        slot="end"
                                        color="danger"
                                        onClick={() => handleRemoveDisplay(display)}
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
                        <h2>{t('No tienes visores favoritos configurados')}</h2>
                        <p>{t('Para poder ver tus visores favoritos, debes configurarlos en la página de configuración')}.</p>
                    </IonText>

                </div>
            )}
            <MetroBilbaoAddTripButton/>
        </Page>
    );
};

export default MetroBilbaoMyDisplays;
