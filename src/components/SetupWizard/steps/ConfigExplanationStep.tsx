import React from 'react';
import { IonButton, IonIcon } from '@ionic/react';
import { useTranslation } from 'react-i18next';
import { cogOutline } from 'ionicons/icons';
import WizardStepLayout from '../WizardStepLayout';

interface ConfigExplanationStepProps {
    onNext: () => void;
    onBack: () => void;
    onSkip?: () => void;
}

const ConfigExplanationStep: React.FC<ConfigExplanationStepProps> = ({ onNext, onBack, onSkip }) => {
    const { t } = useTranslation();

    return (
        <WizardStepLayout
            title={t('Configuración')}
            onNext={onNext}
            onBack={onBack}
            onSkip={onSkip}
            nextLabel={t('Entendido')}
        >
            <div style={{ textAlign: 'center', marginBottom: '32px', padding: '0 16px' }}>
                <IonIcon icon={cogOutline} style={{ fontSize: '64px', color: 'var(--ion-color-primary)', marginBottom: '24px' }} />

                <p className="wizard-description" style={{ fontSize: '1rem', lineHeight: '1.6' }}>
                    {t('Por último, existe una sección de Configuración general.')}
                </p>

                <p className="wizard-description" style={{ fontSize: '0.95rem', color: 'var(--ion-color-step-600)', marginTop: '16px' }}>
                    {t('En ella podrás revisar y modificar todos los aspectos que configures en este asistente, así como otras preferencias de la aplicación.')}
                </p>
            </div>
        </WizardStepLayout>
    );
};

export default ConfigExplanationStep;
