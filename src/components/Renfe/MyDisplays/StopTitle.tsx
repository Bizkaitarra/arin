import {IonLabel} from "@ionic/react";
import {Stop} from "../../services/Stop";
import {useTranslation} from "react-i18next";

interface StopTitleProps {
    stop: Stop;
    stopType: string;
}

const StopTitle: React.FC<StopTitleProps> = ({ stop, stopType }) => {
    const { t } = useTranslation();
    return (
        <IonLabel>
            <h3>{stop.name} - {stop.customName || t('Sin nombre personalizado')}</h3>
            {
                (() => {
                    switch (stopType) {
                        case 'KBusStop':
                            return <p>{t('Parada de KBus con acceso a WiFi')}</p>;
                        case 'BizkaibusStop':
                            return <p>{t('Conexión con líneas interurbanas')}</p>;
                        case 'MetroBilbaoStop':
                            return <p>{t('Acceso adaptado y parking cercano')}</p>;
                        default:
                            return null;
                    }
                })()
            }
        </IonLabel>
    );
};

export default StopTitle;
