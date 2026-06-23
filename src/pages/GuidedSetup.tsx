import React from 'react';
import { IonContent, IonPage } from '@ionic/react';
import SetupWizard from '../components/SetupWizard/SetupWizard';

const GuidedSetup: React.FC = () => {
  return (
    <IonPage>
      <IonContent fullscreen>
        <SetupWizard />
      </IonContent>
    </IonPage>
  );
};

export default GuidedSetup;