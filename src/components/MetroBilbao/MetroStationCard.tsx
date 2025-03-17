import React, { useState, useEffect } from "react";
import { IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonButton, IonIcon } from "@ionic/react";
import { chevronDownOutline, chevronUpOutline } from "ionicons/icons";
import "./MetroDisplay.css";
import { MetroStopTrains, MetroTrain } from "../../services/MetroBilbaoStorage";
import MetroPlatform from "./MetroPlatform";
import { MetroStop } from "../../services/MetroBilbao/Display";
import i18next from "i18next";
import { useConfiguration } from "../../context/ConfigurationContext";

const MetroStationCard: React.FC<{ stationData: MetroStopTrains }> = ({ stationData }) => {
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

    const getNameForDisplay = (stop: MetroStop): string => {
        if (stop.Code === 'CAV') {
            let language = i18next.language || "es";
            return language === "es" ? 'Casco Viejo' : 'Zazpi kaleak';
        }
        return stop.Name;
    };

    const getPlatformTitle = (platform: MetroTrain[], platformIndex: number): string => {
        if (stationData.isRoute) {
            return platformIndex === 0
                ? `${stationData.Display.origin.Name} - ${stationData.Display.destination.Name}`
                : `${stationData.Display.destination.Name} - ${stationData.Display.origin.Name}`;
        }
        const hasTrainToEtxebarriOrBasauri = platform.some(train => train.Direction === "Etxebarri" || train.Direction === "Basauri");
        const hasL1 = stationData.Display.origin.Lines.includes("L1");
        const hasL2 = stationData.Display.origin.Lines.includes("L2");
        if (hasTrainToEtxebarriOrBasauri) {
            return hasL1 && hasL2 ? "Etxebarri/Basauri" : hasL1 ? "Etxebarri" : "Basauri";
        }
        return hasL1 && hasL2 ? "Kabiezes/Plentzia" : hasL1 ? "Plentzia" : "Kabiezes";
    };

    let title = getNameForDisplay(stationData.Display.origin) + " - " + stationData.Display.origin.Lines.join(",");
    if (stationData.isRoute) {
        title = getNameForDisplay(stationData.Display.origin) + " - " + getNameForDisplay(stationData.Display.destination);
    }

    return (
        <IonCard className="stop-card">
            <IonCardHeader className="station-card-header" onClick={toggleOpen}>
                <div className="header-content">
                    <IonCardTitle className="station-card-title">
                        {title}
                    </IonCardTitle>

                        <IonButton fill="clear" className="toggle-button" onClick={(e) => { e.stopPropagation(); toggleOpen(); }}>
                            {!isToggleDisabled && (
                                <IonIcon icon={isOpen ? chevronUpOutline : chevronDownOutline} />
                            )}
                        </IonButton>

                </div>
            </IonCardHeader>

            <IonCardContent className={isOpen ? "expanded" : "collapsed"}>
                <div className="bus-cards-container">
                    {[stationData.Platform1, stationData.Platform2].map((platform, platformIndex) => (
                        <MetroPlatform
                            key={platformIndex}
                            platform={platform}
                            platformIndex={platformIndex}
                            title={getPlatformTitle(platform, platformIndex)}
                        />
                    ))}
                </div>
            </IonCardContent>
        </IonCard>
    );
};

export default MetroStationCard;
