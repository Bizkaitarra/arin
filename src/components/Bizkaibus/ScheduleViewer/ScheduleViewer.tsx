import React from "react";
import { IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonList, IonItem, IonLabel } from "@ionic/react";
import {ConsultaHorario} from "../../../services/ApiBizkaibus";
import './ScheduleViewer.css';
import {useTranslation} from "react-i18next";
interface Props {
    horarios: Record<string, ConsultaHorario[]>;
}

const ScheduleViewer: React.FC<Props> = ({ horarios }) => {
    const { t } = useTranslation();
    const parseText = (input) => {
        const lines = input.split('\n');
        const elements = [];
        let currentSecondLevel = null;
        let currentThirdLevel = null;

        lines.forEach((line, index) => {
            if (!line.trim()) return;

            if (/^[A-Z\s]+:\s*$/.test(line)) {
                // Primer nivel (mayúsculas hasta los dos puntos)
                elements.push(<p><strong key={`h2-${index}`}>{line.replace(/:$/, '')}</strong></p>);
                currentSecondLevel = null;
                currentThirdLevel = null;
            } else if (/^[A-Z][^:]+:\s*$/.test(line)) {
                // Segundo nivel (inicio en mayúscula hasta los dos puntos)
                currentSecondLevel = line.replace(/:$/, '');
                elements.push(<h3 key={`h3-${index}`}>{currentSecondLevel}</h3>);
                currentThirdLevel = null;
            } else if (/^[^:]+:\s*[^0-9]+.*$/.test(line)) {
                // Tercer nivel (título dentro de un segundo nivel, evitando horas)
                const [title, content] = line.split(/:(?!\d)/);
                if (content) {
                    currentThirdLevel = title.trim();
                    elements.push(<h4 key={`h4-${index}`}>{currentThirdLevel}</h4>);
                    elements.push(<p className="horas-horario" key={`p-${index}`}>{content.trim()}</p>);
                } else {
                    elements.push(<p className="horas-horario" key={`p-${index}`}>{line}</p>);
                }
            } else {
                // Contenido normal
                elements.push(<p key={`p-${index}`}>{line}</p>);
            }
        });

        return elements;
    };


    return (
        <div>
            {Object.entries(horarios).map(([tipoRuta, items]) => (
                <>
                    <h1>{items[0].Linea} - {items[0].Descripcion}</h1>
                <div className="stops-display">

                    {items.map((item, index) => (
                        <IonCard className="stop-card" key={tipoRuta}>
                            <IonCardHeader>
                                <IonCardTitle>
                                    {t('Desde')}: {item.FechaConsultaHorario}
                                </IonCardTitle>
                            </IonCardHeader>
                        <IonCardContent key={index}>
                            <div className="bus-cards-container">

                                {Object.entries(item.Horario)
                                    .filter(([hora, _]) => hora.startsWith("HT") && hora.endsWith("C")) // Filtra las horas
                                    .map(([hora, detalle], i) => (
                                        <IonCard key={i} className="bus-card">
                                            <IonCardContent style={{ whiteSpace: 'pre-line' }}>
                                                {parseText(detalle)}
                                            </IonCardContent>
                                        </IonCard>
                                    ))}
                            </div>
                        </IonCardContent>
                        </IonCard>
                    ))}
                </div>
                </>
            ))}

        </div>
    );
};

export default ScheduleViewer;
