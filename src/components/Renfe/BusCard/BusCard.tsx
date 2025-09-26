import {IonBadge, IonCard, IonCardContent, IonCardTitle, IonItem, IonLabel, IonList} from '@ionic/react';
import React from 'react';
import {useTranslation} from "react-i18next";
import {KBusArrival} from "../../../services/KBus/KBusArrivalResponse";

interface Props {
    arrival: KBusArrival,
    index: number
}
const BusCard: React.FC<Props> = ({ arrival, index }) => {
    const { t } = useTranslation();
    const arrivalInMinutes = Math.floor(arrival.secondsToArrival / 60);
    return (
        <IonCard key={index} className="bus-card">
            <IonCardContent>
                <div className="ion-justify-content-between ion-align-items-center" style={{ display: 'flex' }}>
                    <IonCardTitle>
                        {`${arrival.line}`}
                    </IonCardTitle>
                </div>

                <IonList>
                    <IonItem>
                        <IonLabel>{t('Próximo autobús')}:</IonLabel>
                        <IonBadge color={arrival.secondsToArrival < 180 ? 'danger' : 'success'}>
                            {arrivalInMinutes} min ({arrival.timeToArrival})
                        </IonBadge>
                    </IonItem>
                </IonList>
            </IonCardContent>
        </IonCard>
    );
};

export default BusCard;
