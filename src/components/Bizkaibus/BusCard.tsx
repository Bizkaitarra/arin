import {
    IonBadge,
    IonButton,
    IonCard,
    IonCardContent,
    IonCardTitle,
    IonIcon,
    IonItem,
    IonLabel,
    IonList,
    IonPopover
} from '@ionic/react';
import {ellipsisVertical, map, timerOutline} from 'ionicons/icons';
import React, {useState} from 'react';
import {BusArrival} from "../../services/ApiBizkaibus";
import {useHistory} from "react-router-dom";
import {useTranslation} from "react-i18next";

interface Props {
    arrival: BusArrival,
    index: number
}
const BusCard: React.FC<Props> = ({ arrival, index }) => {
    const [popoverEvent, setPopoverEvent] = useState<MouseEvent | null>(null);
    const { t } = useTranslation();
    const history = useHistory();
    return (
        <IonCard key={index} className="bus-card">
            <IonCardContent>
                {/* Encabezado con título y menú */}
                <div className="ion-justify-content-between ion-align-items-center" style={{ display: 'flex' }}>
                    <IonCardTitle>
                        {`${arrival.linea} - ${arrival.ruta}`}
                    </IonCardTitle>
                    <IonButton fill="clear" onClick={(e) => setPopoverEvent(e.nativeEvent)}>
                        <IonIcon icon={ellipsisVertical} />
                    </IonButton>
                </div>

                <IonPopover
                    isOpen={Boolean(popoverEvent)}
                    event={popoverEvent as any}
                    onDidDismiss={() => setPopoverEvent(null)}
                >
                    <IonList>
                        <IonItem button onClick={() => {
                            setPopoverEvent(null);
                            history.push(`/horarios/${arrival.linea}`);
                        }}>
                            <IonIcon icon={timerOutline} className="ion-margin-end" />{t('Ver horarios')}
                        </IonItem>

                    </IonList>
                </IonPopover>


                {/* Listado de información */}
                <IonList>
                    <IonItem>
                        <IonLabel>{t('Primero')}:</IonLabel>
                        <IonBadge color={arrival.e1Minutos < 3 ? 'danger' : 'success'}>
                            {arrival.e1Minutos} min ({arrival.e1Hora})
                        </IonBadge>
                    </IonItem>
                    {arrival.e2Minutos && (
                        <>
                            <IonItem>
                                <IonLabel>{t('Segundo')}:</IonLabel>
                                <IonBadge color="secondary">
                                    {arrival.e2Minutos} min ({arrival.e2Hora})
                                </IonBadge>
                            </IonItem>
                            <IonItem>
                                <IonLabel>{t('Frecuencia aproximada')}:</IonLabel>
                                <IonBadge color="secondary">
                                    {arrival.e2Minutos - arrival.e1Minutos} min
                                </IonBadge>
                            </IonItem>
                        </>
                    )}
                </IonList>
            </IonCardContent>
        </IonCard>
    );
};

export default BusCard;
