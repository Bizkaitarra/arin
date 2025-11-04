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
    IonSegment,
    IonSegmentButton,
    IonChip
} from '@ionic/react';
import { closeOutline } from 'ionicons/icons';
import { useTranslation } from 'react-i18next';
import './StationSelectorModal.css';

interface EuskotrenStation {
    Code: string;
    Name: string;
    Lines: string[];
}

interface StationSelectorModalProps {
    isOpen: boolean;
    onClose: () => void;
    onCancel: () => void;
    onSelectStation: (stationCode: string, stationName: string) => void;
    stations: EuskotrenStation[];
    title: string;
    originStationName?: string | null;
    allLines: string[];
}

const StationSelectorModal: React.FC<StationSelectorModalProps> = ({
    isOpen,
    onClose,
    onCancel,
    onSelectStation,
    stations,
    title,
    originStationName,
    allLines,
}) => {
    const { t } = useTranslation();
    const [searchText, setSearchText] = useState('');
    const [selectedLines, setSelectedLines] = useState<string[]>([]); // New state for line filtering
    const [filteredStations, setFilteredStations] = useState<EuskotrenStation[]>(stations);

    useEffect(() => {
        setFilteredStations(
            stations.filter(station =>
                station.Name.toLowerCase().includes(searchText.toLowerCase()) &&
                (selectedLines.length === 0 || station.Lines.some(line => selectedLines.includes(line)))
            )
        );
    }, [searchText, stations, selectedLines]); // Add selectedLines to dependency array

    const handleSelect = (station: EuskotrenStation) => {
        onSelectStation(station.Code, station.Name);
    };

    const handleLineChipClick = (lineValue: string) => {
        if (lineValue === 'all') {
            setSelectedLines([]);
        } else {
            setSelectedLines([lineValue]);
        }
    };

    return (
        <IonModal isOpen={isOpen}>
            <IonHeader>
                <IonToolbar>
                    <IonButton slot="start" onClick={onCancel}>
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
                    <div className="line-filters-container">
                        <IonChip
                            onClick={() => handleLineChipClick('all')}
                            color={selectedLines.length === 0 ? 'primary' : 'medium'}
                        >
                            <IonLabel>{t('stationSelector.allLines')}</IonLabel>
                        </IonChip>
                        {allLines.map(line => (
                            <IonChip
                                key={line}
                                onClick={() => handleLineChipClick(line)}
                                color={selectedLines.includes(line) ? 'primary' : 'medium'}
                            >
                                <IonLabel>{line}</IonLabel>
                            </IonChip>
                        ))}
                    </div>
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
