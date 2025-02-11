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

interface PageProps {
    title: string;
    icon?: string;
    children: React.ReactNode;
}

const Page: React.FC<PageProps> = ({title, icon, children}) => {
    useIonViewWillLeave(() => {
        clearIntervals();
    });
    return (
        <>
            <IonMenu contentId="main">
                <IonHeader>
                    <IonToolbar>
                        <IonTitle>Menú</IonTitle>
                    </IonToolbar>
                </IonHeader>
                <IonContent>
                    <IonList>
                        <IonItem>
                            <IonLabel><strong>Bizkaibus</strong></IonLabel>
                        </IonItem>
                        <IonMenuToggle>
                            <IonItem routerLink="/configure-bizkaibus">
                                <IonLabel>Añadir paradas</IonLabel>
                            </IonItem>
                        </IonMenuToggle>
                        <IonMenuToggle>
                            <IonItem routerLink="/manage-bizkaibus-stops">
                                <IonLabel>Gestionar mis paradas</IonLabel>
                            </IonItem>
                        </IonMenuToggle>
                        <IonMenuToggle>
                            <IonItem>
                                <IonLabel><strong>Metro Bilbao</strong></IonLabel>
                            </IonItem>
                        </IonMenuToggle>
                        <IonMenuToggle>
                            <IonItem routerLink="/configure-metro-bilbao">
                                <IonLabel>Añadir paradas</IonLabel>
                            </IonItem>
                        </IonMenuToggle>
                        <IonMenuToggle>
                            <IonItem routerLink="/manage-metro-bilbao-stops">
                                <IonLabel>Gestionar mis paradas</IonLabel>
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
                            {icon && <IonIcon icon={icon} style={{marginRight: 8}}/>}
                            {title}
                        </IonTitle>
                    </IonToolbar>
                </IonHeader>
                <IonContent className="ion-padding">
                    <NavigationTabs/>
                    {children}
                </IonContent>
            </IonPage>
        </>
    )
        ;
};

export default Page;
