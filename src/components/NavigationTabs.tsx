import { IonTabBar, IonTabButton, IonIcon, IonLabel } from '@ionic/react';
import { busOutline, settingsOutline, trainOutline } from 'ionicons/icons';

const NavigationTabs: React.FC = () => {
    return (
        <IonTabBar>
            <IonTabButton tab="bizkaibus-viewers" href="/bizkaibus-viewers">
                <IonIcon icon={busOutline} />
                <IonLabel>Bizkaibus</IonLabel>
            </IonTabButton>

            <IonTabButton tab="metro-bilbao-viewers" href="/metro-bilbao-viewers">
                <IonIcon icon={trainOutline} />
                <IonLabel>Metro Bilbao</IonLabel>
            </IonTabButton>
        </IonTabBar>
    );
};

export default NavigationTabs;
