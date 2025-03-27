import React from "react";
import './ScheduleViewer.css';
import ScheduleItem from "../ScheduleItem/SheduleItem";
import {ConsultaHorario} from "../../../services/Bizkaibus/Schedule";

interface Props {
    horarios: Record<string, ConsultaHorario[]>;
}

const ScheduleViewer: React.FC<Props> = ({horarios}) => {
    return (
        <>
            {Object.entries(horarios).map(([tipoRuta, items]) => (
                <>
                    {items.map((item, index) => {
                        return (
                            <ScheduleItem index={index} schedule={item}/>
                        );
                    })}
                </>
            ))}
        </>
    );
};

export default ScheduleViewer;
