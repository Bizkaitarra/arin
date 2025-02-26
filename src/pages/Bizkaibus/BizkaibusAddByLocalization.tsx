import React, {useEffect, useState} from 'react';
import {IonButton, useIonToast} from '@ionic/react';
import {useHistory} from 'react-router-dom';
import {getStations, Parada, saveStationIds} from '../../services/BizkaibusStorage';
import {Geolocation, Position} from '@capacitor/geolocation';
import Map from '../../components/Bizkaibus/Map/Map';
import {useTranslation} from 'react-i18next';
import {settingsOutline} from 'ionicons/icons';
import Page from '../Page';
import Loader from '../../components/Loader';
import {Capacitor} from "@capacitor/core";

const MAX_KM_RANGE = 2;

const BizkaibusAddByLocalization: React.FC = () => {
    const { t } = useTranslation();
    const [stations, setStations] = useState<Parada[]>([]);
    const [nearbyStations, setNearbyStations] = useState<Parada[]>([]);
    const [presentToast] = useIonToast();
    const history = useHistory();
    const [location, setLocation] = useState<Position | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        console.log('estableciendo loading a true');
        setLoading(true);
        requestLocation();
        fetchStations();
    }, []);

    useEffect(() => {
        filterNearbyStations();
    }, [stations, location]);

    const fetchStations = async () => {
        try {
            const estaciones = await getStations();
            setStations(estaciones);
        } catch (error) {
            console.error('Error al cargar las estaciones:', error);
        }
    };

    const requestLocation = async () => {
        try {
            console.log('Requesting location...');
            setLoading(true);

            if (Capacitor.getPlatform() === 'web') {
                if (!navigator.geolocation) {
                    throw new Error(t('La geolocalización no está disponible en este navegador.'));
                }

                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        setLocation({
                            coords: {
                                latitude: position.coords.latitude,
                                longitude: position.coords.longitude,
                                accuracy: position.coords.accuracy,
                                altitude: position.coords.altitude,
                                altitudeAccuracy: position.coords.altitudeAccuracy,
                                heading: position.coords.heading,
                                speed: position.coords.speed,
                            },
                            timestamp: position.timestamp,
                        });
                        setLoading(false);
                    },
                    (error) => {
                        console.error('Error obteniendo ubicación (web):', error);
                        setLoading(false);
                        presentToast({ message: t('Error obteniendo ubicación.'), duration: 2000, color: 'danger' });
                    },
                    { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
                );
            } else {
                // Comprobar permisos en móvil antes de llamar a getCurrentPosition()
                const permStatus = await Geolocation.checkPermissions();
                if (permStatus.location !== 'granted') {
                    const newPermStatus = await Geolocation.requestPermissions();
                    if (newPermStatus.location !== 'granted') {
                        throw new Error(t('Permiso de ubicación denegado.'));
                    }
                }

                // Implementar timeout manual para evitar bloqueo
                const positionPromise = Geolocation.getCurrentPosition({
                    enableHighAccuracy: true,
                    timeout: 10000, // Timeout de 10s
                    maximumAge: 0,
                });

                const timeoutPromise = new Promise((_, reject) =>
                    setTimeout(() => reject(new Error(t('Tiempo de espera agotado para la ubicación.'))), 15000)
                );

                const position = await Promise.race([positionPromise, timeoutPromise]); // Si se pasa de 15s, lanza error

                setLocation(position as Position);
                console.log('Location (mobile):', position);
                setLoading(false);
            }
        } catch (error: any) {
            console.error('Error obteniendo ubicación:', error);
            setLoading(false); // Asegurar que el loading se detiene
            setLocation(null);
        }
    };



    useEffect(() => {
        if (stations.length === 0) return;
        const selectedStops = stations.filter((station) => station.IS_FAVORITE);
        const stopIds = selectedStops.map((stop) => stop.PARADA);
        saveStationIds(stopIds);
    }, [stations]);

    const filterNearbyStations = () => {
        if (!location || stations.length === 0) return;

        const nearby = stations.filter((station) => {
            const distance = getDistanceFromLatLonInKm(
                location.coords.latitude,
                location.coords.longitude,
                parseFloat(station.LATITUD),
                parseFloat(station.LONGITUD)
            );
            return distance <= MAX_KM_RANGE;
        });

        setNearbyStations(nearby);
    };

    const getDistanceFromLatLonInKm = (
        lat1: number,
        lon1: number,
        lat2: number,
        lon2: number
    ) => {
        const R = 6371; // Radio de la tierra en km
        const dLat = deg2rad(lat2 - lat1);
        const dLon = deg2rad(lon2 - lon1);
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(deg2rad(lat1)) *
            Math.cos(deg2rad(lat2)) *
            Math.sin(dLon / 2) *
            Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    };

    const deg2rad = (deg: number) => deg * (Math.PI / 180);

    const handleToggleStop = (stop: Parada) => {
        const station = stations.find((s) => s.PARADA === stop.PARADA);

        if (!station) return;

        const newFavoriteStatus = !station.IS_FAVORITE;

        setStations((prevStations) =>
            prevStations.map((s) =>
                s.PARADA === stop.PARADA ? { ...s, IS_FAVORITE: newFavoriteStatus } : s
            )
        );
    };

    return (
        <Page title={`${t('Paradas cercanas')}`} icon={settingsOutline} internalPage={true}>

            <p>{t('A continuación se muestran las paradas cercanas.')}</p>
            {loading ? (
                <Loader serviceName="Bizkaibus" reloading={false} />
            ) : location && nearbyStations.length > 0 ? (
                <Map paradas={nearbyStations} onToggleFavorite={handleToggleStop} userPosition={location} />
            ) : location ? (
                <>
                    <p>{t('No hay paradas cercanas.')}</p>
                </>
            ) :  (
                <>
                    <p>{t('No se ha podido obtener la localización. Asegurate de tener el GPS activo y de dar permiso a la obtención de la ubicación.')}</p>
                    <IonButton onClick={requestLocation} className="px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-md">
                        {t("Reintentar")}
                    </IonButton>
                </>
            )}

        </Page>

    );
};

export default BizkaibusAddByLocalization;
