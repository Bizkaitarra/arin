import React from 'react';
import { IonButton, IonIcon } from '@ionic/react';
import { useTranslation } from 'react-i18next';
import { eyeOutline } from 'ionicons/icons';
import WizardStepLayout from '../WizardStepLayout';

interface VisorsExplanationStepProps {
    onNext: () => void;
    onBack: () => void;
    onSkip?: () => void;
}

const VisorsExplanationStep: React.FC<VisorsExplanationStepProps> = ({ onNext, onBack, onSkip }) => {
    const { t } = useTranslation();

    return (
        <WizardStepLayout
            title={t('¿Qué son los Visores?')}
            onNext={onNext}
            onBack={onBack}
            onSkip={onSkip}
        >
            <div style={{ textAlign: 'left', marginBottom: '32px' }}>
                <p className="wizard-description" style={{ marginBottom: '24px' }}>
                    {t('La aplicación permite definir "Visores" para cada servicio. Un visor es la forma en que visualizas la información de transporte.')}
                </p>

                <div style={{ background: 'var(--ion-color-step-50)', padding: '16px', borderRadius: '16px', marginBottom: '16px' }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '8px', color: 'var(--ion-color-primary)' }}>
                        {t('Parada')}
                    </h3>
                    <p style={{ fontSize: '0.95rem', color: 'var(--ion-color-step-700)', margin: 0 }}>
                        {t('Muestra los siguientes trenes o autobuses que pasarán por esa parada.')}
                    </p>
                </div>

                <div style={{ background: 'var(--ion-color-step-50)', padding: '16px', borderRadius: '16px', marginBottom: '16px' }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '8px', color: 'var(--ion-color-primary)' }}>
                        {t('Viaje')}
                    </h3>
                    <p style={{ fontSize: '0.95rem', color: 'var(--ion-color-step-700)', margin: 0 }}>
                        {t('Muestra las próximas idas y vueltas entre dos puntos específicos.')}
                    </p>
                </div>

                <p className="wizard-description" style={{ fontSize: '0.9rem', fontStyle: 'italic', marginTop: '24px' }}>
                    {t('Nota: Algunos servicios solo permiten uno de estos tipos.')}
                </p>
            </div>
        </WizardStepLayout>
    );
};

export default VisorsExplanationStep;
