import React from 'react';
import { IonList, IonItem, IonLabel, IonButton, IonIcon } from '@ionic/react';
import { trashOutline } from 'ionicons/icons';
import { useTranslation } from 'react-i18next';
import { KBusStop } from '../../services/KBus/KbusStop';

interface KBusDisplayListProps {
    stops: KBusStop[];
    onRemove: (stop: KBusStop) => void;
}

const KBusDisplayList: React.FC<KBusDisplayListProps> = ({ stops, onRemove }) => {
    const { t } = useTranslation();

    return (
        <IonList className="wizard-display-list">
            {stops.map((stop) => (
                <IonItem key={stop.id} lines="full">
                    <IonLabel className="ion-text-wrap">
                        <h3 style={{ fontWeight: 600 }}>{stop.name}</h3>
                    </IonLabel>
                    <IonButton
                        fill="clear"
                        color="danger"
                        slot="end"
                        onClick={() => onRemove(stop)}
                    >
                        <IonIcon icon={trashOutline} />
                    </IonButton>
                </IonItem>
            ))}
        </IonList>
    );
};

export default KBusDisplayList;
