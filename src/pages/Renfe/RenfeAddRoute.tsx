import React, { useEffect, useState } from 'react';
import { IonGrid, IonInput, IonItem, IonLabel, IonButton, IonCard, IonCardHeader, IonCardTitle, IonCardContent, useIonViewWillEnter } from '@ionic/react';
import { settingsOutline } from 'ionicons/icons';
import Page from "../Page";
import { useTranslation } from "react-i18next";
import {Toast} from "@capacitor/toast";
import {useHistory} from "react-router-dom";
import {RenfeStop} from "../../services/Renfe/RenfeStop";
import {RenfeStorage} from "../../services/Renfe/RenfeStorage";

const RenfeAddRoute: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [stations, setStations] = useState<RenfeStop[]>([]);
    const [filteredStations, setFilteredStations] = useState<RenfeStop[]>([]);
    const [origin, setOrigin] = useState<RenfeStop | null>(null);
    const [destination, setDestination] = useState<RenfeStop | null>(null);
    const [selectingOrigin, setSelectingOrigin] = useState<boolean>(true);
    const { t } = useTranslation();
    const history = useHistory();
    const storage = new RenfeStorage();

    useIonViewWillEnter(() => {
        fetchStations();
    }, []);

    const fetchStations = async () => {
        try {
            setStations(storage.getStations());
        } catch (error) {
            console.error(t("Error al cargar las estaciones:"), error);
        }
    };

    useEffect(() => {
        if (stations.length > 0) {
            filterStations();
        }
    }, [searchTerm, stations]);

    const filterStations = () => {
        let results = stations.filter(station =>
            station.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredStations(results);
    };

    const handleSelectStation = (station: RenfeStop) => {
        if (selectingOrigin) {
            setOrigin(station);
            setSelectingOrigin(false);
            setSearchTerm('');
        } else {
            setDestination(station);
        }
    };

    const handleToggleSelection = (isOrigin: boolean) => {
        setSelectingOrigin(isOrigin);
        setSearchTerm('');
    };

    const handleAddRoute = () => {
        storage.addRoute(origin.id + ' - ' + destination.id);
        Toast.show({ text: t('Viaje añadido') });
        history.push('/renfe-my-displays');
    };

    return (
        <Page title={t('Seleccionar ruta')} icon={settingsOutline} internalPage={true}>
            <p>{t('Selecciona un origen y destino para definir un viaje. El visor mostrará tanto la ida como la vuelta del viaje.')}</p>
            <IonCard color={selectingOrigin ? "primary" : "light"}>
                <IonCardHeader>
                    <IonCardTitle>{t('Origen')}</IonCardTitle>
                </IonCardHeader>
                <IonCardContent>
                    {origin ? origin.name : t('No seleccionado')}
                    {origin && <IonButton size="small" fill="clear" onClick={() => handleToggleSelection(true)}>{t('Modificar')}</IonButton>}
                </IonCardContent>
            </IonCard>

            <IonCard color={!selectingOrigin ? "primary" : "light"}>
                <IonCardHeader>
                    <IonCardTitle>{t('Destino')}</IonCardTitle>
                </IonCardHeader>
                <IonCardContent>
                    {destination ? destination.name : t('No seleccionado')}
                    {destination && <IonButton size="small" fill="clear" onClick={() => handleToggleSelection(false)}>{t('Modificar')}</IonButton>}
                </IonCardContent>
            </IonCard>

            {origin && destination && (
                <IonButton expand="full" color="success"  onClick={() => handleAddRoute()}>
                    {t('Añadir viaje')}
                </IonButton>
            )}

            <IonItem>
                <IonLabel position="stacked">{t('Nombre de la estación')}</IonLabel>
                <IonInput
                    value={searchTerm}
                    placeholder={t('Escribe para filtrar')}
                    onIonInput={(e) => setSearchTerm(e.detail.value!)}
                />
            </IonItem>

            <IonGrid>
                {filteredStations.map((stop) => (
                    <IonItem key={stop.id} button onClick={() => handleSelectStation(stop)}>
                        <IonLabel>
                            <h3>{stop.name}</h3>
                        </IonLabel>
                    </IonItem>
                ))}
            </IonGrid>
        </Page>
    );
};

export default RenfeAddRoute;