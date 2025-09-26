import React from 'react';
import {IonButton, IonIcon} from '@ionic/react';
import {add} from 'ionicons/icons';
import {useHistory} from 'react-router-dom';
import {useTranslation} from 'react-i18next';

const RenfeAddButton: React.FC = () => {
    const history = useHistory();
    const { t } = useTranslation();

    const handleAddStop = () => {
        history.push('/renfe-add-route');
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

export default RenfeAddButton;
