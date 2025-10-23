import React, { useEffect, useState } from 'react';
import { IonInput, IonItem, IonLabel, IonButton, IonCard, IonCardHeader, IonCardTitle, IonCardContent, useIonViewWillEnter } from '@ionic/react';
import { settingsOutline } from 'ionicons/icons';
import Page from "../Page";
import {addRoute, getMetroStops, MetroStop} from "../../services/MetroBilbaoStorage";
import { useTranslation } from "react-i18next";
import {Toast} from "@capacitor/toast";
import {useHistory, useLocation} from "react-router-dom";
import {useCustomToast} from "../../components/ArinToast";
import StationSelectorModal from '../../components/MetroBilbao/StationSelectorModal'; // New import

const MetroBilbaoSelectRoute: React.FC = () => {
    const [stations, setStations] = useState<MetroStop[]>([]);
    const [origin, setOrigin] = useState<MetroStop | null>(null);
    const [originName, setOriginName] = useState('');
    const [destination, setDestination] = useState<MetroStop | null>(null);
    const [destinationName, setDestinationName] = useState('');
    const [showStationModal, setShowStationModal] = useState(true); // Open modal automatically
    const [isSelectingOrigin, setIsSelectingOrigin] = useState(true); // Start by selecting origin
    const { t } = useTranslation();
    const history = useHistory();
    const location = useLocation<{ originStation?: MetroStop }>();
    const passedOriginStation = location.state?.originStation;
    const { presentArinToast } = useCustomToast();


    useIonViewWillEnter(() => {
        fetchStations();
        if (passedOriginStation) {
            setOrigin(passedOriginStation);
            setOriginName(passedOriginStation.Name);
            setIsSelectingOrigin(false);
            setShowStationModal(true);
        } else {
            setOrigin(null);
            setOriginName('');
            setDestination(null);
            setDestinationName('');
            setIsSelectingOrigin(true); // Start by selecting origin
            setShowStationModal(true); // Open modal automatically
        }
    }, [passedOriginStation]);

    const fetchStations = async () => {
        try {
            setStations(getMetroStops());
        } catch (error) {
            console.error(t("stationSelector.errorLoadingStations"), error);
        }
    };

    const handleAddRoute = async (selectedOrigin: MetroStop, selectedDestination: MetroStop) => {
        const originIsL3 = isLine3Station(selectedOrigin);
        const destinationIsL3 = isLine3Station(selectedDestination);

        if ((originIsL3 && !destinationIsL3) || (!originIsL3 && destinationIsL3)) {
            console.log('por aqui')
            await Toast.show({ text: t('metroBilbao.l3MixedLineError') });

            presentArinToast({
                message: t('metroBilbao.l3MixedLineError'),
                duration: 8000,
                color: 'danger'
            });
            return;
        }

        addRoute(selectedOrigin.Code + ' - ' + selectedDestination.Code);

        await Toast.show({ text: t('Viaje añadido') });
        history.push('/metro-bilbao-my-displays');
    };

    const handleSelectStation = (stationCode: string, stationName: string) => {
        const selectedStation = stations.find(s => s.Code === stationCode);
        if (!selectedStation) return;

        if (isSelectingOrigin) {
            setOrigin(selectedStation);
            setOriginName(stationName);
            setIsSelectingOrigin(false); // Next, select destination, modal stays open
            // The modal remains open automatically
        } else {
            // This is the destination selection
            // We need to ensure origin is already set before proceeding
            if (!origin) {
                // This case should ideally not happen in the sequential flow
                // but as a safeguard, we can log an error or reset
                console.error("Origin not set when selecting destination.");
                setShowStationModal(false);
                history.push('/metro-bilbao-my-displays'); // Go back to safety
                return;
            }
            setDestination(selectedStation);
            setDestinationName(stationName);
            setShowStationModal(false); // Close modal after destination is selected
            handleAddRoute(origin, selectedStation); // Automatically add route with correct origin
        }
    };

    const handleCancelSelection = () => {
        setShowStationModal(false);
        history.push('/metro-bilbao-my-displays'); // Navigate back to "Mis visores"
    };

    const isLine3Station = (station: MetroStop): boolean => {
        return station.Lines.includes('L3');
    };

    const getModalTitle = () => {
        if (isSelectingOrigin) {
            return t('stationSelector.selectOrigin');
        }
        return t('stationSelector.selectDestination');
    }

    return (
        <Page title={t('Seleccionar ruta')} icon={settingsOutline} internalPage={true}>
            <p>{t('Selecciona un origen y destino para definir un viaje. El visor mostrará tanto la ida como la vuelta del viaje.')}</p>
            {/* No IonItem for origin/destination here, selection is modal-driven */}
            {/* No "Add Route" button here, as it's automatic */}

            <StationSelectorModal
                isOpen={showStationModal}
                onClose={handleCancelSelection} // Now calls handleCancelSelection
                onCancel={handleCancelSelection} // This will be called if user clicks cancel button
                onSelectStation={handleSelectStation}
                stations={stations}
                title={getModalTitle()}
                originStationName={origin ? origin.Name : null} // new prop
                allLines={['L1', 'L2', 'L3']}
            />
        </Page>
    );
};


export default MetroBilbaoSelectRoute;