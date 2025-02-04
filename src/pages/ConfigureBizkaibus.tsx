import React, {useState, useEffect, useRef} from 'react';
import {
    IonButtons,
    IonContent,
    IonHeader,
    IonMenuButton,
    IonPage,
    IonTitle,
    IonToolbar,
    IonSelect,
    IonSelectOption,
    IonInput,
    IonButton,
    IonList,
    IonItem,
    IonLabel,
    IonGrid,
    IonRow,
    IonCol,
    useIonToast, IonIcon,
} from '@ionic/react';
import { loadStops } from "../services/ApiBizkaibus";
import { ItemReorderEventDetail } from '@ionic/core';
import BizkaibusSelectedStopsList from '../components/BizkaibusSelectedStopsList';
import {addCircle, settingsOutline} from "ionicons/icons";

interface Parada {
    PROVINCIA: string;
    DESCRIPCION_PROVINCIA: string;
    MUNICIPIO: string;
    DESCRIPCION_MUNICIPIO: string;
    PARADA: string;
    DENOMINACION: string;
}

const ConfigureBizkaibus: React.FC = () => {
    const [province, setProvince] = useState<string>('48'); // Bizkaia seleccionado por defecto
    const [town, setTown] = useState<string>('');
    const [stopName, setStopName] = useState<string>('');
    const [stations, setStations] = useState<Parada[]>([]);
    const [filteredStations, setFilteredStations] = useState<Parada[]>([]);
    const [selectedStops, setSelectedStops] = useState<Parada[]>([]);
    const [presentToast] = useIonToast();
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
        let results = stations;

        if (province) {
            results = results.filter((station) => station.PROVINCIA === province);
        }

        if (town) {
            results = results.filter((station) => station.DESCRIPCION_MUNICIPIO === town);
        }

        if (stopName) {
            results = results.filter((station) =>
                station.DENOMINACION.toLowerCase().includes(stopName.toLowerCase())
            );
        }
        console.log(selectedStopsRef.current);

        setFilteredStations(results);
    }, [province, town, stopName, stations]);

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
                        <IonMenuButton />
                    </IonButtons>
                    <IonTitle><IonIcon icon={settingsOutline}></IonIcon> Configurar Bizkaibus</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent className="ion-padding">
                <BizkaibusSelectedStopsList ref={selectedStopsRef} stations={stations} />

                <h2>Buscador de Paradas</h2>
                {/* Filtro por provincia */}
                <IonItem>
                    <IonLabel position="stacked">Provincia</IonLabel>
                    <IonSelect
                        value={province}
                        placeholder="Selecciona provincia"
                        onIonChange={(e) => setProvince(e.detail.value)}
                    >
                        {[...new Set(stations.map((station) => station.PROVINCIA))].map((prov) => (
                            <IonSelectOption key={prov} value={prov}>
                                {stations.find((station) => station.PROVINCIA === prov)?.DESCRIPCION_PROVINCIA}
                            </IonSelectOption>
                        ))}
                    </IonSelect>
                </IonItem>

                {/* Filtro por municipio */}
                <IonItem>
                    <IonLabel position="stacked">Municipio</IonLabel>
                    <IonSelect
                        value={town}
                        placeholder="Selecciona municipio"
                        onIonChange={(e) => setTown(e.detail.value)}
                    >
                        {[...new Set(
                            stations
                                .filter((station) => station.PROVINCIA === province)
                                .map((station) => station.DESCRIPCION_MUNICIPIO)
                        )].map((municipio) => (
                            <IonSelectOption key={municipio} value={municipio}>
                                {municipio}
                            </IonSelectOption>
                        ))}
                    </IonSelect>
                </IonItem>

                {/* Filtro por nombre de parada */}
                <IonItem>
                    <IonLabel position="stacked">Nombre de la parada</IonLabel>
                    <IonInput
                        value={stopName}
                        placeholder="Escribe el nombre de la parada"
                        onInput={(e: any) => setStopName(e.target.value)}
                    />
                </IonItem>

                {/* Tabla de resultados */}
                <IonGrid>
                    <IonRow>
                        <IonCol><strong>Parada</strong></IonCol>
                        <IonCol><strong>Denominación</strong></IonCol>
                        <IonCol><strong>Acción</strong></IonCol>
                    </IonRow>
                    {filteredStations.map((station) => (
                        <IonRow key={station.PARADA}>
                            <IonCol>{station.PARADA}</IonCol>
                            <IonCol>{station.DENOMINACION}</IonCol>
                            <IonCol>
                                <IonIcon onClick={() => handleAddStop(station)} icon={addCircle}></IonIcon>
                            </IonCol>
                        </IonRow>
                    ))}
                </IonGrid>


            </IonContent>
        </IonPage>
    );
};

export default ConfigureBizkaibus;
