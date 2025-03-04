import React, {useEffect, useState} from 'react';
import {getStations, Parada, saveStationIds} from '../../services/BizkaibusStorage';
import Map from '../../components/Bizkaibus/Map/Map';
import {useTranslation} from 'react-i18next';
import {settingsOutline} from 'ionicons/icons';
import Page from '../Page';
import GPSComponent from "../../components/GPSComponent";
import {Location} from "../../services/GeoLocation";

const MAX_KM_RANGE = 2;

const BizkaibusAddByLocalization: React.FC = () => {
    const { t } = useTranslation();
    const [stations, setStations] = useState<Parada[]>([]);
    const [nearbyStations, setNearbyStations] = useState<Parada[]>([]);
    const [location, setLocation] = useState<Location | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [isReal, setIsReal] = useState<boolean>(true);

    useEffect(() => {
        setLoading(true);
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
                location.latitude,
                location.longitude,
                parseFloat(station.LATITUD),
                parseFloat(station.LONGITUD)
            );
            return distance <= MAX_KM_RANGE;
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

    const handleLocationUpdate = (position: Location, isReal: boolean) => {
        console.log('Location updated', position);
        setLocation(position);
        setIsReal(isReal);
    };


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
            <GPSComponent onLocationUpdate={handleLocationUpdate} />
            {loading ? (
                <></>
            ) : location && nearbyStations.length > 0 ? (
                <>
                    <p>{t('A continuación se muestran las paradas cercanas')}</p>
                    <Map paradas={nearbyStations} onToggleFavorite={handleToggleStop} userPosition={location} isReal={isReal} />
                </>
            ) : location ? (
                <>
                    <p>{t('No hay paradas cercanas.')}</p>
                </>
            ) :  (
                <></>
            )}

        </Page>

    );
};

export default BizkaibusAddByLocalization;
