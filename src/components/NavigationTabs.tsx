import { IonTabBar, IonTabButton, IonIcon, IonLabel } from '@ionic/react';
import { busOutline, trainOutline } from 'ionicons/icons';
import { useTranslation } from 'react-i18next';
import { useConfiguration } from '../context/ConfigurationContext';

const NavigationTabs: React.FC = () => {
    const { t } = useTranslation();
    const { settings } = useConfiguration();

    if (settings.visores === 'ninguno') {
        return null;
    }

    return (
        <IonTabBar>
            {settings.visores === 'bizkaibus' || settings.visores === 'bizkaibus_metro' ? (
                <IonTabButton tab="bizkaibus-viewers" href="/bizkaibus-viewers">
                    <span className="subtext">{t('Visor')}</span>
                    <IonIcon icon={busOutline} />
                    <IonLabel>Bizkaibus</IonLabel>
                </IonTabButton>
            ) : null}

            {settings.visores === 'metro' || settings.visores === 'bizkaibus_metro' ? (
                <IonTabButton tab="metro-bilbao-viewers" href="/metro-bilbao-viewers">
                    <span className="subtext">{t('Visor')}</span>
                    <IonIcon icon={trainOutline} />
                    <IonLabel>Metro Bilbao</IonLabel>
                </IonTabButton>
            ) : null}
        </IonTabBar>
    );
};

export default NavigationTabs;
