import React from 'react';
import './MetroPlatform.css';
import {MetroTrain} from "../../services/MetroBilbaoStorage";
import {useTranslation} from "react-i18next";
import {useConfiguration} from "../../context/ConfigurationContext";
import paradasMetro from "../../data/paradas_metro.json";

const MetroPlatform: React.FC<{ platform: MetroTrain[], platformIndex: number, title: string, duration: number | undefined, originLines: string[] }> = ({
                                                                                                       platform,
                                                                                                       platformIndex,
                                                                                                       title,
                                                                                                       duration,
                                                                                                       originLines
                                                                                                   }) => {
    const {t} = useTranslation();
    const {settings} = useConfiguration();

    const getMinutesStatusClass = (mins: number) => {
        if (mins <= 3) return 'status-critical';
        if (mins <= 10) return 'status-warning';
        return 'status-normal';
    };

    const getMetroLine = (direction: string): string => {
        const cleanDir = direction.toLowerCase().trim();
        // L3 is a special case since it has its own routing
        if (originLines.includes("L3")) return "L3";
        
        const stop = paradasMetro.find(p => 
            p.Name.toLowerCase().includes(cleanDir) || 
            cleanDir.includes(p.Name.toLowerCase())
        );
        if (stop && stop.Lines && stop.Lines.length > 0) {
            const common = stop.Lines.filter(l => originLines.includes(l));
            if (common.length > 0) return common[0];
            return stop.Lines[0];
        }
        return originLines[0] || "M";
    };

    if (platform.length === 0) return null;

    return (
        <div className="train-list">
            <div className="train-list-header">
                {title}
                {duration && <div className="duration">{t('Duración estimada')}: {duration} min</div>}
            </div>
            {platform.map((train, trainIndex) => {
                const arrivalInMinutes = train.Estimated < 0 ? 0 : train.Estimated;
                const statusClass = getMinutesStatusClass(arrivalInMinutes);
                const arrivalTime = new Date(train.Time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                const resolvedLine = getMetroLine(train.Direction || "");
                return (
                    <div key={trainIndex} className="train-item">
                        <div className="train-destination" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span className="line-badge metro-badge">{resolvedLine}</span>
                            <span style={{ color: 'var(--arin-text-color)' }}>
                                {train.Direction || 'N/A'}
                                {trainIndex === 0 && train.Transfer && (
                                    <div className="train-details">{t('Transbordo en')}: San Ignazio</div>
                                )}
                            </span>
                        </div>
                        <div className="train-time-info">
                            <div className={`metro-train-time ${statusClass}`} title={`Llegada: ${arrivalTime}`}>
                                {arrivalInMinutes} {t('min')}
                            </div>
                            <div className="train-details">
                                {arrivalTime}
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
