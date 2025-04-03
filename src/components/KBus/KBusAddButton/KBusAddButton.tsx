import React from 'react';
import {IonButton, IonIcon} from '@ionic/react';
import {add} from 'ionicons/icons';
import {useHistory} from 'react-router-dom';
import {useTranslation} from 'react-i18next';

const KBusAddButton: React.FC = () => {
    const history = useHistory();
    const { t } = useTranslation();

    const handleAddStop = () => {
        history.push('/k-bus-add-stop');
    };

    return (
        <>
            <IonButton
                color="primary"
                expand="block"
                onClick={() => handleAddStop()}
            >
                <IonIcon icon={add} />
                {t('Añadir visor')}
            </IonButton>
        </>
    );
};

export default KBusAddButton;
