
import React, { useState, useEffect } from 'react';
import {
    IonModal,
    IonHeader,
    IonToolbar,
    IonContent,
    IonSearchbar,
    IonList,
    IonItem,
    IonLabel,
    IonButton,
    IonIcon,
    IonSegment,
    IonSegmentButton
} from '@ionic/react';
import { closeOutline } from 'ionicons/icons';
import { useTranslation } from 'react-i18next';
import { RenfeStop } from '../../services/Renfe/RenfeStop';

interface RenfeStationSelectorModalProps {
    isOpen: boolean;
    onClose: () => void;
    onCancel: () => void;
    onSelectStation: (stationId: string, stationName: string) => void;
    stations: RenfeStop[];
    title: string;
    originStationName?: string | null;
    allLines: string[];
}

const RenfeStationSelectorModal: React.FC<RenfeStationSelectorModalProps> = ({
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
    const [selectedLines, setSelectedLines] = useState<string[]>([]);
    const [filteredStations, setFilteredStations] = useState<RenfeStop[]>(stations);

    useEffect(() => {
        setFilteredStations(
            stations.filter(station =>
                station.name.toLowerCase().includes(searchText.toLowerCase()) &&
                (selectedLines.length === 0 || station.Lines.some(line => selectedLines.includes(line)))
            )
        );
    }, [searchText, stations, selectedLines]);

    const handleSelect = (station: RenfeStop) => {
        onSelectStation(station.id, station.name);
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
                    <IonButton slot="start" onClick={onCancel}>{
                        t('stationSelector.cancel')
                    }</IonButton>
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
                            <IonItem key={station.id} onClick={() => handleSelect(station)} button>
                                <IonLabel>{station.name}</IonLabel>
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

export default RenfeStationSelectorModal;
