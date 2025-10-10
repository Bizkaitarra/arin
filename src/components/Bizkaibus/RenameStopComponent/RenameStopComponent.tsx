import React, { useState } from 'react';
import {
    IonButton,
    IonIcon,
    IonModal,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonContent,
    IonItem,
    IonLabel,
    IonInput
} from '@ionic/react';
import { pencilOutline } from 'ionicons/icons';
import { Parada } from "../../../services/BizkaibusStorage";
import './RenameStopComponent.css';
import {useTranslation} from "react-i18next";

interface RenameStopComponentProps {
    stop: Parada;
    onRename: (newName: string, stop: Parada) => void;
}

const RenameStopComponent: React.FC<RenameStopComponentProps> = ({ stop, onRename }) => {
    const { t } = useTranslation();
    const [showModal, setShowModal] = useState(false);
    const [newStopName, setNewStopName] = useState(stop.CUSTOM_NAME || ''); // Inicializar con CUSTOM_NAME si existe

    const handleRenameSubmit = () => {
        if (newStopName.trim()) {
            onRename(newStopName, stop);
        }
        setShowModal(false);
    };

    return (
        <>
            <IonButton fill="clear" slot="end" color="danger" size="default" onClick={() => setShowModal(true)}>
                <IonIcon icon={pencilOutline} />
            </IonButton>

            <IonModal isOpen={showModal} onDidDismiss={() => setShowModal(false)}>
                <IonHeader>
                    <IonToolbar>
                        <IonTitle>{t('Renombrar Estación')}</IonTitle>
                        <IonButtons slot="end">
                            <IonButton onClick={() => setShowModal(false)}>{t('Cerrar')}</IonButton>
                        </IonButtons>
                    </IonToolbar>
                </IonHeader>

                <IonContent className="ion-padding">
                    <IonItem className={"stop-resume-card"} key={stop.PARADA}>
                        <IonLabel>
                            <p><strong>{t('Parada')}:</strong> {stop.PARADA} - {stop.DENOMINACION}</p>
                            {stop.CUSTOM_NAME && stop.CUSTOM_NAME !== stop.DENOMINACION && (
                                <p><strong>{t('Nombre personalizado')}:</strong> {stop.CUSTOM_NAME}</p>
                            )}
                            <p><strong>{t('Municipio')}:</strong> {stop.DESCRIPCION_MUNICIPIO}</p>
                            <p><strong>{t('Provincia')}:</strong> {stop.DESCRIPCION_PROVINCIA}</p>
                        </IonLabel>
                    </IonItem>
                    <IonItem>
                        <IonLabel position="stacked">{t('Nombre personalizado')}</IonLabel>
                        <IonInput
                            value={newStopName}
                            onIonInput={(e) => setNewStopName(e.detail.value!)}
                            placeholder={t('Escribe el nuevo nombre')}
                        />
                    </IonItem>
                    <IonButton expand="block" onClick={handleRenameSubmit}>
                        {t('Guardar')}
                    </IonButton>
                </IonContent>
            </IonModal>
        </>
    );
};

export default RenameStopComponent;
