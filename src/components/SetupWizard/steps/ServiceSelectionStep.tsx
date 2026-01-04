import React from 'react';
import { IonButton, IonCheckbox, IonLabel, IonItem } from '@ionic/react';
import { useTranslation } from 'react-i18next';
import WizardStepLayout from '../WizardStepLayout';

interface ServiceSelectionStepProps {
    selectedServices: string[];
    onServiceToggle: (service: string, checked: boolean) => void;
    onNext: () => void;
    onBack: () => void;
    onSkip?: () => void;
}

const ServiceSelectionStep: React.FC<ServiceSelectionStepProps> = ({
    selectedServices,
    onServiceToggle,
    onNext,
    onBack,
    onSkip
}) => {
    const { t } = useTranslation();

    const services = [
        { id: 'bizkaibus', label: 'Bizkaibus' },
        { id: 'metro', label: 'Metro Bilbao' },
        { id: 'euskotren', label: 'Euskotren' },
        { id: 'renfe', label: 'Renfe' },
        { id: 'kbus', label: 'KBus' },
    ];

    return (
        <WizardStepLayout
            title={t('guided_setup.services.title')}
            onNext={onNext}
            onBack={onBack}
            onSkip={onSkip}
        >
            <p className="wizard-description">{t('guided_setup.services.description')}</p>

            <div style={{ marginBottom: '32px', textAlign: 'left', maxHeight: '300px', overflowY: 'auto' }}>
                {services.map((service) => (
                    <div
                        key={service.id}
                        className={`service-option ${selectedServices.includes(service.id) ? 'selected' : ''}`}
                        onClick={() => onServiceToggle(service.id, !selectedServices.includes(service.id))}
                    >
                        <IonLabel style={{ fontWeight: 500 }}>{service.label}</IonLabel>
                        <IonCheckbox
                            checked={selectedServices.includes(service.id)}
                            onIonChange={(e) => onServiceToggle(service.id, e.detail.checked)}
                            style={{ pointerEvents: 'none' }} // Let the parent div handle the click
                        />
                    </div>
                ))}
            </div>
        </WizardStepLayout>
    );
};

export default ServiceSelectionStep;
