import React, {useEffect, useState} from "react";
import {IonButton, IonCard, IonCardHeader, IonCardTitle, IonIcon} from "@ionic/react";
import {chevronDownOutline, chevronUpOutline} from "ionicons/icons";
import {Platforms} from "../../../services/Renfe/ApiRenfe";
import {useConfiguration} from "../../../context/ConfigurationContext";
import RenfePlatform from "../RenfePlatform/RenfePlatform";
import './RenfeStationCard.css';

const RenfeStationCard: React.FC<{ stationData: Platforms }> = ({stationData}) => {
    const {settings} = useConfiguration();

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
    const getPlatformTitle = (platform: Platforms, index: number): string => {
        if (index === 0) return `${platform.origin.name} - ${platform.destiny.name}`;
        return `${platform.destiny.name} - ${platform.origin.name}`;
    };
    const title = stationData.origin.name + " - " + stationData.destiny.name;

    return (
        <IonCard className="renfe-station-card">
            <IonCardHeader className="renfe-station-card-header" onClick={toggleOpen}>
                <div className="renfe-header-content">
                    <IonCardTitle>
                        {title}
                    </IonCardTitle>

                    <IonButton fill="clear" className="toggle-button" onClick={(e) => {
                        e.stopPropagation();
                        toggleOpen();
                    }}>
                        {!isToggleDisabled && (
                            <IonIcon icon={isOpen ? chevronUpOutline : chevronDownOutline}/>
                        )}
                    </IonButton>

                </div>
            </IonCardHeader>

            {isOpen && (
                <div className="renfe-station-card-content">
                    {[stationData.Platform1, stationData.Platform2].map((platform, platformIndex) => (
                        <RenfePlatform
                            key={platformIndex}
                            platform={platform}
                            platformIndex={platformIndex}
                            title={getPlatformTitle(stationData, platformIndex)}
                            destiny={platformIndex === 0 ? stationData.destiny.name : stationData.origin.name}
                        />
                    ))}
                </div>
            )}
        </IonCard>
    );
};

export default RenfeStationCard;
