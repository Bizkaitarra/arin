import React, {useEffect, useState} from 'react';
import {IonButton, IonIcon, IonItem, IonLabel, useIonViewWillEnter} from '@ionic/react';
import {listOutline, mapOutline, settingsOutline} from 'ionicons/icons';
import {getStations, Municipio, Parada, saveStationIds} from "../../services/BizkaibusStorage";
import Page from "../Page";
import Map from "../../components/Bizkaibus/Map/Map";
import StopsByTownSelector from "../../components/Bizkaibus/StopsByTownSelector/StopsByTownSelector";
import {Star, StarOff} from "lucide-react";
import {useTranslation} from "react-i18next";

const BizkaibusAddByTown: React.FC = () => {
    const {t} = useTranslation();
    const [town, setTown] = useState<Municipio | null>(null);
    const [stations, setStations] = useState<Parada[]>([]);
    const [filteredStations, setFilteredStations] = useState<Parada[]>([]);
    const [isMapView, setIsMapView] = useState<boolean>(true);


    useIonViewWillEnter(() => {
        fetchStations();
    }, []);

    const fetchStations = async () => {
        try {
            const estaciones = await getStations();
            setStations(estaciones);
        } catch (error) {
            console.error("Error al cargar las estaciones:", error);
        }
    };


    useEffect(() => {
        if (stations.length === 0) return;
        const selectedStops = stations.filter(station => station.IS_FAVORITE);
        const stopIds = selectedStops.map((stop) => stop.PARADA);
        saveStationIds(stopIds);
    }, [stations]);


    useEffect(() => {
        loadFilteredStations();
    }, [town, stations]);

    const loadFilteredStations = () => {
        let results = stations.filter(station =>
            (!town ||
                (station.MUNICIPIO === town.MUNICIPIO && station.PROVINCIA === town.PROVINCIA))
        );
        setFilteredStations(results);
    };


    const handleAddStop = (stop: Parada) => {
        const station = stations.find(s => s.PARADA === stop.PARADA);

        if (!station) return; // Evita errores si la estación no se encuentra

        const wasFavorite = station.IS_FAVORITE; // Guardamos el estado actual

        setStations(prevStations =>
            prevStations.map(s =>
                s.PARADA === stop.PARADA ? {...s, IS_FAVORITE: !s.IS_FAVORITE} : s
            )
        );
    };


    const handleRemoveStop = (stop: Parada) => {
        const station = stations.find(s => s.PARADA === stop.PARADA);

        if (!station || !station.IS_FAVORITE) return; // Solo eliminamos si es favorito

        setStations(prevStations =>
            prevStations.map(s =>
                s.PARADA === stop.PARADA ? {...s, IS_FAVORITE: false} : s
            )
        );
    };

    const handleToggleStop = (stop: Parada) => {
        const station = stations.find(s => s.PARADA === stop.PARADA);

        if (!station) return; // Evita errores si la estación no se encuentra

        const newFavoriteStatus = !station.IS_FAVORITE;

        setStations(prevStations =>
            prevStations.map(s =>
                s.PARADA === stop.PARADA ? {...s, IS_FAVORITE: newFavoriteStatus} : s
            )
        );
    };


    const handleTownSelect = (selectedTown: Municipio) => {
        setTown(selectedTown);
    };

    const clearTownSelection = () => {
        setTown(null);
    };

    return (
        <Page title={t("Añadir paradas")} icon={settingsOutline} internalPage={true}>
            <div>
                {!town ? (
                    <StopsByTownSelector paradas={stations} onMunicipioClick={handleTownSelect}/>
                ) : (
                    <p>
                        <strong>{t('Pueblo seleccionado')}:</strong> {town.DESCRIPCION_MUNICIPIO}{' ('}{town.DESCRIPCION_PROVINCIA}{')'}
                        <IonButton fill="clear" color="danger" onClick={clearTownSelection}>
                            {t('Deseleccionar')}
                        </IonButton>
                    </p>
                )}
            </div>

            {town && (
                <>
                    <IonButton
                        expand="full"
                        color="primary"
                        onClick={() => setIsMapView(!isMapView)}
                    >
                        <IonIcon icon={isMapView ? listOutline : mapOutline} slot="start"/>
                        {isMapView ? t('Ver como lista') : t('Ver como mapa')}
                    </IonButton>

                    {isMapView ? (
                        <div>
                            <h1>{t('Mapa de Paradas')}</h1>
                            <Map paradas={filteredStations} onToggleFavorite={handleToggleStop}/>
                        </div>
                    ) : (
                        <>
                            <h1>{t('Listado de Paradas')}</h1>
                            {filteredStations.map(station => (
                                <IonItem key={station.PARADA}>
                                    <IonLabel>
                                        <h3>{station.PARADA} - {station.DENOMINACION} {station.IS_FAVORITE}</h3>

                                        <p>{station.DESCRIPCION_MUNICIPIO}, {station.DESCRIPCION_PROVINCIA}</p>
                                    </IonLabel>
                                    {station.IS_FAVORITE ?
                                        <Star color="red" onClick={() => handleRemoveStop(station)}/> :
                                        <StarOff color="gray" onClick={() => handleAddStop(station)}/>}
                                </IonItem>
                            ))}
                        </>
                    )}
                </>
            )}
        </Page>
    );
};

export default BizkaibusAddByTown;
