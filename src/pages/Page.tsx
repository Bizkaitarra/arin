import React, {useState} from 'react';
import {
    IonButton,
    IonButtons,
    IonChip,
    IonContent,
    IonHeader,
    IonIcon,
    IonItem,
    IonLabel,
    IonList,
    IonModal,
    IonPage,
    IonTitle,
    IonToolbar,
    useIonViewWillLeave
} from '@ionic/react';
import NavigationTabs from "../components/NavigationTabs";
import {clearIntervals} from "../services/IntervalServices";
import {useTranslation} from "react-i18next";
import {
    addCircleOutline,
    arrowBackOutline,
    busOutline,
    informationCircleOutline,
    listOutline,
    menuOutline,
    settingsOutline,
    trainOutline
} from "ionicons/icons";
import {useHistory, useLocation} from 'react-router-dom'; // Importa useHistory

interface PageProps {
    title: string;
    icon?: string;
    children: React.ReactNode;
    internalPage?: boolean;
}

const Page: React.FC<PageProps> = ({ title, icon, children, internalPage = false }) => {
    const { t } = useTranslation();
    const [showModal, setShowModal] = useState(false);
    const history = useHistory();  // Instancia el hook de historia
    const location = useLocation();
    const [transportType, setTransportType] = useState('');

    // Determinar el tipo de transporte según la ruta
    useState(() => {
        if (location.pathname.includes("bizkaibus")) {
            setTransportType('Bizkaibus');
        } else if (location.pathname.includes("metro-bilbao")) {
            setTransportType('Metro Bilbao');
        } else {
            setTransportType('');
        }
    }, [location.pathname]);

    useIonViewWillLeave(() => {
        clearIntervals();
    });

    // Función para manejar la navegación y cierre del modal
    const handleNavigation = (path: string) => {
        setShowModal(false);  // Cierra el modal
        history.push(path);    // Navega a la ruta correspondiente
    };

    return (
        <>
            {/* Modal en lugar del menú lateral */}
                <IonModal isOpen={showModal} onDidDismiss={() => setShowModal(false)}>
                    <IonHeader>
                        <IonToolbar>
                            <IonTitle>{t('Menú')}</IonTitle>
                            <IonButtons slot="end">
                                <IonButton onClick={() => setShowModal(false)}>{t('X')}</IonButton>
                            </IonButtons>
                        </IonToolbar>
                    </IonHeader>
                    <IonContent>
                        <IonList>
                            <h3 className="section-title">Bizkaibus</h3>
                            <IonItem button onClick={() => handleNavigation("/bizkaibus-viewers")}>
                                <IonIcon slot="start" icon={busOutline} />
                                <IonLabel>{t('Visores')}</IonLabel>
                            </IonItem>
                            <IonItem button onClick={() => handleNavigation("/manage-bizkaibus-stops")}>
                                <IonIcon slot="start" icon={listOutline} />
                                <IonLabel>{t('Mis paradas')}</IonLabel>
                            </IonItem>
                            <h3 className="section-title">Metro Bilbao</h3>

                            <IonItem button onClick={() => handleNavigation("/metro-bilbao-viewers")}>
                                <IonIcon slot="start" icon={trainOutline} />
                                <IonLabel>{t('Visores')}</IonLabel>
                            </IonItem>
                            <IonItem button onClick={() => handleNavigation("/manage-metro-bilbao-stops")}>
                                <IonIcon slot="start" icon={listOutline} />
                                <IonLabel>{t('Mis paradas')}</IonLabel>
                            </IonItem>
                            <h3 className="section-title">{t('General')}</h3>
                            <IonItem button onClick={() => handleNavigation("/configuration")}>
                                <IonIcon slot="start" icon={settingsOutline} />
                                <IonLabel>{t('Configuración')}</IonLabel>
                            </IonItem>
                            <IonItem button onClick={() => handleNavigation("/about-app")}>
                                <IonIcon slot="start" icon={informationCircleOutline} />
                                <IonLabel>{t('Sobre Arin')}</IonLabel>
                            </IonItem>
                        </IonList>
                    </IonContent>
                </IonModal>

                <IonPage>
                    <IonHeader>
                        <IonToolbar>
                            <IonButtons slot="start">
                                {internalPage ? (
                                    <IonButton onClick={() => history.goBack()}>
                                        <IonIcon icon={arrowBackOutline} />
                                    </IonButton>
                                ) : (
                                    <IonButton onClick={() => setShowModal(true)}>
                                        <IonIcon icon={menuOutline} />
                                    </IonButton>
                                )}

                            </IonButtons>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                                <IonTitle>{title}</IonTitle>
                                {transportType && (
                                    <IonChip outline={true} className={transportType === 'Bizkaibus' ? 'bizkaibus-header-icon' : 'metro-header-icon'}>
                                        <IonIcon icon={transportType === 'Bizkaibus' ? busOutline : trainOutline} />
                                        <IonLabel>{transportType}</IonLabel>
                                    </IonChip>
                                )}
                            </div>
                        </IonToolbar>
                        <NavigationTabs />
                    </IonHeader>
                    <IonContent className="ion-padding">
                        {children}
                    </IonContent>
                </IonPage>
        </>
    );
};

export default Page;
