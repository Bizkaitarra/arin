import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { Parada } from "../../services/BizkaibusStorage";

const defaultIcon = new L.Icon({
    iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
    shadowSize: [41, 41],
});

interface MapComponentProps {
    paradas: Parada[];
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

const MapComponent: React.FC<MapComponentProps> = ({ paradas }) => {
    if (paradas.length === 0) return <p>No hay paradas disponibles.</p>;

    const positions: [number, number][] = paradas
        .map((parada) => {
            const lat = parseFloat(parada.LATITUD);
            const lng = parseFloat(parada.LONGITUD);
            return isNaN(lat) || isNaN(lng) ? null : [lat, lng];
        })
        .filter((pos): pos is [number, number] => pos !== null);

    const handleAddToFavorite = (parada: Parada) => {
        console.log(`Parada añadida a favoritos: ${parada.DENOMINACION}`);
    };

    return (
        <MapContainer style={{ height: "500px", width: "100%" }} zoom={13}>
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <MapUpdater positions={positions} />
            {positions.map((position, index) => (
                <Marker key={index} position={position} icon={defaultIcon as L.Icon<L.IconOptions>}>
                    <Popup>
                        <strong>{paradas[index].DENOMINACION}</strong>
                        <br />
                        {paradas[index].DESCRIPCION_MUNICIPIO} ({paradas[index].DESCRIPCION_PROVINCIA})
                        <button onClick={() => handleAddToFavorite(paradas[index])}>
                            Añadir a favoritos
                        </button>
                    </Popup>
                </Marker>
            ))}
        </MapContainer>
    );
};

export default MapComponent;
