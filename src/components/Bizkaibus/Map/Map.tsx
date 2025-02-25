import React, {useEffect} from "react";
import {MapContainer, Marker, Popup, TileLayer, useMap} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import {Parada} from "../../../services/BizkaibusStorage";
import {Star, StarOff} from "lucide-react";
import './Map.css';
import {useTranslation} from "react-i18next";
import {Position} from "@capacitor/geolocation";


const busStopCustomIcon = (isFavorite) => new L.Icon({
    iconUrl: "https://raw.githubusercontent.com/Templarian/MaterialDesign/master/svg/bus.svg",
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -30],
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
    shadowSize: [41, 41],
    className: isFavorite ? "favorite-bus-marker" : "non-favorite-bus-marker"
});

const userPositionIcon = new L.DivIcon({
    className: "user-marker",
    html: "<div class='user-marker-icon'></div>",
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -35],
});

interface MapComponentProps {
    paradas: Parada[];
    onToggleFavorite: (parada: Parada) => void;
    userPosition?: Position;
}

const MapUpdater: React.FC<{ positions: [number, number][]; userPosition?: Position }> = ({ positions, userPosition }) => {
    const map = useMap();
    const previousPositions = React.useRef<string | null>(null);
    const previousUserPosition = React.useRef<string | null>(null);

    useEffect(() => {
        const positionsKey = JSON.stringify(positions.map(([lat, lng]) => [lat.toFixed(5), lng.toFixed(5)]));
        const userPositionKey = userPosition
            ? `${userPosition.coords.latitude.toFixed(5)},${userPosition.coords.longitude.toFixed(5)}`
            : null;

        // Verificar si las posiciones o la ubicación del usuario han cambiado realmente
        const hasNewStops = previousPositions.current !== positionsKey;
        const hasNewUserPosition = previousUserPosition.current !== userPositionKey;

        if (hasNewStops || hasNewUserPosition) {
            if (userPosition) {
                map.setView([userPosition.coords.latitude, userPosition.coords.longitude], 17);
            } else if (positions.length > 0) {
                map.fitBounds(L.latLngBounds(positions));
            }

            previousPositions.current = positionsKey;
            previousUserPosition.current = userPositionKey;
        }
    }, [positions, userPosition, map]);

    return null;
};



const Map: React.FC<MapComponentProps> = ({ paradas, onToggleFavorite, userPosition }) => {
    const { t } = useTranslation();
    if (paradas.length === 0) return <p>{t('No hay paradas disponibles')}.</p>;

    const positions: [number, number][] = paradas
        .map((parada) => {
            const lat = parseFloat(parada.LATITUD);
            const lng = parseFloat(parada.LONGITUD);
            return isNaN(lat) || isNaN(lng) ? null : [lat, lng];
        })
        .filter((pos): pos is [number, number] => pos !== null);

    if (userPosition) {
        positions.push([userPosition.coords.latitude, userPosition.coords.longitude]);
    }

    return (
        <MapContainer className="map-container" zoom={13}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <MapUpdater positions={positions} userPosition={userPosition} />
            {positions.map((position, index) => {
                const parada = paradas[index];
                return (
                    <Marker
                        key={index}
                        position={position}
                        icon={
                            userPosition && index === positions.length - 1
                                ? userPositionIcon
                                : busStopCustomIcon(parada?.IS_FAVORITE)
                        }
                    >
                        <Popup>
                            {userPosition && index === positions.length - 1 ? (
                                <p>{t("Tu ubicación actual")}</p>
                            ) : (
                                <div className="popup-content">
                                    <p className="popup-title">
                                        <strong>
                                            {parada.PARADA} - {parada.DENOMINACION}
                                        </strong>
                                        <button
                                            className={parada.IS_FAVORITE ? "favorite-button active" : "favorite-button"}
                                            onClick={() => onToggleFavorite(parada)}
                                        >
                                            {parada.IS_FAVORITE ? <Star color="red" /> : <StarOff color="gray" />}
                                        </button>
                                    </p>
                                    <p className="popup-description">
                                        {parada.IS_FAVORITE
                                            ? "Haz click en la estrella para hacer que la parada no sea favorita"
                                            : "Haz click en la estrella para hacer que la parada sea favorita"}
                                    </p>
                                </div>
                            )}
                        </Popup>
                    </Marker>
                );
            })}
        </MapContainer>
    );
};

export default Map;
