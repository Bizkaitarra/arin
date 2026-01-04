import React, { useState } from "react";
import { IonCard, IonCardHeader, IonCardTitle, IonButton, IonIcon } from "@ionic/react";
import { chevronDownOutline, chevronUpOutline, arrowForwardOutline } from "ionicons/icons";
import "./MetroStationCard.css";
import "./MetroPlatform.css";
import { useTranslation } from "react-i18next";

interface Trip {
    originArrivalTimeRounder: string;
    destinyArrivalTimeRounder: string;
}

interface MetroTripResultCardProps {
    results: {
        origin: { name: string };
        destiny: { name: string };
        time: string | number;
        trip?: { duration: number };
        trips: Record<string, Trip[]>;
    };
}

const MetroTripResultCard: React.FC<MetroTripResultCardProps> = ({ results }) => {
    const { t } = useTranslation();
    const [isOpen, setIsOpen] = useState(true);

    const toggleOpen = () => {
        setIsOpen(!isOpen);
    };

    const calculateDuration = (startTime: string, endTime: string): number => {
        if (!startTime || !endTime) return 0;

        const [startHours, startMinutes] = startTime.split(':').map(Number);
        const [endHours, endMinutes] = endTime.split(':').map(Number);

        const startTotalMinutes = startHours * 60 + startMinutes;
        let endTotalMinutes = endHours * 60 + endMinutes;

        // Handle next day arrival (e.g. 23:50 -> 00:10)
        if (endTotalMinutes < startTotalMinutes) {
            endTotalMinutes += 24 * 60;
        }

        return endTotalMinutes - startTotalMinutes;
    };

    const title = `${results.origin.name} -> ${results.destiny.name}`;

    return (
        <IonCard className="metro-station-card">
            <IonCardHeader className="metro-station-card-header" onClick={toggleOpen}>
                <div className="header-content">
                    <IonCardTitle className="metro-station-card-title">
                        {title}
                    </IonCardTitle>
                    <IonButton fill="clear" className="toggle-button" onClick={(e) => { e.stopPropagation(); toggleOpen(); }}>
                        <IonIcon icon={isOpen ? chevronUpOutline : chevronDownOutline} />
                    </IonButton>
                </div>
            </IonCardHeader>

            {isOpen && (
                <div className="metro-station-card-content">
                    <div className="train-list">
                        {Object.values(results.trips).flat().map((trip: Trip, index: number) => {
                            const duration = calculateDuration(trip.originArrivalTimeRounder, trip.destinyArrivalTimeRounder);
                            return (
                                <div key={index} className="train-item" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', alignItems: 'center' }}>
                                        <div style={{ fontSize: '1.2em', fontWeight: 'bold' }}>
                                            {trip.originArrivalTimeRounder}
                                        </div>
                                        <IonIcon icon={arrowForwardOutline} style={{ fontSize: '1.2em', color: '#666' }} />
                                        <div style={{ fontSize: '1.2em', fontWeight: 'bold' }}>
                                            {trip.destinyArrivalTimeRounder}
                                        </div>
                                    </div>
                                    <div className="train-duration" style={{ fontSize: '0.8em', color: '#666' }}>
                                        ({duration} {t('min')})
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </IonCard>
    );
};

export default MetroTripResultCard;
