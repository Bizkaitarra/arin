import React, {useState, useEffect, useRef} from 'react';
import {Geolocation} from '@capacitor/geolocation';
import {Capacitor} from '@capacitor/core';
import {GetDefaultLocation, SetlastLocation, Location} from "../services/GeoLocation";
import {useTranslation} from "react-i18next";

interface GPSComponentProps {
    // onLocationUpdate recibe la posición y un booleano que indica si es la ubicación real.
    onLocationUpdate: (position: Location, isReal: boolean) => void;
}

const GPSComponent: React.FC<GPSComponentProps> = ({onLocationUpdate}) => {
    const { t } = useTranslation();
    const [location, setLocation] = useState<Location | null>(null);
    const [statusMessage, setStatusMessage] = useState<string>(t("Obteniendo ubicación"));
    const [messageColor, setMessageColor] = useState<string>("blue");
    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const [isRealLocation, setIsRealLocation] = useState<boolean>(false);

    // Función para manejar el caso en que se deniegue la geolocalización
    const handlePermissionDenied = () => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
        setStatusMessage(t("Geolocalización no permitida"));
        setMessageColor("red");
        const defaultPosition = GetDefaultLocation();
        setLocation(defaultPosition);
        onLocationUpdate(defaultPosition, false);
    };

    // Función que intenta obtener la ubicación real según la plataforma
    const requestLocation = async () => {
        if (Capacitor.getPlatform() === 'web') {
            // Uso de navigator.geolocation en web
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const newLocation: Location = {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                    };
                    setLocation(newLocation);
                    SetlastLocation(newLocation);
                    onLocationUpdate(newLocation, true);
                    setStatusMessage(t("Ubicación obtenida"));
                    setMessageColor("green");
                    if (intervalRef.current) {
                        clearInterval(intervalRef.current);
                        intervalRef.current = null;
                    }
                    setTimeout(() => {
                        setStatusMessage("");
                        setIsRealLocation(true);
                    }, 5000);
                },
                (err) => {
                    console.error("Error en navigator.geolocation:", err);
                    if (err.code === err.PERMISSION_DENIED) {
                        handlePermissionDenied();
                    }
                },
                {enableHighAccuracy: true}
            );
        } else {
            // Uso de Capacitor Geolocation en plataformas nativas
            try {
                const position = await Geolocation.getCurrentPosition({enableHighAccuracy: true});
                if (position && position.coords) {
                    const newLocation: Location = {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                    };
                    setLocation(newLocation);
                    SetlastLocation(newLocation);
                    onLocationUpdate(newLocation, true);
                    setStatusMessage(t("Ubicación obtenida"));
                    setMessageColor("green");
                    if (intervalRef.current) {
                        clearInterval(intervalRef.current);
                        intervalRef.current = null;
                    }
                    setTimeout(() => {
                        setStatusMessage("");
                        setIsRealLocation(true);
                    }, 5000);
                }
            } catch (error: any) {
                console.error("Error al obtener la ubicación:", error);
                if (error.message && error.message.toLowerCase().includes("denied")) {
                    handlePermissionDenied();
                }
            }
        }
    };

    useEffect(() => {
        // Función que revisa y solicita permiso para la ubicación según la plataforma
        const checkAndRequestPermission = async () => {
            if (Capacitor.getPlatform() === 'web') {
                // En web no es necesario solicitar permisos explícitos
                if (!location && !intervalRef.current) {
                    intervalRef.current = setInterval(requestLocation, 3000);
                }
            } else {
                const permStatus = await Geolocation.checkPermissions();
                if (permStatus.location !== 'granted') {
                    const permRequest = await Geolocation.requestPermissions();
                    if (permRequest.location !== 'granted') {
                        handlePermissionDenied();
                        return;
                    }
                }
                if (!location && !intervalRef.current) {
                    intervalRef.current = setInterval(requestLocation, 3000);
                }
            }
        };

        checkAndRequestPermission();

        // Limpieza: se cancela el intervalo al desmontar el componente
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        };
    }, []); // Se ejecuta solo una vez

    // Mientras no se tenga la ubicación real, se informa siempre al padre de la posición por defecto.
    useEffect(() => {
        if (!location) {
            const defaultPosition = GetDefaultLocation();
            onLocationUpdate(defaultPosition, false);
        }
    }, [location]);

    return isRealLocation ? null : (
        <div>
            <div
                style={{
                    width: "100%",
                    backgroundColor: messageColor,
                    color: "white",
                    textAlign: "center",
                    padding: "10px",
                }}
            >
                {statusMessage}
            </div>
        </div>
    );

};

export default GPSComponent;
