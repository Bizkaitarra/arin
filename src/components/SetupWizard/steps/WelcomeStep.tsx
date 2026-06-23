import React from 'react';
import { IonButton, IonSelect, IonSelectOption } from '@ionic/react';
import { useTranslation } from 'react-i18next';
import WizardStepLayout from '../WizardStepLayout';

interface WelcomeStepProps {
  onNext: () => void;
  onSkip?: () => void;
}

const WelcomeStep: React.FC<WelcomeStepProps> = ({ onNext, onSkip }) => {
  const { t, i18n } = useTranslation();

  return (
    <WizardStepLayout
      title={t('guided_setup.welcome.title')}
      onNext={onNext}
      onSkip={onSkip}
      nextLabel={t('Comenzar')}
      hideButtons={false}
    >
      <p className="wizard-description">{t('guided_setup.welcome.description')}</p>

      <div style={{ marginBottom: '32px', textAlign: 'left' }}>
        <IonSelect
          value={i18n.language}
          onIonChange={(e) => i18n.changeLanguage(e.detail.value)}
          interface="popover"
          fill="outline"
          label={t('Idioma')}
          labelPlacement="floating"
        >
          <IonSelectOption value="en">English</IonSelectOption>
          <IonSelectOption value="es">Español</IonSelectOption>
          <IonSelectOption value="eu">Euskara</IonSelectOption>
          <IonSelectOption value="fr">Français</IonSelectOption>
        </IonSelect>
      </div>
    </WizardStepLayout>
  );
};

export default WelcomeStep;
