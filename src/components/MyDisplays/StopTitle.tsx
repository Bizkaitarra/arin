import {IonLabel} from "@ionic/react";
import {Stop} from "../../services/Stop";

interface StopTitleProps {
    stop: Stop;
    stopType: string;
}

const StopTitle: React.FC<StopTitleProps> = ({ stop, stopType }) => {
    return (
        <IonLabel>
            <h3>{stop.name} - {stop.customName || 'Sin nombre personalizado'}</h3>
            {
                (() => {
                    switch (stopType) {
                        case 'KBusStop':
                            return <p>Parada de KBus con acceso a WiFi</p>;
                        case 'BizkaibusStop':
                            return <p>Conexión con líneas interurbanas</p>;
                        case 'MetroBilbaoStop':
                            return <p>Acceso adaptado y parking cercano</p>;
                        default:
                            return null;
                    }
                })()
            }
        </IonLabel>
    );
};

export default StopTitle;
