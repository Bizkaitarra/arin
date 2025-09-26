import React, {useEffect, useState} from 'react';
import {
    IonButton,
    IonButtons,
    IonChip,
    IonContent, IonFooter,
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
    arrowBackOutline,
    busOutline,
    informationCircleOutline,
    listOutline,
    mapOutline,
    menuOutline,
    settingsOutline,
    trainOutline
} from "ionicons/icons";
import {useHistory, useLocation} from 'react-router-dom';
import {App} from '@capacitor/app';
import {Toast} from '@capacitor/toast';
import ReviewModal from "./ReviewModal";
import AdBanner from "../components/AdBanner";

interface PageProps {
    title: string;
    icon?: string;
    children: React.ReactNode;
    internalPage?: boolean;
}

const Page: React.FC<PageProps> = ({title, icon, children, internalPage = false}) => {
    const {t} = useTranslation();
    const [showModal, setShowModal] = useState(false);
    const history = useHistory();  // Instancia el hook de historia
    const location = useLocation();
    const [transportType, setTransportType] = useState('');
    const [exitAttempt, setExitAttempt] = useState(false);

    useEffect(() => {
        let backButtonListener: any;

        const setupBackButtonListener = async () => {
            backButtonListener = await App.addListener('backButton', () => {
                if (history.length > 1) {
                    history.goBack(); // Si hay historial, vuelve atrás
                } else {
                    if (exitAttempt) {
                        App.exitApp(); // Cierra la app si ya ha pulsado una vez antes
                    }
                    else {
                        setExitAttempt(true);
                        Toast.show({text: 'Pulsa otra vez para salir'});

                        setTimeout(() => {
                            setExitAttempt(false); // Resetea el intento después de 2 segundos
                        }, 2000);
                    }
                }
            });
        };

        setupBackButtonListener();

        return () => {
            if (backButtonListener) {
                backButtonListener.remove(); // Limpia el listener al desmontar
            }
        };
    }, [exitAttempt, history]);

    useEffect(() => {
        if (location.pathname.includes("bizkaibus")) {
            setTransportType('Bizkaibus');
        } else if (location.pathname.includes("metro-bilbao")) {
            setTransportType('Metro Bilbao');
        } else if (location.pathname.includes("renfe")) {
            setTransportType('Renfe');
        } else if (location.pathname.includes("k-bus")) {
            setTransportType('KBus');
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

    const [showReviewModal, setShowReviewModal] = useState(false);

    useEffect(() => {
        const launchCount = parseInt(localStorage.getItem("launchCount") || "0", 10) + 1;
        localStorage.setItem("launchCount", launchCount.toString());

        if (launchCount === 5) { // Mostrar después de 5 usos
            setShowReviewModal(true);
        }
    }, []);

    const transportInfo = {
        'Bizkaibus': { icon: busOutline, className: 'bizkaibus-header-icon' },
        'Metro Bilbao': { icon: trainOutline, className: 'metro-header-icon' },
        'Renfe': { icon: trainOutline, className: 'renfe-header-icon' },
        'KBus': { icon: mapOutline, className: 'kbus-header-icon' }
    };

    return (
        <>
            <ReviewModal isOpen={showReviewModal} onClose={() => setShowReviewModal(false)}/>

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
                            <IonIcon slot="start" icon={busOutline}/>
                            <IonLabel>{t('Visores')}</IonLabel>
                        </IonItem>
                        <IonItem button onClick={() => handleNavigation("/bizkaibus-my-displays")}>
                            <IonIcon slot="start" icon={listOutline}/>
                            <IonLabel>{t('Mis visores')}</IonLabel>
                        </IonItem>

                        <h3 className="section-title">Metro Bilbao</h3>
                        <IonItem button onClick={() => handleNavigation("/metro-bilbao-displays")}>
                            <IonIcon slot="start" icon={trainOutline}/>
                            <IonLabel>{t('Visores')}</IonLabel>
                        </IonItem>
                        <IonItem button onClick={() => handleNavigation("/metro-bilbao-my-displays")}>
                            <IonIcon slot="start" icon={listOutline}/>
                            <IonLabel>{t('Mis visores')}</IonLabel>
                        </IonItem>

                        <h3 className="section-title">Renfe Cercanias</h3>
                        <IonItem button onClick={() => handleNavigation("/renfe-displays")}>
                            <IonIcon slot="start" icon={trainOutline}/>
                            <IonLabel>{t('Visores')}</IonLabel>
                        </IonItem>
                        <IonItem button onClick={() => handleNavigation("/renfe-my-displays")}>
                            <IonIcon slot="start" icon={listOutline}/>
                            <IonLabel>{t('Mis visores')}</IonLabel>
                        </IonItem>

                        <h3 className="section-title">K Bus Barakaldo</h3>
                        <IonItem button onClick={() => handleNavigation("/k-bus-displays")}>
                            <IonIcon slot="start" icon={trainOutline}/>
                            <IonLabel>{t('Visores')}</IonLabel>
                        </IonItem>
                        <IonItem button onClick={() => handleNavigation("/k-bus-my-displays")}>
                            <IonIcon slot="start" icon={listOutline}/>
                            <IonLabel>{t('Mis visores')}</IonLabel>
                        </IonItem>

                        <h3 className="section-title">{t('General')}</h3>
                        <IonItem button onClick={() => handleNavigation("/configuration")}>
                            <IonIcon slot="start" icon={settingsOutline}/>
                            <IonLabel>{t('Configuración')}</IonLabel>
                        </IonItem>
                        <IonItem button onClick={() => handleNavigation("/about-app")}>
                            <IonIcon slot="start" icon={informationCircleOutline}/>
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
                                    <IonIcon icon={arrowBackOutline}/>
                                </IonButton>
                            ) : (
                                <IonButton onClick={() => setShowModal(true)}>
                                    <IonIcon icon={menuOutline}/>
                                </IonButton>
                            )}

                        </IonButtons>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            width: '100%'
                        }}>
                            <IonTitle>{title}</IonTitle>
                            {transportType && transportInfo[transportType] && (
                                <IonChip outline={true}
                                         className={transportInfo[transportType].className}>
                                    <IonIcon icon={transportInfo[transportType].icon}/>
                                    <IonLabel>{transportType}</IonLabel>
                                </IonChip>
                            )}
                        </div>
                    </IonToolbar>
                    <NavigationTabs/>
                </IonHeader>
                <IonContent className="page-content">
                    {children}
                </IonContent>
            </IonPage>
            {!showModal && (
                <IonFooter>

                </IonFooter>
            )}
        </>
    );
};

export default Page;
