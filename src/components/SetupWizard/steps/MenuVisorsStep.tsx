import React from 'react';
import { IonButton, IonIcon, IonList, IonItem, IonLabel } from '@ionic/react';
import { useTranslation } from 'react-i18next';
import { menuOutline, eyeOutline, listOutline } from 'ionicons/icons';
import WizardStepLayout from '../WizardStepLayout';

interface MenuVisorsStepProps {
    onNext: () => void;
    onBack: () => void;
    onSkip?: () => void;
}

const MenuVisorsStep: React.FC<MenuVisorsStepProps> = ({ onNext, onBack, onSkip }) => {
    const { t } = useTranslation();

    return (
        <WizardStepLayout
            title={t('Menú Lateral')}
            onNext={onNext}
            onBack={onBack}
            onSkip={onSkip}
        >
            <div style={{ textAlign: 'left', marginBottom: '32px' }}>
                <p className="wizard-description" style={{ marginBottom: '24px' }}>
                    {t('En el menú superior izquierdo encontrarás las opciones principales.')}
                </p>

                <IonList lines="none" style={{ background: 'transparent' }}>
                    <IonItem style={{ '--background': 'transparent', '--padding-start': '0', marginBottom: '16px' }}>
                        <IonIcon icon={eyeOutline} slot="start" size="small" color="primary" />
                        <IonLabel className="ion-text-wrap" style={{ fontSize: '0.95rem' }}>
                            <strong>{t('Visores')}</strong>
                            <p style={{ marginTop: '4px', color: 'var(--ion-color-step-600)' }}>
                                {t('Ver los siguientes autobuses, trenes o metros de las rutas o paradas configuradas.')}
                            </p>
                        </IonLabel>
                    </IonItem>
                    <IonItem style={{ '--background': 'transparent', '--padding-start': '0', marginBottom: '16px' }}>
                        <IonIcon icon={listOutline} slot="start" size="small" color="primary" />
                        <IonLabel className="ion-text-wrap" style={{ fontSize: '0.95rem' }}>
                            <strong>{t('Mis visores')}</strong>
                            <p style={{ marginTop: '4px', color: 'var(--ion-color-step-600)' }}>
                                {t('Gestionar, ordenar y eliminar tus visores.')}
                            </p>
                        </IonLabel>
                    </IonItem>
                </IonList>
            </div>
        </WizardStepLayout>
    );
};

export default MenuVisorsStep;
