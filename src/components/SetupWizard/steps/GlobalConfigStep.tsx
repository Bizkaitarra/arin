import React from 'react';
import { IonButton, IonSelect, IonSelectOption, IonLabel, IonItem } from '@ionic/react';
import { useTranslation } from 'react-i18next';
import { useConfiguration } from '../../../context/ConfigurationContext';
import WizardStepLayout from '../WizardStepLayout';

interface GlobalConfigStepProps {
    onNext: () => void;
    onBack: () => void;
    onSkip?: () => void;
}

const GlobalConfigStep: React.FC<GlobalConfigStepProps> = ({ onNext, onBack, onSkip }) => {
    const { t } = useTranslation();
    const { settings, updateSettings } = useConfiguration();

    return (
        <WizardStepLayout
            title={t('Configuración General')}
            onNext={onNext}
            onBack={onBack}
            onSkip={onSkip}
        >
            <p className="wizard-description">{t('Ajusta las preferencias básicas de la aplicación.')}</p>

            <div style={{ marginBottom: '32px', textAlign: 'left' }}>
                <IonItem lines="none" className="ion-no-padding" style={{ '--background': 'transparent' }}>
                    <IonLabel position="stacked" style={{ marginBottom: '8px', fontSize: '14px', color: 'var(--ion-color-step-600)' }}>
                        {t('Tasa de refresco')}
                    </IonLabel>
                    <IonSelect
                        value={settings.refreshRate}
                        onIonChange={(e) => updateSettings({ refreshRate: e.detail.value })}
                        interface="popover"
                        fill="outline"
                        style={{ width: '100%' }}
                    >
                        <IonSelectOption value={"Cada minuto"}>{t('Cada minuto')}</IonSelectOption>
                        <IonSelectOption value={"Cada 2 minutos"}>{t('Cada 2 minutos')}</IonSelectOption>
                        <IonSelectOption value={"Nunca"}>{t('Nunca')}</IonSelectOption>
                    </IonSelect>
                </IonItem>
            </div>
        </WizardStepLayout>
    );
};

export default GlobalConfigStep;
