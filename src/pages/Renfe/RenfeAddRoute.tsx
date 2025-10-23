
import React, { useEffect, useState } from 'react';
import { useIonViewWillEnter } from '@ionic/react';
import { settingsOutline } from 'ionicons/icons';
import Page from "../Page";
import { useTranslation } from "react-i18next";
import { Toast } from "@capacitor/toast";
import { useHistory, useLocation } from "react-router-dom";
import { RenfeStop } from '../../services/Renfe/RenfeStop';
import { getRenfeStops, addRenfeRoute } from '../../services/RenfeStorageFunctions';
import RenfeStationSelectorModal from '../../components/Renfe/RenfeStationSelectorModal';

const RenfeAddRoute: React.FC = () => {
    const [stations, setStations] = useState<RenfeStop[]>([]);
    const [origin, setOrigin] = useState<RenfeStop | null>(null);
    const [originName, setOriginName] = useState('');
    const [destination, setDestination] = useState<RenfeStop | null>(null);
    const [destinationName, setDestinationName] = useState('');
    const [showStationModal, setShowStationModal] = useState(true);
    const [isSelectingOrigin, setIsSelectingOrigin] = useState(true);
    const { t } = useTranslation();
    const history = useHistory();
    const location = useLocation<{ originStation?: RenfeStop }>();
    const passedOriginStation = location.state?.originStation;
    const [allLines, setAllLines] = useState<string[]>([]);

    useIonViewWillEnter(() => {
        fetchStations();
        if (passedOriginStation) {
            setOrigin(passedOriginStation);
            setOriginName(passedOriginStation.name);
            setIsSelectingOrigin(false);
            setShowStationModal(true);
        } else {
            setOrigin(null);
            setOriginName('');
            setDestination(null);
            setDestinationName('');
            setIsSelectingOrigin(true);
            setShowStationModal(true);
        }
    }, [passedOriginStation]);

    useEffect(() => {
        if (stations.length > 0) {
            const lines = [...new Set(stations.flatMap(s => s.Lines))];
            setAllLines(lines);
        }
    }, [stations]);

    const fetchStations = async () => {
        try {
            setStations(getRenfeStops());
        } catch (error) {
            console.error(t("stationSelector.errorLoadingStations"), error);
        }
    };

    const handleAddRoute = async (selectedOrigin: RenfeStop, selectedDestination: RenfeStop) => {
        addRenfeRoute(selectedOrigin.id + ' - ' + selectedDestination.id);
        await Toast.show({ text: t('Viaje añadido') });
        history.push('/renfe-displays');
    };

    const handleSelectStation = (stationId: string, stationName: string) => {
        const selectedStation = stations.find(s => s.id === stationId);
        if (!selectedStation) return;

        if (isSelectingOrigin) {
            setOrigin(selectedStation);
            setOriginName(stationName);
            setIsSelectingOrigin(false);
        } else {
            if (!origin) {
                console.error("Origin not set when selecting destination.");
                setShowStationModal(false);
                history.push('/renfe-displays');
                return;
            }
            setDestination(selectedStation);
            setDestinationName(stationName);
            setShowStationModal(false);
            handleAddRoute(origin, selectedStation);
        }
    };

    const handleCancelSelection = () => {
        setShowStationModal(false);
        history.push('/renfe-displays');
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
            <RenfeStationSelectorModal
                isOpen={showStationModal}
                onClose={handleCancelSelection}
                onCancel={handleCancelSelection}
                onSelectStation={handleSelectStation}
                stations={stations}
                title={getModalTitle()}
                originStationName={origin ? origin.name : null}
                allLines={allLines}
            />
        </Page>
    );
};

export default RenfeAddRoute;
