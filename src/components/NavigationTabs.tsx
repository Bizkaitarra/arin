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
            {settings.visores === 'bizkaibus' || settings.visores === 'bizkaibus_metro' || settings.visores === 'bizkaibus_kbus' || settings.visores === 'bizkaibus_metro_kbus' ? (
                <IonTabButton tab="bizkaibus-viewers" href="/bizkaibus-viewers">
                    <span className="subtext">{t('bizkaibus_nav_1')}</span>
                    <IonIcon icon={busOutline} />
                    <IonLabel>{t('bizkaibus_nav_2')}</IonLabel>
                </IonTabButton>
            ) : null}

            {settings.visores === 'metro' || settings.visores === 'bizkaibus_metro' || settings.visores === 'metro_kbus' || settings.visores === 'bizkaibus_metro_kbus' ? (
                <IonTabButton tab="metro-bilbao-displays" href="/metro-bilbao-displays">
                    <span className="subtext">{t('metro_nav_1')}</span>
                    <IonIcon icon={trainOutline} />
                    <IonLabel>{t('metro_nav_2')}</IonLabel>
                </IonTabButton>
            ) : null}

            {settings.visores === 'kbus' || settings.visores === 'bizkaibus_kbus' || settings.visores === 'metro_kbus' || settings.visores === 'bizkaibus_metro_kbus' ? (
                <IonTabButton tab="mkbus-displays" href="/k-bus-displays">
                    <span className="subtext">{t('kbus_nav_1')}</span>
                    <IonIcon icon={busOutline} />
                    <IonLabel>{t('kbus_nav_2')}</IonLabel>
                </IonTabButton>
            ) : null}
        </IonTabBar>
    );
};

export default NavigationTabs;
