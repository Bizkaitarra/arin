import React, {useEffect, useRef, useState} from 'react';
import {
    IonButton,
    IonButtons,
    IonCol,
    IonContent,
    IonGrid,
    IonHeader,
    IonIcon,
    IonInput,
    IonItem,
    IonLabel,
    IonMenuButton,
    IonPage,
    IonRow,
    IonTitle,
    IonToolbar,
} from '@ionic/react';
import {loadStops} from "../services/ApiMetroBilbao";
import MetroBilbaoSelectedStopsList from "../components/MetroBilbaoSelectedStopsList";
import {settingsOutline} from "ionicons/icons";


interface Parada {
    Code: string;
    Name: string;
    Lines: string;
}

const ConfigureMetroBilbao: React.FC = () => {
    const [stopName, setStopName] = useState<string>('');
    const [stations, setStations] = useState<Parada[]>([]);
    const [filteredStations, setFilteredStations] = useState<Parada[]>([]);
    const selectedStopsRef = useRef<any>(null);


    useEffect(() => {
        const fetchStations = async () => {
            try {
                const estaciones = await loadStops();
                setStations(estaciones);
            } catch (error) {
                console.error("Error al cargar las estaciones:", error);
            }
        };

        fetchStations();
    }, []);

    useEffect(() => {
        if (!stopName) {
            setFilteredStations(stations); // Muestra todas las estaciones si no hay filtro
        } else {
            const results = stations.filter((station) =>
                station.Name.toLowerCase().includes(stopName.toLowerCase())
            );
            setFilteredStations(results);
        }
    }, [stopName, stations]);


    const handleAddStop = (stop: Parada) => {
        if (selectedStopsRef.current) {
            selectedStopsRef.current.addStop(stop);
        }
    };

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonMenuButton/>
                    </IonButtons>
                    <IonTitle><IonIcon icon={settingsOutline}></IonIcon> Configurar Metro Bilbao</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent className="ion-padding">
                <MetroBilbaoSelectedStopsList ref={selectedStopsRef} stations={stations}/>

                <h2>Buscador de Paradas</h2>
                {/* Filtro por nombre de parada */}
                <IonItem>
                    <IonLabel position="stacked">Nombre de la parada</IonLabel>
                    <IonInput
                        value={stopName}
                        placeholder="Escribe el nombre de la parada"
                        onInput={(e: any) => setStopName(e.target.value)}
                    />
                </IonItem>

                <IonGrid>
                    <IonRow>
                        <IonCol><strong>Código</strong></IonCol>
                        <IonCol><strong>Nombre</strong></IonCol>
                        <IonCol><strong>Acción</strong></IonCol>
                    </IonRow>
                    {filteredStations.map((station) => (
                        <IonRow key={station.Code}>
                            <IonCol>{station.Code}</IonCol>
                            <IonCol>{station.Name}</IonCol>
                            <IonCol>
                                <IonButton onClick={() => handleAddStop(station)}>Añadir</IonButton>

                            </IonCol>
                        </IonRow>
                    ))}
                </IonGrid>


            </IonContent>
        </IonPage>
    );
};

export default ConfigureMetroBilbao;
