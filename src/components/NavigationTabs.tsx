import { IonTabBar, IonTabButton, IonIcon, IonLabel } from '@ionic/react';
import { busOutline, trainOutline, addOutline } from 'ionicons/icons';
import { useTranslation } from 'react-i18next';
import { useConfiguration } from '../context/ConfigurationContext';
import { getSelectedVisores } from "../services/Atajos";

const NavigationTabs: React.FC = () => {
    const { t } = useTranslation();
    const { settings } = useConfiguration();

    const selectedVisores = getSelectedVisores(settings);

    if (selectedVisores.length === 0) {
        return null;
    }

    const maxVisores = 4;
    const shouldShowAddButton = selectedVisores.length < maxVisores;

    return (
        <IonTabBar>
            {selectedVisores.includes('bizkaibus') && (
                <IonTabButton tab="bizkaibus-viewers" href="/bizkaibus-viewers">
                    <span className="subtext">{t('bizkaibus_nav_1')}</span>
                    <IonIcon icon={busOutline} />
                    <IonLabel>{t('bizkaibus_nav_2')}</IonLabel>
                </IonTabButton>
            )}

            {selectedVisores.includes('metro') && (
                <IonTabButton tab="metro-bilbao-displays" href="/metro-bilbao-displays">
                    <span className="subtext">{t('metro_nav_1')}</span>
                    <IonIcon icon={trainOutline} />
                    <IonLabel>{t('metro_nav_2')}</IonLabel>
                </IonTabButton>
            )}

            {selectedVisores.includes('kbus') && (
                <IonTabButton tab="mkbus-displays" href="/k-bus-displays">
                    <span className="subtext">{t('kbus_nav_1')}</span>
                    <IonIcon icon={busOutline} />
                    <IonLabel>{t('kbus_nav_2')}</IonLabel>
                </IonTabButton>
            )}

            {selectedVisores.includes('renfe') && (
                <IonTabButton tab="renfe-displays" href="/renfe-displays">
                    <span className="subtext">{t('renfe_nav_1')}</span>
                    <IonIcon icon={busOutline} />
                    <IonLabel>{t('renfe_nav_2')}</IonLabel>
                </IonTabButton>
            )}

            {shouldShowAddButton && (
                <IonTabButton tab="add-service" href="/configuration">
                    <span className="subtext">{t('add_service_nav_1', 'Añadir')}</span>
                    <IonIcon icon={addOutline} />
                    <IonLabel>{t('add_service_nav_2', 'Servicio')}</IonLabel>
                </IonTabButton>
            )}
        </IonTabBar>
    );
};

export default NavigationTabs;
