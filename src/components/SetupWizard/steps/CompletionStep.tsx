import React from 'react';
import { IonButton, IonIcon } from '@ionic/react';
import { useTranslation } from 'react-i18next';
import { checkmarkCircleOutline } from 'ionicons/icons';
import WizardStepLayout from '../WizardStepLayout';

interface CompletionStepProps {
    onFinish: () => void;
}

const CompletionStep: React.FC<CompletionStepProps> = ({ onFinish }) => {
    const { t } = useTranslation();

    return (
        <WizardStepLayout
            title={t('¡Todo listo!')}
            onNext={onFinish}
            nextLabel={t('Comenzar a usar Arin')}
        >
            <div style={{ textAlign: 'center' }}>
                <div style={{ marginBottom: '24px', color: 'var(--ion-color-success)' }}>
                    <IonIcon
                        icon={checkmarkCircleOutline}
                        style={{ fontSize: '80px', color: 'var(--ion-color-success)' }}
                    />
                </div>

                <p className="wizard-description">{t('Has configurado la aplicación correctamente. ¡Disfruta de Arin!')}</p>
            </div>
        </WizardStepLayout>
    );
};

export default CompletionStep;
