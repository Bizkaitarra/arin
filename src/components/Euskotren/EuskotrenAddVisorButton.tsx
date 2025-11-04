import React from 'react';
import {IonButton, IonIcon} from '@ionic/react';
import {add, repeatOutline} from 'ionicons/icons';
import {useHistory} from 'react-router-dom';
import {useTranslation} from 'react-i18next';

const EuskotrenAddVisorButton: React.FC = () => {
    const history = useHistory();
    const { t } = useTranslation();

    const handleAddRoute = () => {
        history.push('/euskotren-add-route');
    };

    return (
        <IonButton
            color="success"
            expand="block"
            onClick={handleAddRoute}
        >
            <IonIcon icon={add} />
            {t('Añadir visor')}
        </IonButton>
    );
};

export default EuskotrenAddVisorButton;
