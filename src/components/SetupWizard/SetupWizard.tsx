import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useConfiguration } from '../../context/ConfigurationContext';
import { useIonViewWillEnter } from '@ionic/react';
import './SetupWizard.css';
import WelcomeStep from './steps/WelcomeStep';
import GlobalConfigStep from './steps/GlobalConfigStep';
import VisorsExplanationStep from './steps/VisorsExplanationStep';
import MenuVisorsStep from './steps/MenuVisorsStep';
import MenuAddOptionsStep from './steps/MenuAddOptionsStep';
import ConfigExplanationStep from './steps/ConfigExplanationStep';
import ServiceSelectionStep from './steps/ServiceSelectionStep';
import ServiceConfigStep from './steps/ServiceConfigStep';
import CompletionStep from './steps/CompletionStep';

const SetupWizard: React.FC = () => {
    const history = useHistory();
    const { settings, updateSettings } = useConfiguration();
    const [step, setStep] = useState(0);
    const [selectedServices, setSelectedServices] = useState<string[]>([]);

    useIonViewWillEnter(() => {
        setStep(0);
    });

    // Initialize selected services from settings if available
    useEffect(() => {
        if (settings.atajos && settings.atajos.length > 0) {
            // Ensure atajos is treated as string[]
            const currentServices = Array.isArray(settings.atajos) ? settings.atajos : [settings.atajos];
            setSelectedServices(currentServices);
        }
    }, [settings.atajos]);

    const handleServiceToggle = (service: string, checked: boolean) => {
        let newServices;
        if (checked) {
            newServices = [...selectedServices, service];
        } else {
            newServices = selectedServices.filter(s => s !== service);
        }
        setSelectedServices(newServices);
        // Update global settings immediately so they persist
        updateSettings({ atajos: newServices });
    };

    interface WizardStepConfig {
        component: React.FC<any>;
        key: string;
        props?: Record<string, any>;
    }

    const steps: WizardStepConfig[] = [
        { component: WelcomeStep, key: 'welcome' },
        { component: GlobalConfigStep, key: 'global-config' },
        { component: VisorsExplanationStep, key: 'visors-explanation' },
        { component: MenuVisorsStep, key: 'menu-visors' },
        { component: MenuAddOptionsStep, key: 'menu-add-options' },
        { component: ConfigExplanationStep, key: 'config-explanation' },
        { component: ServiceSelectionStep, key: 'service-selection' },
        // Dynamic steps for each selected service
        ...selectedServices.flatMap(service => {
            if (service === 'metro') {
                return [
                    {
                        component: ServiceConfigStep,
                        key: `service-${service}-config`,
                        props: { service, stepType: 'config' }
                    },
                    {
                        component: ServiceConfigStep,
                        key: `service-${service}-visors`,
                        props: { service, stepType: 'visors' }
                    }
                ];
            }
            return [{
                component: ServiceConfigStep,
                key: `service-${service}`,
                props: { service, stepType: 'full' }
            }];
        }),
        { component: CompletionStep, key: 'completion' }
    ];

    const currentStepConfig = steps[step];
    const CurrentStepComponent = currentStepConfig.component;

    const handleNext = () => {
        if (step < steps.length - 1) {
            setStep(step + 1);
        }
    };

    const handleBack = () => {
        if (step > 0) {
            setStep(step - 1);
        }
    };

    const handleFinish = () => {
        localStorage.setItem('hasSeenGuidedSetup', 'true');

        const serviceRoutes: Record<string, string> = {
            'bizkaibus': '/bizkaibus-displays',
            'metro': '/metro-bilbao-displays',
            'euskotren': '/euskotren-displays',
            'renfe': '/renfe-displays',
            'kbus': '/k-bus-displays'
        };

        if (selectedServices.length > 0 && serviceRoutes[selectedServices[0]]) {
            history.push(serviceRoutes[selectedServices[0]]);
        } else {
            history.push('/bizkaibus-displays');
        }
    };

    const handleSkip = () => {
        setStep(steps.length - 1);
    };

    return (
        <div className="setup-wizard-container">
            <div className="wizard-card">
                <div className="step-indicator">
                    {steps.map((_, index) => (
                        <div
                            key={index}
                            className={`step-dot ${index === step ? 'active' : ''}`}
                            style={{ opacity: index <= step ? 1 : 0.3 }}
                        />
                    ))}
                </div>

                <CurrentStepComponent
                    onNext={handleNext}
                    onBack={handleBack}
                    onFinish={handleFinish}
                    onSkip={handleSkip}
                    selectedServices={selectedServices}
                    onServiceToggle={handleServiceToggle}
                    {...(currentStepConfig.props || {})}
                />
            </div>
        </div>
    );
};

export default SetupWizard;
