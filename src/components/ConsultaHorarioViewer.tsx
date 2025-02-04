import React from "react";
import { IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonList, IonItem, IonLabel } from "@ionic/react";
import {ConsultaHorario} from "../services/ApiBizkaibus";

interface Props {
    horarios: ConsultaHorario[];
}

const ConsultaHorarioViewer: React.FC<Props> = ({ horarios }) => {

    const groupedHorarios = horarios.reduce((acc, horario) => {
        if (!acc[horario.TRTipoRuta]) {
            acc[horario.TRTipoRuta] = [];
        }
        acc[horario.TRTipoRuta].push(horario);
        return acc;
    }, {} as Record<string, ConsultaHorario[]>);

    return (
        <IonList>
            {Object.entries(groupedHorarios).map(([tipoRuta, items]) => (
                <IonCard key={tipoRuta}>
                    <IonCardHeader>
                        <IonCardTitle>
                            {items[0].Linea} - {items[0].Descripcion}
                        </IonCardTitle>
                        <IonLabel>{items[0].DescripcionRuta}</IonLabel>
                    </IonCardHeader>
                    {items.map((item, index) => (
                        <IonCardContent key={index}>
                            <p><strong>Desde:</strong> {item.FechaConsultaHorario}</p>
                            <IonList>
                                {Object.entries(item.Horario)
                                    .filter(([hora, _]) => hora.startsWith("HT") && hora.endsWith("C")) // Filtra las horas
                                    .map(([hora, detalle], i) => (
                                        <IonItem key={i}>
                                            <IonLabel style={{ whiteSpace: 'pre-line' }}>
                                                {detalle}
                                            </IonLabel>
                                        </IonItem>
                                    ))}
                            </IonList>
                        </IonCardContent>
                    ))}
                </IonCard>
            ))}
        </IonList>
    );
};

export default ConsultaHorarioViewer;
