import React from 'react';
import {
    IonPage,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButtons,
    IonMenuButton,
    IonIcon,
    IonText, IonButton
} from '@ionic/react';
import StopsDisplay from '../components/StopsDisplay';
import {busOutline, settingsOutline, timerOutline} from "ionicons/icons";
import {useHistory} from "react-router-dom";
import {getSavedStationIds} from "../services/BizkaibusStorage";

const BizkaibusViewers: React.FC = () => {
    let stops = getSavedStationIds();
    const history = useHistory();

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonMenuButton />
                    </IonButtons>
                    <IonTitle><IonIcon icon={busOutline}></IonIcon>  Visores Bizkaibus</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent className="ion-padding">
                {stops.length > 0 ? (
                    <div>
                        <IonButton color="secondary" onClick={() => history.push(`/configure-bizkaibus`)}>
                            <IonIcon icon={settingsOutline} /> Configurar paradas
                        </IonButton>
                        <StopsDisplay stops={stops} />
                    </div>
                ) : (
                    <div style={{ textAlign: 'center', marginTop: '2rem' }}>
                        <IonText>
                            <h2>No tienes paradas favoritas configuradas</h2>
                            <p>
                                Para poder ver tus paradas favoritas, debes configurarlas en la página de configuración.
                            </p>
                        </IonText>
                        <IonButton color="secondary" onClick={() => history.push(`/configure-bizkaibus`)}>
                            <IonIcon icon={settingsOutline} /> Configurar paradas
                        </IonButton>
                    </div>
                )}

            </IonContent>
        </IonPage>
    );
};

export default BizkaibusViewers;
