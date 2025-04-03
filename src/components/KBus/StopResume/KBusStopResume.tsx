import {IonChip} from "@ionic/react";
import {KBusStop} from "../../../services/KBus/KbusStop";
import KBusStopTitle from "../StopTitle/KBusStopTitle";

interface StopResumeProps {
    stop: KBusStop;
}

const KBusStopResume: React.FC<StopResumeProps> = ({stop}) => {
    return (
        <>
            <KBusStopTitle stop={stop}/>
            <div style={{display: "flex", flexWrap: "wrap", gap: "8px", marginTop: "8px"}}>
                {stop.lines.map((line, index) => (
                    <>
                        <IonChip key={index+'bl'} color="primary">
                            <strong>{line.bus}</strong> - {line.lineName}
                        </IonChip>
                        <IonChip key={index+'rd'} color="primary">
                            <strong>{line.ruteName}</strong> - {line.direction}
                        </IonChip>
                    </>
                ))}
            </div>
        </>
    );
};

export default KBusStopResume;