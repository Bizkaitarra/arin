import React, { useState, useEffect } from "react";
import { IonCard, IonCardHeader, IonCardTitle, IonButton, IonIcon } from "@ionic/react";
import { chevronDownOutline, chevronUpOutline } from "ionicons/icons";
import "./EuskotrenStationCard.css";
import { EuskotrenStopTrains, EuskotrenTrain, EuskotrenStop } from "../../services/Euskotren/EuskotrenStorage";
import EuskotrenPlatform from "./EuskotrenPlatform";
import i18next from "i18next";
import { useConfiguration } from "../../context/ConfigurationContext";

const EuskotrenStationCard: React.FC<{ stationData: EuskotrenStopTrains }> = ({ stationData }) => {
    const { settings } = useConfiguration();

    const initialFoldingState = settings.metroDisplayFolding === "collapsed" ? false : true;
    const isToggleDisabled = !settings.metroDisplayFolding || settings.metroDisplayFolding === "disabled";

    const [isOpen, setIsOpen] = useState(initialFoldingState);

    useEffect(() => {
        setIsOpen(initialFoldingState);
    }, [settings.metroDisplayFolding]);

    const toggleOpen = () => {
        if (!isToggleDisabled) {
            setIsOpen(!isOpen);
        }
    };

    const getPlatformTitle = (platform: EuskotrenTrain[], platformIndex: number): string => {
        if (stationData.isRoute) {
            return platformIndex === 0
                ? `${stationData.Display.origin.Name} - ${stationData.Display.destination.Name}`
                : `${stationData.Display.destination.Name} - ${stationData.Display.origin.Name}`;
        }
        return ""; // Should not happen for routes
    };

    let title = `${stationData.Display.origin.Name}`;
    if (stationData.isRoute) {
        title = `${stationData.Display.origin.Name} - ${stationData.Display.destination.Name}`;
    }

    return (
        <IonCard className="euskotren-station-card">
            <IonCardHeader className="euskotren-station-card-header" onClick={toggleOpen}>
                <div className="header-content">
                    <IonCardTitle className="euskotren-station-card-title">
                        {title}
                    </IonCardTitle>
                    <IonButton fill="clear" className="toggle-button" onClick={(e) => { e.stopPropagation(); toggleOpen(); }}>
                        {!isToggleDisabled && (
                            <IonIcon icon={isOpen ? chevronUpOutline : chevronDownOutline} />
                        )}
                    </IonButton>
                </div>
            </IonCardHeader>

            {isOpen && (
                <div className="euskotren-station-card-content">
                    {[stationData.Platform1, stationData.Platform2].map((platform, platformIndex) => (
                        <EuskotrenPlatform
                            key={platformIndex}
                            platform={platform}
                            platformIndex={platformIndex}
                            title={getPlatformTitle(platform, platformIndex)}
                            duration={platformIndex === 0 ? stationData.duration : stationData.duration2}
                        />
                    ))}
                </div>
            )}
        </IonCard>
    );
};

export default EuskotrenStationCard;
