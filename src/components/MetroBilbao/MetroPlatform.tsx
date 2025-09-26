import React from 'react';
import {IonBadge} from '@ionic/react';
import './MetroPlatform.css';
import {MetroTrain} from "../../services/MetroBilbaoStorage";
import {useTranslation} from "react-i18next";
import {useConfiguration} from "../../context/ConfigurationContext";

const MetroPlatform: React.FC<{ platform: MetroTrain[], platformIndex: number, title: string }> = ({
                                                                                                       platform,
                                                                                                       platformIndex,
                                                                                                       title
                                                                                                   }) => {
    const {t} = useTranslation();
    const {settings} = useConfiguration();

    if (platform.length === 0) return null;

    return (
        <div className="train-list">
            <div className="train-list-header">{title}</div>
            {platform.map((train, trainIndex) => {
                const isCritical = train.Estimated < 2;
                return (
                    <div key={trainIndex} className="train-item">
                        <div className="train-destination">
                            {train.Direction || 'N/A'}
                            {trainIndex === 0 && train.Transfer && (
                                <div className="train-details">{t('Transbordo en')}: San Ignazio</div>
                            )}
                        </div>
                        <div className="train-time-info">
                            <div className={`train-time ${isCritical ? 'is-critical' : ''}`}>
                                {train.Estimated < 0 ? 0 : train.Estimated} min
                            </div>
                            <div className="train-details">
                                {new Date(train.Time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                {settings.verNumeroVagones && ` / ${train.Wagons || 4} ${t('vagones')}`}
                            </div>
                        </div>
                    </div>
                )
            })}
        </div>
    );
};

export default MetroPlatform;
