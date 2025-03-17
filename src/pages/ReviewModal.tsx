import { IonButton, IonModal, IonHeader, IonToolbar, IonTitle, IonContent } from "@ionic/react";
import { requestReview } from "../services/rateApp";
import {useTranslation} from "react-i18next";

const ReviewModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
    const {t} = useTranslation();
    return (
        <IonModal isOpen={isOpen} onDidDismiss={onClose}>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>{t('¿Te gusta Arin?')}</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent className="ion-padding">
                <p>{t('Por favor, ayuda a que Arin sea más conocida. ¿Te gustaría dejar una valoración?')}</p>
                <IonButton expand="full" onClick={requestReview}>{t('Valorar ahora')}</IonButton>
                <IonButton expand="full" color="medium" onClick={onClose}>{t('Cerrar')}</IonButton>
            </IonContent>
        </IonModal>
    );
};

export default ReviewModal;
