import React from 'react';
import {
    IonButton,
    IonButtons,
    IonContent,
    IonHeader,
    IonIcon,
    IonMenuButton,
    IonPage,
    IonText,
    IonTitle,
    IonToolbar
} from "@ionic/react";
import MetroDisplay from "../components/MetroDisplay";
import {settingsOutline, timerOutline, trainOutline} from "ionicons/icons";
import {useHistory} from "react-router-dom";

const STORAGE_KEY = 'metro_bilbao_selected_stops';

const MetroBilbaoViewers: React.FC = () => {
    const history = useHistory();
    let stops = [];
    const savedStops = localStorage.getItem(STORAGE_KEY);
    if (savedStops) {
        try {
            stops = JSON.parse(savedStops);
        } catch (error) {
            console.error('Error al cargar paradas desde localStorage:', error);
        }
    }
  return (
      <IonPage>
          <IonHeader>
              <IonToolbar>
                  <IonButtons slot="start">
                      <IonMenuButton />
                  </IonButtons>
                  <IonTitle><IonIcon icon={trainOutline}></IonIcon> Visores Metro Bilbao</IonTitle>
              </IonToolbar>
          </IonHeader>
          <IonContent className="ion-padding">
              {stops.length > 0 ? (
                  <div>
                      <IonButton color="secondary" onClick={() => history.push(`/configure-metro-bilbao`)}>
                          <IonIcon icon={settingsOutline} /> Configurar paradas
                      </IonButton>
                    <MetroDisplay stops={stops} />
                  </div>
              ) : (
                  <div style={{ textAlign: 'center', marginTop: '2rem' }}>
                      <IonText>
                          <h2>No tienes paradas favoritas configuradas</h2>
                          <p>
                              Para poder ver tus paradas favoritas, debes configurarlas en la página de configuración.
                          </p>
                      </IonText>
                      <IonButton color="secondary" onClick={() => history.push(`/configure-metro-bilbao`)}>
                          <IonIcon icon={settingsOutline} /> Configurar paradas
                      </IonButton>
                  </div>
              )}
          </IonContent>
      </IonPage>
  );
};

export default MetroBilbaoViewers;
