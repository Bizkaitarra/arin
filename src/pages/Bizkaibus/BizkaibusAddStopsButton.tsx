import React, { useState } from 'react';
import {
    IonButton,
    IonIcon,
    IonItem,
    IonLabel,
    IonList,
    IonPopover
} from '@ionic/react';
import {
    add,
    businessOutline,
    locateOutline
} from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const BizkaibusAddStopButton: React.FC = () => {
    const [showPopover, setShowPopover] = useState(false);
    const history = useHistory();
    const { t } = useTranslation();

    const handleSearchByTown = () => {
        setShowPopover(false);
        history.push('/bizkaibus-add-stop-by-town');
    };

    const handleSearchByLocation = () => {
        setShowPopover(false);
        history.push('/bizkaibus-add-stop-by-location');
    };

    return (
        <>
            <IonButton
                color="primary"
                expand="block"
                onClick={() => setShowPopover(true)}
            >
                <IonIcon icon={add} />
                {t('Añadir parada')}
            </IonButton>

            <IonPopover
                isOpen={showPopover}
                onDidDismiss={() => setShowPopover(false)}
            >
                <IonList>
                    <IonItem button onClick={handleSearchByTown}>
                        <IonIcon icon={businessOutline} slot="start" />
                        <IonLabel>{t('Buscar paradas por pueblo')}</IonLabel>
                    </IonItem>
                    <IonItem button onClick={handleSearchByLocation}>
                        <IonIcon icon={locateOutline} slot="start" />
                        <IonLabel>{t('Buscar paradas por localización')}</IonLabel>
                    </IonItem>
                </IonList>
            </IonPopover>
        </>
    );
};

export default BizkaibusAddStopButton;
