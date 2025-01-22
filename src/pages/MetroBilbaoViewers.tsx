import React from 'react';
import {IonButtons, IonContent, IonHeader, IonIcon, IonMenuButton, IonPage, IonTitle, IonToolbar} from "@ionic/react";
import MetroDisplay from "../components/MetroDisplay";
import {busOutline, trainOutline} from "ionicons/icons";

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
          <IonContent>
              <MetroDisplay stops={stops}/>
          </IonContent>
      </IonPage>
  );
};

export default MetroBilbaoViewers;
