import React from 'react';
import './EuskotrenPlatform.css';
import {EuskotrenTrain} from "../../services/Euskotren/EuskotrenStorage";
import {useTranslation} from "react-i18next";
import {useConfiguration} from "../../context/ConfigurationContext";

const EuskotrenPlatform: React.FC<{ platform: EuskotrenTrain[], platformIndex: number, title: string, duration: number | undefined }> = ({
                                                                                                       platform,
                                                                                                       platformIndex,
                                                                                                       title,
                                                                                                       duration
                                                                                                   }) => {
    const {t} = useTranslation();
    const {settings} = useConfiguration();

    if (platform.length === 0) return null;

    return (
        <div className="train-list">
            <div className="train-list-header">
                {title}
                {duration && <div className="duration">{t('Duración estimada')}: {duration} min</div>}
            </div>
            {platform.map((train, trainIndex) => {
                const isCritical = train.Estimated < 2;
                const arrivalTime = new Date(train.Time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                return (
                    <div key={trainIndex} className="train-item">
                        <div className="train-destination">
                            {train.Direction || 'N/A'}
                        </div>
                        <div className="train-time-info">
                            <div className={`train-time ${isCritical ? 'is-critical' : ''}`} title={`Llegada: ${arrivalTime}`}>
                                {train.Estimated < 0 ? 0 : train.Estimated} {t('min')}
                            </div>
                            <div className="train-details">
                                {arrivalTime}
                            </div>
                        </div>
                    </div>
                )
            })}
        </div>
    );
};

export default EuskotrenPlatform;
