import React, {useEffect, useState} from 'react';
import {useIonToast} from '@ionic/react';
import {useHistory} from 'react-router-dom';
import {getStations, Parada, saveStationIds} from '../../services/BizkaibusStorage';
import {Geolocation, Position} from '@capacitor/geolocation';
import MapComponent from '../../components/Bizkaibus/MapComponent';
import {useTranslation} from 'react-i18next';
import {settingsOutline} from "ionicons/icons";
import Page from "../Page";
import Loader from "../../components/Loader";

const MAX_KM_RANGE = 2;
const BizkaibusAddByLocalization: React.FC = () => {
    const { t } = useTranslation();
    const [stations, setStations] = useState<Parada[]>([]);
    const [nearbyStations, setNearbyStations] = useState<Parada[]>([]);
    const [locationError, setLocationError] = useState<boolean>(false);
    const [presentToast] = useIonToast();
    const history = useHistory();
    const [location, setLocation] = useState<Position | null>(null);
    const [loading, setLoading] = useState<boolean>(true);


    useEffect(() => {
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
            const permission = await Geolocation.checkPermissions();
            if (permission.location === 'denied') {
                await Geolocation.requestPermissions();
            }
            const position = await Geolocation.getCurrentPosition({
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0
            });

            setLocation(position);
            console.log('Location:', position);
        } catch (error) {
            setLocationError(true);
            presentToast({
                message: t('No se pudo acceder a la localización.'),
                duration: 2000,
                color: 'danger',
            });
            presentToast({
                message: error.message,
                duration: 2000,
                color: 'danger',
            });
        }
    };

    useEffect(() => {
        if (stations.length === 0) return;
        const selectedStops = stations.filter((station) => station.IS_FAVORITE);
        const stopIds = selectedStops.map((stop) => stop.PARADA);
        saveStationIds(stopIds);
    }, [stations]);

    const filterNearbyStations = () => {
        if (!location) return;
        if (stations.length === 0) return;
        const nearby = stations.filter((station) => {
            const distance = getDistanceFromLatLonInKm(
                location.coords.latitude,
                location.coords.longitude,
                parseFloat(station.LATITUD),
                parseFloat(station.LONGITUD)
            );
            return distance <= MAX_KM_RANGE; // Paradas en un radio de 1 km
        });
        setNearbyStations(nearby);
        setLoading(false);
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

    if (locationError) {
        return null;
    }

    return (
        <Page title={`${t('Paradas Cercanas')}`} icon={settingsOutline} internalPage={true}>
            <p>A continuación se muestran las paradas cercanas.</p>
            {loading ? (
                <Loader serviceName="Bizkaibus" reloading={false} />
            ) : location && nearbyStations.length > 0 ? (
                <MapComponent
                    paradas={nearbyStations}
                    onToggleFavorite={handleToggleStop}
                    userPosition={location}
                />
            ) : (
                <p>No se ha podido obtener la localización o no hay paradas cercanas.</p>
            )}
        </Page>
    );


};

export default BizkaibusAddByLocalization;
