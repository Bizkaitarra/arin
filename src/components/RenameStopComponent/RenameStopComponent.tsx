import React, {useState} from 'react';
import {
    IonButton,
    IonButtons,
    IonContent,
    IonHeader,
    IonIcon,
    IonInput,
    IonItem,
    IonLabel,
    IonModal,
    IonTitle,
    IonToolbar
} from '@ionic/react';
import {pencilOutline} from 'ionicons/icons';
import './RenameStopComponent.css';
import {useTranslation} from "react-i18next";
import {Stop} from "../../services/Stop";
import {KBusStop} from "../../services/KBus/KbusStop";
import KBusStopResume from "../KBus/StopResume/KBusStopResume";
import {KBUS_TYPE} from "../../services/StopType";

interface RenameStopComponentProps {
    stop: Stop;
    onRename: (newName: string, stop: Stop) => void;
    stopType: string;
}

const RenameStopComponent: React.FC<RenameStopComponentProps> = ({ stop, onRename, stopType }) => {
    const { t } = useTranslation();
    const [showModal, setShowModal] = useState(false);
    const [newStopName, setNewStopName] = useState(stop.customName || '');

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
                    <IonItem className={"stop-resume-card"} key={stop.id}>
                        {
                            (() => {
                                switch (stopType) {
                                    case KBUS_TYPE:
                                        return <KBusStopResume stop={stop as KBusStop}/>;
                                    case 'BizkaibusStop':
                                        return <p>{t('Conexión con líneas interurbanas')}</p>;
                                    case 'MetroBilbaoStop':
                                        return <p>{t('Acceso adaptado y parking cercano')}</p>;
                                    default:
                                        return null;
                                }
                            })()
                        }
                        {stop.customName && stop.customName !== stop.name && (
                        <IonLabel>
                                <p><strong>{t('Nombre personalizado')}:</strong> {stop.customName}</p>
                        </IonLabel>
                        )}
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
