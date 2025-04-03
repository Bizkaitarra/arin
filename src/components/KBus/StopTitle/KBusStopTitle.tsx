import {IonLabel} from "@ionic/react";
import {KBusStop} from "../../../services/KBus/KbusStop";

interface StopTitleProps {
    stop: KBusStop;
}

const KBusStopTitle: React.FC<StopTitleProps> = ({ stop }) => {
    return (
        <IonLabel>
            <h3>{stop.customName}</h3>
        </IonLabel>
    );
};

export default KBusStopTitle;
