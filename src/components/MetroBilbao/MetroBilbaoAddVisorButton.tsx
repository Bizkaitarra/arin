import React, {useState} from 'react';
import {IonButton, IonIcon, IonItem, IonLabel, IonList, IonPopover} from '@ionic/react';
import {add, repeatOutline, subwayOutline} from 'ionicons/icons';
import {useHistory} from 'react-router-dom';
import {useTranslation} from 'react-i18next';

const MetroBilbaoAddVisorButton: React.FC = () => {
    const [showPopover, setShowPopover] = useState(false);
    const history = useHistory();
    const { t } = useTranslation();

    const handleAddStop = () => {
        setShowPopover(false);
        history.push('/metro-bilbao-add-stop');
    };

    const handleAddRoute = () => {
        setShowPopover(false);
        history.push('/metro-bilbao-add-route');
    };

    return (
        <>
            <IonButton
                color="primary"
                expand="block"
                onClick={() => setShowPopover(true)}
            >
                <IonIcon icon={add} />
                {t('Añadir visor')}
            </IonButton>

            <IonPopover
                isOpen={showPopover}
                onDidDismiss={() => setShowPopover(false)}
            >
                <IonList>
                    <IonItem button onClick={handleAddStop}>
                        <IonIcon icon={subwayOutline} slot="start" />
                        <IonLabel>{t('Añadir parada de Metro')}</IonLabel>
                    </IonItem>
                    <IonItem button onClick={handleAddRoute}>
                        <IonIcon icon={repeatOutline} slot="start" />
                        <IonLabel>{t('Añadir viaje (origen-destino)')}</IonLabel>
                    </IonItem>
                </IonList>
            </IonPopover>
        </>
    );
};

export default MetroBilbaoAddVisorButton;
