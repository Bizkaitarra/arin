import React from 'react';
import './EuskotrenPlatform.css';
import {EuskotrenTrain} from "../../services/Euskotren/EuskotrenStorage";
import {useTranslation} from "react-i18next";
import {useConfiguration} from "../../context/ConfigurationContext";
import paradasEuskotren from "../../data/paradas_euskotren.json";

const EuskotrenPlatform: React.FC<{ platform: EuskotrenTrain[], platformIndex: number, title: string, duration: number | undefined, originLines: string[] }> = ({
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

    const getEuskotrenLine = (direction: string): string => {
        const cleanDir = direction.toLowerCase().trim();
        const stop = paradasEuskotren.find(p => 
            p.Name.toLowerCase().includes(cleanDir) || 
            cleanDir.includes(p.Name.toLowerCase())
        );
        if (stop && stop.Lines && stop.Lines.length > 0) {
            const common = stop.Lines.filter(l => originLines.includes(l));
            if (common.length > 0) return common[0];
            return stop.Lines[0];
        }
        return originLines[0] || "E";
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
                const resolvedLine = getEuskotrenLine(train.Direction || "");
                return (
                    <div key={trainIndex} className="train-item">
                        <div className="train-destination" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span className="line-badge euskotren-badge">{resolvedLine}</span>
                            <span style={{ color: 'var(--arin-text-color)' }}>{train.Direction || 'N/A'}</span>
                        </div>
                        <div className="train-time-info">
                            <div className={`euskotren-train-time ${statusClass}`} title={`Llegada: ${arrivalTime}`}>
                                {arrivalInMinutes} {t('min')}
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
