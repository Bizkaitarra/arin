import React from 'react';
import {IonButton, IonIcon} from '@ionic/react';
import {add} from 'ionicons/icons';
import {useHistory} from 'react-router-dom';
import {useTranslation} from 'react-i18next';

const MetroBilbaoAddStopsButton: React.FC = () => {
    const history = useHistory();
    const { t } = useTranslation();


    return (
        <>
            <IonButton
                color="primary"
                expand="block"
                onClick={() => history.push(`/metro-bilbao-add-stop`)}
            >
                <IonIcon icon={add} />
                {t('Añadir parada')}
            </IonButton>
        </>
    );
};

export default MetroBilbaoAddStopsButton;
