import React from 'react';
import {
    IonPage,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonMenuButton,
    IonContent,
    IonIcon,
    useIonViewWillLeave, IonMenu, IonList, IonItem, IonLabel, IonMenuToggle
} from '@ionic/react';
import NavigationTabs from "../components/NavigationTabs";
import {clearIntervals} from "../services/IntervalServices";
import LanguageSwitcher from "../components/LanguageSwitcher";
import {useTranslation} from "react-i18next";

interface PageProps {
    title: string;
    icon?: string;
    children: React.ReactNode;
}

const Page: React.FC<PageProps> = ({title, icon, children}) => {
    const { t } = useTranslation();
    useIonViewWillLeave(() => {
        clearIntervals();
    });
    return (
        <>
            <IonMenu contentId="main">
                <IonHeader>
                    <IonToolbar>
                        <IonTitle>{t('Menú')}</IonTitle>
                    </IonToolbar>
                </IonHeader>
                <IonContent>
                    <IonList>
                        <IonItem>
                            <IonLabel><strong>Bizkaibus</strong></IonLabel>
                        </IonItem>
                        <IonMenuToggle>
                            <IonItem routerLink="/bizkaibus-viewers" className="submenu-item">
                                <IonLabel>{t('Visor')}</IonLabel>
                            </IonItem>
                        </IonMenuToggle>
                        <IonMenuToggle>
                            <IonItem routerLink="/configure-bizkaibus" className="submenu-item">
                                <IonLabel>{t('Añadir paradas')}</IonLabel>
                            </IonItem>
                        </IonMenuToggle>
                        <IonMenuToggle>
                            <IonItem routerLink="/manage-bizkaibus-stops" className="submenu-item">
                                <IonLabel>{t('Mis paradas')}</IonLabel>
                            </IonItem>
                        </IonMenuToggle>
                        <IonMenuToggle>
                            <IonItem>
                                <IonLabel><strong>Metro Bilbao</strong></IonLabel>
                            </IonItem>
                        </IonMenuToggle>
                        <IonMenuToggle>
                            <IonItem routerLink="/metro-bilbao-viewers" className="submenu-item">
                                <IonLabel>{t('Visor')}</IonLabel>
                            </IonItem>
                        </IonMenuToggle>
                        <IonMenuToggle>
                            <IonItem routerLink="/configure-metro-bilbao" className="submenu-item">
                                <IonLabel>{t('Añadir paradas')}</IonLabel>
                            </IonItem>
                        </IonMenuToggle>
                        <IonMenuToggle>
                            <IonItem routerLink="/manage-metro-bilbao-stops" className="submenu-item">
                                <IonLabel>{t('Mis paradas')}</IonLabel>
                            </IonItem>
                        </IonMenuToggle>
                        <IonMenuToggle>
                            <IonItem>
                                <IonLabel><strong>{t('Otras opciones')}</strong></IonLabel>
                            </IonItem>
                        </IonMenuToggle>
                        <IonMenuToggle>
                            <IonItem routerLink="/about-app" className="submenu-item">
                                <IonLabel>{t('Sobre Arin')}</IonLabel>
                            </IonItem>
                        </IonMenuToggle>
                        <IonMenuToggle>
                            <IonItem routerLink="/configuration" className="submenu-item">
                                <IonLabel>{t('Configuración')}</IonLabel>
                            </IonItem>
                        </IonMenuToggle>

                    </IonList>
                </IonContent>
            </IonMenu>

            <IonPage id="main">
                <IonHeader>
                    <IonToolbar>
                        <IonButtons slot="start">
                            <IonMenuButton/>
                        </IonButtons>
                        <IonTitle>

                            {title}
                        </IonTitle>
                    </IonToolbar>
                    <NavigationTabs/>
                </IonHeader>
                <IonContent className="ion-padding">
                    {children}
                </IonContent>
            </IonPage>
        </>
    )
        ;
};

export default Page;
