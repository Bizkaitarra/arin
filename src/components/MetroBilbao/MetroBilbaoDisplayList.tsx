import React from 'react';
import { IonButton, IonIcon, IonItem, IonLabel, IonList, IonReorder, IonReorderGroup } from '@ionic/react';
import { reorderThreeOutline, trashBinOutline } from 'ionicons/icons';
import { ItemReorderEventDetail } from '@ionic/core';
import { Display } from '../../services/MetroBilbao/Display';
import { useTranslation } from 'react-i18next';

interface MetroBilbaoDisplayListProps {
    displays: Display[];
    onRemove: (display: Display) => void;
    onReorder: (event: CustomEvent<ItemReorderEventDetail>) => void;
}

const MetroBilbaoDisplayList: React.FC<MetroBilbaoDisplayListProps> = ({ displays, onRemove, onReorder }) => {
    const { t } = useTranslation();

    if (displays.length === 0) {
        return null;
    }

    return (
        <IonList>
            <IonReorderGroup disabled={false} onIonItemReorder={onReorder}>
                {displays.map((display) => (
                    <IonItem key={display.origin.Code}>
                        <IonLabel>
                            <h3>
                                {display.origin.Name}
                                {display.destination && ` → ${display.destination.Name}`}
                            </h3>
                            <p>{display.origin.Lines.join(',')}</p>
                        </IonLabel>
                        <IonButton
                            size="large"
                            fill="clear"
                            slot="end"
                            color="danger"
                            onClick={() => onRemove(display)}
                        >
                            <IonIcon icon={trashBinOutline} />
                        </IonButton>
                        <IonReorder slot="start">
                            <IonIcon size="large" icon={reorderThreeOutline} />
                        </IonReorder>
                    </IonItem>
                ))}
            </IonReorderGroup>
        </IonList>
    );
};

export default MetroBilbaoDisplayList;
