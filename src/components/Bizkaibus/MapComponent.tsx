import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { Parada } from "../../services/BizkaibusStorage";
import { Heart, HeartOff } from "lucide-react";
import {ellipsisVertical} from "ionicons/icons";
import {IonIcon} from "@ionic/react";
import './MapComponent.css';
const defaultIcon = new L.Icon({
    iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
    shadowSize: [41, 41],
});
const busStopIcon = new L.Icon({
    iconUrl: `https://raw.githubusercontent.com/Templarian/MaterialDesign/master/svg/bus.svg`, // Material Design Icons
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -30],
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
    shadowSize: [41, 41],
});

const busStopCustomIcon = (isFavorite) => new L.Icon({
    iconUrl: "https://raw.githubusercontent.com/Templarian/MaterialDesign/master/svg/bus.svg",
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -30],
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
    shadowSize: [41, 41],
    className: isFavorite ? "favorite-bus-marker" : "non-favorite-bus-marker"
});





interface MapComponentProps {
    paradas: Parada[];
    onToggleFavorite: (parada: Parada) => void;
}

const MapUpdater: React.FC<{ positions: [number, number][] }> = ({ positions }) => {
    const map = useMap();
    useEffect(() => {
        if (positions.length > 0) {
            const bounds = L.latLngBounds(positions);
            map.fitBounds(bounds);
        }
    }, [positions, map]);
    return null;
};

const MapComponent: React.FC<MapComponentProps> = ({ paradas, onToggleFavorite }) => {
    if (paradas.length === 0) return <p>No hay paradas disponibles.</p>;

    const positions: [number, number][] = paradas
        .map((parada) => {
            const lat = parseFloat(parada.LATITUD);
            const lng = parseFloat(parada.LONGITUD);
            return isNaN(lat) || isNaN(lng) ? null : [lat, lng];
        })
        .filter((pos): pos is [number, number] => pos !== null);

    return (
        <MapContainer style={{ height: "500px", width: "100%" }} zoom={13}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <MapUpdater positions={positions} />
            {positions.map((position, index) => (
                <Marker key={index} position={position} icon={busStopCustomIcon(paradas[index].IS_FAVORITE) as L.Icon<L.IconOptions>}>
                    <Popup>
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
                    </Popup>
                </Marker>
            ))}
        </MapContainer>
    );
};

export default MapComponent;
