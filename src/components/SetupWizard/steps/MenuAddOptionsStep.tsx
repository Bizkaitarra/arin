import React from 'react';
import { IonButton, IonIcon, IonList, IonItem, IonLabel } from '@ionic/react';
import { useTranslation } from 'react-i18next';
import { addCircleOutline, settingsOutline } from 'ionicons/icons';
import WizardStepLayout from '../WizardStepLayout';

interface MenuAddOptionsStepProps {
    onNext: () => void;
    onBack: () => void;
    onSkip?: () => void;
}

const MenuAddOptionsStep: React.FC<MenuAddOptionsStepProps> = ({ onNext, onBack, onSkip }) => {
    const { t } = useTranslation();

    return (
        <WizardStepLayout
            title={t('Opciones de Añadir')}
            onNext={onNext}
            onBack={onBack}
            onSkip={onSkip}
        >
            <div style={{ textAlign: 'left', marginBottom: '32px' }}>
                <IonList lines="none" style={{ background: 'transparent' }}>
                    <IonItem style={{ '--background': 'transparent', '--padding-start': '0', marginBottom: '24px' }}>
                        <IonIcon icon={addCircleOutline} slot="start" size="small" color="primary" />
                        <IonLabel className="ion-text-wrap" style={{ fontSize: '0.95rem' }}>
                            <strong>{t('Añadir')}</strong>
                            <p style={{ marginTop: '4px', color: 'var(--ion-color-step-600)' }}>
                                {t('Menús para agregar nuevas paradas o rutas.')}
                            </p>
                        </IonLabel>
                    </IonItem>
                </IonList>

                <div style={{ background: 'var(--ion-color-step-50)', padding: '16px', borderRadius: '16px' }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '12px', display: 'flex', alignItems: 'center', color: 'var(--ion-color-primary)' }}>
                        <IonIcon icon={settingsOutline} style={{ marginRight: '8px' }} />
                        {t('Opciones del Servicio')}
                    </h3>
                    <p style={{ fontSize: '0.9rem', color: 'var(--ion-color-step-700)', margin: 0, lineHeight: '1.5' }}>
                        {t('En la pantalla de visores, busca el botón de opciones para acceder a ajustes específicos como tarifas, líneas, planos, etc.')}
                    </p>
                </div>
            </div>
        </WizardStepLayout>
    );
};

export default MenuAddOptionsStep;
