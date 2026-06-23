import React from 'react';
import { IonButton, IonIcon, IonList, IonItem, IonLabel } from '@ionic/react';
import { useTranslation } from 'react-i18next';
import { menuOutline, eyeOutline, listOutline, addCircleOutline, settingsOutline } from 'ionicons/icons';

interface MenuExplanationStepProps {
    onNext: () => void;
    onBack: () => void;
}

const MenuExplanationStep: React.FC<MenuExplanationStepProps> = ({ onNext, onBack }) => {
    const { t } = useTranslation();

    return (
        <div className="animate-fade-in">
            <h2 className="wizard-title">{t('Menú Lateral')}</h2>

            <div style={{ textAlign: 'left', marginBottom: '32px' }}>
                <p className="wizard-description" style={{ marginBottom: '24px' }}>
                    {t('En el menú superior izquierdo encontrarás las opciones disponibles para cada servicio:')}
                </p>

                <IonList lines="none" style={{ background: 'transparent' }}>
                    <IonItem style={{ '--background': 'transparent', '--padding-start': '0', marginBottom: '12px' }}>
                        <IonIcon icon={eyeOutline} slot="start" size="small" color="primary" />
                        <IonLabel className="ion-text-wrap" style={{ fontSize: '0.95rem' }}>
                            <strong>{t('Visores')}</strong>
                            <p style={{ marginTop: '4px' }}>{t('Ver los siguientes autobuses, trenes o metros de las rutas o paradas configuradas.')}</p>
                        </IonLabel>
                    </IonItem>
                    <IonItem style={{ '--background': 'transparent', '--padding-start': '0', marginBottom: '12px' }}>
                        <IonIcon icon={listOutline} slot="start" size="small" color="primary" />
                        <IonLabel className="ion-text-wrap" style={{ fontSize: '0.95rem' }}>
                            <strong>{t('Mis visores')}</strong>
                            <p style={{ marginTop: '4px' }}>{t('Gestionar, ordenar y eliminar tus visores.')}</p>
                        </IonLabel>
                    </IonItem>
                    <IonItem style={{ '--background': 'transparent', '--padding-start': '0', marginBottom: '12px' }}>
                        <IonIcon icon={addCircleOutline} slot="start" size="small" color="primary" />
                        <IonLabel className="ion-text-wrap" style={{ fontSize: '0.95rem' }}>
                            <strong>{t('Añadir')}</strong>
                            <p style={{ marginTop: '4px' }}>{t('Menús para agregar nuevas paradas o rutas.')}</p>
                        </IonLabel>
                    </IonItem>
                </IonList>

                <div style={{ background: 'var(--ion-color-step-50)', padding: '12px', borderRadius: '12px', marginTop: '16px' }}>
                    <p style={{ fontSize: '0.9rem', margin: 0, display: 'flex', alignItems: 'start' }}>
                        <IonIcon icon={settingsOutline} style={{ marginRight: '8px', minWidth: '20px', marginTop: '2px' }} />
                        {t('En la pantalla de visores, busca el botón de opciones para ajustes específicos del servicio (tarifas, líneas, etc.).')}
                    </p>
                </div>

                <p className="wizard-description" style={{ marginTop: '24px', fontSize: '0.9rem' }}>
                    {t('Por último, existe una sección de Configuración general para revisar todo lo que configures aquí.')}
                </p>
            </div>

            <div className="wizard-actions">
                <IonButton className="wizard-btn wizard-btn-secondary" fill="clear" onClick={onBack}>
                    {t('Atrás')}
                </IonButton>
                <IonButton className="wizard-btn" onClick={onNext}>
                    {t('Entendido')}
                </IonButton>
            </div>
        </div>
    );
};

export default MenuExplanationStep;
