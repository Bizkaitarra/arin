import React, { useEffect, useState } from 'react';
import { IonInput, IonItem, IonLabel, IonButton, IonCard, IonCardHeader, IonCardTitle, IonCardContent, useIonViewWillEnter } from '@ionic/react';
import { settingsOutline } from 'ionicons/icons';
import Page from "../Page";
import {addEuskotrenRoute, getEuskotrenStops, EuskotrenStop} from "../../services/Euskotren/EuskotrenStorage";
import { useTranslation } from "react-i18next";
import {Toast} from "@capacitor/toast";
import {useHistory, useLocation} from "react-router-dom";
import {useCustomToast} from "../../components/ArinToast";
import StationSelectorModal from '../../components/Euskotren/StationSelectorModal'; // New import

const EuskotrenSelectRoute: React.FC = () => {
    const [stations, setStations] = useState<EuskotrenStop[]>([]);
    const [origin, setOrigin] = useState<EuskotrenStop | null>(null);
    const [originName, setOriginName] = useState('');
    const [destination, setDestination] = useState<EuskotrenStop | null>(null);
    const [destinationName, setDestinationName] = useState('');
    const [showStationModal, setShowStationModal] = useState(true); // Open modal automatically
    const [isSelectingOrigin, setIsSelectingOrigin] = useState(true); // Start by selecting origin
    const { t } = useTranslation();
    const history = useHistory();
    const location = useLocation<{ originStation?: EuskotrenStop }>();
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
            setStations(getEuskotrenStops());
        } catch (error) {
            console.error(t("stationSelector.errorLoadingStations"), error);
        }
    };

    const handleAddRoute = async (selectedOrigin: EuskotrenStop, selectedDestination: EuskotrenStop) => {
        addEuskotrenRoute(selectedOrigin.Code + ' - ' + selectedDestination.Code);

        await Toast.show({ text: t('Viaje añadido') });
        history.push('/euskotren-my-displays');
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
                history.push('/euskotren-my-displays'); // Go back to safety
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
        history.push('/euskotren-my-displays'); // Navigate back to "Mis visores"
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
                allLines={[]}
            />
        </Page>
    );
};


export default EuskotrenSelectRoute;