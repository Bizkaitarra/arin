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
    busOutline,
    informationCircleOutline,
    listOutline,
    menuOutline,
    settingsOutline,
    trainOutline
} from "ionicons/icons";
import {useHistory, useLocation} from 'react-router-dom'; // Importa useHistory
import ArinRide from "../components/ArinRide";


interface PageProps {
    title: string;
    icon?: string;
    children: React.ReactNode;
}

const Page: React.FC<PageProps> = ({ title, icon, children }) => {
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

    const handleMenuFromTutorial = (isOpen: boolean) => {
        console.log('handleMenuFromTutorial', isOpen);
        setShowModal(isOpen);  // Si isOpen es true, abre el menú; si es false, lo cierra
    };

    return (
        <>
            {/* Modal en lugar del menú lateral */}
                <IonModal isOpen={showModal} onDidDismiss={() => setShowModal(false)}>
                    <IonHeader>
                        <IonToolbar>
                            <IonTitle>{t('Menú')}</IonTitle>
                            <IonButtons slot="end">
                                <IonButton onClick={() => setShowModal(false)}>{t('Cerrar')}</IonButton>
                            </IonButtons>
                        </IonToolbar>
                    </IonHeader>
                    <IonContent>
                        <IonList>
                            <h3 className="section-title">Bizkaibus</h3>
                            <IonItem id={"menu-visores-bizkaibus"} button onClick={() => handleNavigation("/bizkaibus-viewers")}>
                                <IonIcon slot="start" icon={busOutline} />
                                <IonLabel>{t('Visores')}</IonLabel>
                            </IonItem>
                            <IonItem id={"menu-add-bizkaibus"} button onClick={() => handleNavigation("/configure-bizkaibus")}>
                                <IonIcon slot="start" icon={addCircleOutline} />
                                <IonLabel>{t('Añadir paradas')}</IonLabel>
                            </IonItem>
                            <IonItem id={"menu-manage-bizkaibus"} button onClick={() => handleNavigation("/manage-bizkaibus-stops")}>
                                <IonIcon slot="start" icon={listOutline} />
                                <IonLabel>{t('Mis paradas')}</IonLabel>
                            </IonItem>
                            <h3 id={"menu-title-metro-bilbao"} className="section-title">Metro Bilbao</h3>

                            <IonItem button onClick={() => handleNavigation("/metro-bilbao-viewers")}>
                                <IonIcon slot="start" icon={trainOutline} />
                                <IonLabel>{t('Visores')}</IonLabel>
                            </IonItem>
                            <IonItem button onClick={() => handleNavigation("/configure-metro-bilbao")}>
                                <IonIcon slot="start" icon={addCircleOutline} />
                                <IonLabel>{t('Añadir paradas')}</IonLabel>
                            </IonItem>
                            <IonItem button onClick={() => handleNavigation("/manage-metro-bilbao-stops")}>
                                <IonIcon slot="start" icon={listOutline} />
                                <IonLabel>{t('Mis paradas')}</IonLabel>
                            </IonItem>
                            <h3 className="section-title">{t('General')}</h3>
                            <IonItem id={"menu-configuration"} button onClick={() => handleNavigation("/configuration")}>
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
                                <IonButton id={"open-menu"} onClick={() => setShowModal(true)}>
                                    <IonIcon icon={menuOutline} />
                                </IonButton>
                            </IonButtons>


                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                                <IonTitle id={"arin-header-title"}>{title}</IonTitle>
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
                    <IonContent id={"general-content"} className="ion-padding">
                        {children}

                    </IonContent>
                    <ArinRide onMenuOpen={handleMenuFromTutorial} showModal={showModal}/>


                </IonPage>
        </>
    );
};

export default Page;
