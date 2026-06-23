import React, { useState } from "react";
import { IonCard, IonCardHeader, IonCardTitle, IonButton, IonIcon } from "@ionic/react";
import { chevronDownOutline, chevronUpOutline, arrowForwardOutline } from "ionicons/icons";
import "../MetroBilbao/MetroStationCard.css"; // Reuse Metro styles for consistency, or copy if needed. User asked to be consistent with Renfe elements. RenfeStationCard.css exists.
import "./RenfeStationCard/RenfeStationCard.css";
import "./RenfePlatform/RenfePlatform.css"; // Assuming similar structure
import { useTranslation } from "react-i18next";

interface RenfeTripResultCardProps {
    results: {
        origin: string;
        destination: string;
        trains: any[];
    };
}

const RenfeTripResultCard: React.FC<RenfeTripResultCardProps> = ({ results }) => {
    const { t } = useTranslation();
    const [isOpen, setIsOpen] = useState(true);

    const toggleOpen = () => {
        setIsOpen(!isOpen);
    };

    const title = `${results.origin} -> ${results.destination}`;

    // Duration is per train in Renfe, not a global average usually, but we can take the first one or just display it per row.
    // Metro card showed "Duración media". Renfe API returns 'duracion' for each train.

    return (
        <IonCard className="renfe-station-card">
            <IonCardHeader className="renfe-station-card-header" onClick={toggleOpen}>
                <div className="renfe-header-content">
                    <IonCardTitle className="renfe-station-card-title">
                        {title}
                    </IonCardTitle>
                    <IonButton fill="clear" className="toggle-button" onClick={(e) => { e.stopPropagation(); toggleOpen(); }}>
                        <IonIcon icon={isOpen ? chevronUpOutline : chevronDownOutline} />
                    </IonButton>
                </div>
            </IonCardHeader>

            {isOpen && (
                <div className="renfe-station-card-content">
                    <div className="train-list">
                        {/* Renfe trains list */}
                        {results.trains.map((train: any, index: number) => (
                            <div key={index} className="train-item" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                    <div className="train-time">
                                        {train.horaSalida}
                                    </div>
                                    <IonIcon icon={arrowForwardOutline} style={{ color: '#666' }} />
                                    <div className="train-time">
                                        {train.horaLlegada}
                                    </div>
                                </div>
                                <div className="train-details">
                                    {train.duracion}
                                </div>
                            </div>
                        ))}
                        {results.trains.length === 0 && (
                            <div className="train-item">
                                {t('No se han encontrado trenes.')}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </IonCard>
    );
};

export default RenfeTripResultCard;
