import React from 'react';
import { IonItem, IonLabel, IonList, IonButton, IonIcon } from '@ionic/react';
import { trashOutline } from 'ionicons/icons';
import { useTranslation } from 'react-i18next';

interface RenfeDisplayListProps {
    routes: { routeId: string; routeName: string }[];
    onRemove: (routeId: string) => void;
}

const RenfeDisplayList: React.FC<RenfeDisplayListProps> = ({ routes, onRemove }) => {
    const { t } = useTranslation();

    return (
        <IonList className="wizard-display-list">
            {routes.map((route) => (
                <IonItem key={route.routeId} lines="full">
                    <IonLabel className="ion-text-wrap">
                        <h3 style={{ fontWeight: 600 }}>{route.routeName}</h3>
                    </IonLabel>
                    <IonButton
                        fill="clear"
                        color="danger"
                        slot="end"
                        onClick={() => onRemove(route.routeId)}
                    >
                        <IonIcon icon={trashOutline} />
                    </IonButton>
                </IonItem>
            ))}
        </IonList>
    );
};

export default RenfeDisplayList;
