import React from 'react';
import { IonItem, IonLabel, IonList, IonButton, IonIcon } from '@ionic/react';
import { trashOutline } from 'ionicons/icons';
import { Parada } from '../../services/BizkaibusStorage';
import { useTranslation } from 'react-i18next';

interface BizkaibusDisplayListProps {
    stops: Parada[];
    onRemove: (stop: Parada) => void;
}

const BizkaibusDisplayList: React.FC<BizkaibusDisplayListProps> = ({ stops, onRemove }) => {
    const { t } = useTranslation();

    return (
        <IonList className="wizard-display-list">
            {stops.map((stop) => (
                <IonItem key={stop.PARADA} lines="full">
                    <IonLabel className="ion-text-wrap">
                        <h3 style={{ fontWeight: 600 }}>{stop.CUSTOM_NAME || stop.DENOMINACION}</h3>
                        <p style={{ fontSize: '0.9em', color: 'var(--ion-color-step-600)' }}>
                            {stop.PARADA} - {stop.DESCRIPCION_MUNICIPIO}
                        </p>
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

export default BizkaibusDisplayList;
