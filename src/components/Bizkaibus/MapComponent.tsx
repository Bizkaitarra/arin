import React, {useEffect} from "react";
import {MapContainer, Marker, Popup, TileLayer, useMap} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import {Parada} from "../../services/BizkaibusStorage";
import {Heart, HeartOff} from "lucide-react";
import './MapComponent.css';
import {useTranslation} from "react-i18next";
import { Position } from "@capacitor/geolocation";


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

const MapUpdater: React.FC<{ positions: [number, number][] , userPosition?}> = ({ positions, userPosition }) => {
    const map = useMap();
    useEffect(() => {
        if (userPosition) {
            // Centrar el mapa en la ubicación del usuario si se proporciona
            map.setView([userPosition.coords.latitude, userPosition.coords.longitude], 17);
        } else {
            // Centrar el mapa en las paradas como antes
            const bounds = L.latLngBounds(positions);
            map.fitBounds(bounds);
        }
    }, [userPosition, positions, map]);
    return null;
};


const MapComponent: React.FC<MapComponentProps> = ({ paradas, onToggleFavorite, userPosition }) => {
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
        <MapContainer style={{ height: "500px", width: "100%" }} zoom={13}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <MapUpdater positions={positions} userPosition={userPosition} />
            {positions.map((position, index) => (
                <Marker
                    key={index}
                    position={position}
                    icon={
                        userPosition && index === positions.length - 1
                            ? userPositionIcon
                            : busStopCustomIcon(paradas[index]?.IS_FAVORITE)
                    }
                >
                    <Popup>
                        {userPosition && index === positions.length - 1 ? (
                            <p>{t('Tu ubicación actual')}</p>
                        ) : (
                            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", padding: "10px", minWidth: "150px" }}>
                                <strong style={{ fontSize: "16px" }}>{paradas[index].DENOMINACION}</strong>
                                <button
                                    onClick={() => onToggleFavorite(paradas[index])}
                                    style={{
                                        border: "none",
                                        background: "none",
                                        cursor: "pointer",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        fontSize: "20px",
                                        color: paradas[index].IS_FAVORITE ? "red" : "gray"
                                    }}
                                >
                                    {paradas[index].IS_FAVORITE ? <Heart color="red" /> : <HeartOff color="gray" />}
                                </button>
                            </div>
                        )}
                    </Popup>
                </Marker>
            ))}
        </MapContainer>
    );
};

export default MapComponent;
