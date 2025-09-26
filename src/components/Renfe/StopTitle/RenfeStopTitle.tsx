import {IonLabel} from "@ionic/react";
import {RenfeStop} from "../../../services/Renfe/RenfeStop";

interface StopTitleProps {
    stop: RenfeStop;
}

const RenfeStopTitle: React.FC<StopTitleProps> = ({ stop }) => {
    return (
        <IonLabel>
            <h3>{stop.customName}</h3>
        </IonLabel>
    );
};

export default RenfeStopTitle;
