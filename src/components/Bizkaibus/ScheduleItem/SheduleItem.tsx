import React, {useState} from "react";
import {IonButton, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonIcon} from "@ionic/react";

import {useTranslation} from "react-i18next";
import {ConsultaHorario} from "../../../services/Bizkaibus/Schedule";
import {chevronDownOutline, chevronUpOutline} from "ionicons/icons";
import i18n from "i18next";

interface Props {
    index: number;
    schedule: ConsultaHorario;
}

const ScheduleItem: React.FC<Props> = ({ index, schedule }) => {
    const { t } = useTranslation();

    const initialFoldingState = index === 0;
    const isToggleDisabled = false;

    const [isOpen, setIsOpen] = useState(initialFoldingState);


    const toggleOpen = () => {
        if (!isToggleDisabled) {
            setIsOpen(!isOpen);
        }
    };

    const parseText = (input: string) => {
        const lines = input.split('\n');
        const elements = [];
        let currentSecondLevel = null;
        let currentThirdLevel = null;

        lines.forEach((line, index) => {
            if (!line.trim()) return;

            if (/^[A-Z\s]+:\s*$/.test(line)) {
                elements.push(
                    <p key={`h2-${index}`}>
                        <strong>{line.replace(/:$/, '')}</strong>
                    </p>
                );
                currentSecondLevel = null;
                currentThirdLevel = null;
            } else if (/^[A-Z][^:]+:\s*$/.test(line)) {
                currentSecondLevel = line.replace(/:$/, '');
                elements.push(<h3 key={`h3-${index}`}>{currentSecondLevel}</h3>);
                currentThirdLevel = null;
            } else if (/^[^:]+:\s*[^0-9]+.*$/.test(line)) {
                const [title, content] = line.split(/:(?!\d)/);
                if (content) {
                    currentThirdLevel = title.trim();
                    elements.push(<h4 key={`h4-${index}`}>{currentThirdLevel}</h4>);
                    elements.push(
                        <p className="horas-horario" key={`p-${index}`}>
                            {content.trim()}
                        </p>
                    );
                } else {
                    elements.push(
                        <p className="horas-horario" key={`p-${index}`}>
                            {line}
                        </p>
                    );
                }
            } else {
                elements.push(<p key={`p-${index}`}>{line}</p>);
            }
        });

        return elements;
    };

    return (
    <IonCard className="stop-card" key={index}>
        <IonCardHeader className="stop-card-header" onClick={toggleOpen}>
            <div className="header-content">
                <IonCardTitle className="station-card-title">
                    {index === 0 ? t('Horario actual') : `${t('Desde')}: ${schedule.FechaConsultaHorario}`}
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
                {Object.entries(schedule.Horario)
                    .filter(([hora]) => hora.startsWith("HT") && ((i18n.language === 'es' && hora.endsWith("C")) || (i18n.language === 'eu' && hora.endsWith("E"))))
                    .map(([hora, detalle], i) => (

                        <IonCard key={i} className="bus-card">
                            <IonCardContent>
                                {parseText(detalle)}
                            </IonCardContent>
                        </IonCard>

                    ))}
            </div>
        </IonCardContent>
    </IonCard>
    );
};

export default ScheduleItem;
