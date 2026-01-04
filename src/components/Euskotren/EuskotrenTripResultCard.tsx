import React, { useState } from "react";
import { IonCard, IonCardHeader, IonCardTitle, IonButton, IonIcon } from "@ionic/react";
import { chevronDownOutline, chevronUpOutline, arrowForwardOutline } from "ionicons/icons";
import "./EuskotrenStationCard.css";
import "./EuskotrenPlatform.css";
import { useTranslation } from "react-i18next";

interface Trip {
    originArrivalTimeRounder: string;
    destinyArrivalTimeRounder: string;
    duration: number;
}

interface EuskotrenTripResultCardProps {
    results: {
        origin: { name: string };
        destiny: { name: string };
        time: string | number;
        trip?: { duration: number };
        trips: Record<string, Trip[]>;
    };
}

const EuskotrenTripResultCard: React.FC<EuskotrenTripResultCardProps> = ({ results }) => {
    const { t } = useTranslation();
    const [isOpen, setIsOpen] = useState(true);

    const toggleOpen = () => {
        setIsOpen(!isOpen);
    };

    const title = `${results.origin.name} -> ${results.destiny.name}`;
    const duration = results.time && results.time != 0 ? results.time : (results.trip?.duration || 0);

    return (
        <IonCard className="euskotren-station-card">
            <IonCardHeader className="euskotren-station-card-header" onClick={toggleOpen}>
                <div className="header-content">
                    <IonCardTitle className="euskotren-station-card-title">
                        {title}
                    </IonCardTitle>
                    <IonButton fill="clear" className="toggle-button" onClick={(e) => { e.stopPropagation(); toggleOpen(); }}>
                        <IonIcon icon={isOpen ? chevronUpOutline : chevronDownOutline} />
                    </IonButton>
                </div>
            </IonCardHeader>

            {isOpen && (
                <div className="euskotren-station-card-content">
                    <div className="train-list">
                        {Object.values(results.trips).flat().map((trip: Trip, index: number) => (
                            <div key={index} className="train-item" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                                    <div style={{ fontSize: '1.2em', fontWeight: 'bold' }}>
                                        {trip.originArrivalTimeRounder}
                                    </div>
                                    <IonIcon icon={arrowForwardOutline} style={{ fontSize: '1.2em', color: '#666' }} />
                                    <div style={{ fontSize: '1.2em', fontWeight: 'bold' }}>
                                        {trip.destinyArrivalTimeRounder}
                                    </div>
                                </div>
                                <div style={{ fontSize: '0.9em', color: '#666' }}>
                                    {trip.duration} {t('min')}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </IonCard>
    );
};

export default EuskotrenTripResultCard;
