import React, {useState} from 'react';
import {IonButton, IonIcon, IonItem, IonLabel, IonList, IonPopover} from '@ionic/react';
import {add, repeatOutline} from 'ionicons/icons';
import {useHistory} from 'react-router-dom';
import {useTranslation} from 'react-i18next';

const EuskotrenAddVisorButton: React.FC = () => {
    const [showPopover, setShowPopover] = useState(false);
    const history = useHistory();
    const { t } = useTranslation();

    const handleAddRoute = () => {
        setShowPopover(false);
        history.push('/euskotren-add-route');
    };

    return (
        <>
            <IonButton
                color="success"
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
                    <IonItem button onClick={handleAddRoute}>
                        <IonIcon icon={repeatOutline} slot="start" />
                        <IonLabel>{t('Añadir viaje (origen-destino)')}</IonLabel>
                    </IonItem>
                </IonList>
            </IonPopover>
        </>
    );
};

export default EuskotrenAddVisorButton;
