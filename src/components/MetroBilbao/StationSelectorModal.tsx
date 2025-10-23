import React, { useState, useEffect } from 'react';
import {
    IonModal,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonSearchbar,
    IonList,
    IonItem,
    IonLabel,
    IonButton,
    IonIcon,
    IonSegment, // New import
    IonSegmentButton // New import
} from '@ionic/react';
import { closeOutline } from 'ionicons/icons';
import { useTranslation } from 'react-i18next';

interface Station {
    Code: string;
    Name: string;
    Lines: string[];
}

interface StationSelectorModalProps {
    isOpen: boolean;
    onClose: () => void;
    onCancel: () => void; // New prop for cancel handler
    onSelectStation: (stationCode: string, stationName: string) => void;
    stations: Station[];
    title: string;
    originStationName?: string | null;
    allLines: string[]; // Changed from availableLines
}

const StationSelectorModal: React.FC<StationSelectorModalProps> = ({
    isOpen,
    onClose,
    onCancel, // Destructure new prop
    onSelectStation,
    stations,
    title,
    originStationName, // Destructure new prop
    allLines, // Destructure new prop
}) => {
    const { t } = useTranslation();
    const [searchText, setSearchText] = useState('');
    const [selectedLines, setSelectedLines] = useState<string[]>([]); // New state for line filtering
    const [filteredStations, setFilteredStations] = useState<Station[]>(stations);

    useEffect(() => {
        setFilteredStations(
            stations.filter(station =>
                station.Name.toLowerCase().includes(searchText.toLowerCase()) &&
                (selectedLines.length === 0 || station.Lines.some(line => selectedLines.includes(line)))
            )
        );
    }, [searchText, stations, selectedLines]); // Add selectedLines to dependency array

    const handleSelect = (station: Station) => {
        onSelectStation(station.Code, station.Name);
    };

    const handleLineSegmentChange = (e: CustomEvent) => {
        const segmentValue = e.detail.value;
        if (segmentValue === 'all') {
            setSelectedLines([]);
        } else {
            setSelectedLines([segmentValue]);
        }
    };

    return (
        <IonModal isOpen={isOpen}>
            <IonHeader>
                <IonToolbar>
                    <IonButton slot="start" onClick={onCancel}> {/* New cancel button */}
                        {t('stationSelector.cancel')}
                    </IonButton>
                    <IonButton slot="end" onClick={onClose}>
                        <IonIcon icon={closeOutline} />
                    </IonButton>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                <div className="ion-padding ion-text-center">
                    {originStationName && (
                        <p><strong>{t('stationSelector.origin')}:</strong> {originStationName}</p>
                    )}
                    <h2>{title}</h2>
                </div>
                <IonSearchbar
                    value={searchText}
                    onIonInput={(e) => setSearchText(e.detail.value!)}
                    placeholder={t('stationSelector.searchStation')}
                />
                {allLines.length > 0 && (
                    <IonSegment value={selectedLines.length === 0 ? 'all' : selectedLines[0]} onIonChange={handleLineSegmentChange}>
                        <IonSegmentButton value="all">
                            <IonLabel>{t('stationSelector.allLines')}</IonLabel>
                        </IonSegmentButton>
                        {allLines.map(line => (
                            <IonSegmentButton key={line} value={line}>
                                <IonLabel>{line}</IonLabel>
                            </IonSegmentButton>
                        ))}
                    </IonSegment>
                )}
                <IonList>
                    {filteredStations.length > 0 ? (
                        filteredStations.map(station => (
                            <IonItem key={station.Code} onClick={() => handleSelect(station)} button>
                                <IonLabel>{station.Name}</IonLabel>
                            </IonItem>
                        ))
                    ) : (
                        <IonItem>
                            <IonLabel>{t('stationSelector.noStationsFound')}</IonLabel>
                        </IonItem>
                    )}
                </IonList>
            </IonContent>
        </IonModal>
    );
};

export default StationSelectorModal;
