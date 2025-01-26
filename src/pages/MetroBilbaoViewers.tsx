import React from 'react';
import {
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
import {busOutline, trainOutline} from "ionicons/icons";
import StopsDisplay from "../components/StopsDisplay";
import {Link} from "react-router-dom";

const STORAGE_KEY = 'metro_bilbao_selected_stops';

const MetroBilbaoViewers: React.FC = () => {
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
                  <MetroDisplay stops={stops} />
              ) : (
                  <div style={{ textAlign: 'center', marginTop: '2rem' }}>
                      <IonText>
                          <h2>No tienes paradas favoritas configuradas</h2>
                          <p>
                              Para poder ver tus paradas favoritas, debes configurarlas en la página de configuración.
                          </p>
                      </IonText>
                      <Link to="/configure-metro-bilbao" style={{ textDecoration: 'none' }}>
                          <IonText color="primary" style={{ fontWeight: 'bold' }}>
                              Configurar Paradas
                          </IonText>
                      </Link>
                  </div>
              )}
          </IonContent>
      </IonPage>
  );
};

export default MetroBilbaoViewers;
