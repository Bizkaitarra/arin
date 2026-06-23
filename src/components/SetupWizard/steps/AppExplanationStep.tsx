import React from 'react';
import { IonButton, IonIcon, IonList, IonItem, IonLabel } from '@ionic/react';
import { useTranslation } from 'react-i18next';
import { eyeOutline, menuOutline, settingsOutline, listOutline, addCircleOutline } from 'ionicons/icons';

interface AppExplanationStepProps {
    onNext: () => void;
    onBack: () => void;
}

const AppExplanationStep: React.FC<AppExplanationStepProps> = ({ onNext, onBack }) => {
    const { t } = useTranslation();

    return (
        <div className="animate-fade-in">
            <h2 className="wizard-title">{t('¿Cómo funciona Arin?')}</h2>

            <div style={{ textAlign: 'left', marginBottom: '32px' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '12px', color: 'var(--ion-color-primary)' }}>
                    <IonIcon icon={eyeOutline} style={{ verticalAlign: 'middle', marginRight: '8px' }} />
                    {t('Los Visores')}
                </h3>
                <p className="wizard-description" style={{ marginBottom: '16px' }}>
                    {t('La aplicación permite definir "Visores" para cada servicio. Un visor puede ser:')}
                </p>
                <ul style={{ paddingLeft: '20px', marginBottom: '16px', color: 'var(--ion-color-step-600)' }}>
                    <li><strong>{t('Parada')}</strong>: {t('Muestra los siguientes trenes o autobuses que pasarán por esa parada.')}</li>
                    <li><strong>{t('Viaje')}</strong>: {t('Muestra las próximas idas y vueltas entre dos puntos.')}</li>
                </ul>
                <p className="wizard-description" style={{ fontSize: '0.9rem', fontStyle: 'italic' }}>
                    {t('Nota: Algunos servicios solo permiten uno de estos tipos.')}
                </p>

                <h3 style={{ fontSize: '1.1rem', fontWeight: 600, margin: '24px 0 12px', color: 'var(--ion-color-primary)' }}>
                    <IonIcon icon={menuOutline} style={{ verticalAlign: 'middle', marginRight: '8px' }} />
                    {t('Menú Lateral')}
                </h3>
                <p className="wizard-description" style={{ marginBottom: '16px' }}>
                    {t('En el menú superior izquierdo encontrarás las opciones para cada servicio:')}
                </p>
                <IonList lines="none" style={{ background: 'transparent' }}>
                    <IonItem style={{ '--background': 'transparent', '--padding-start': '0' }}>
                        <IonIcon icon={eyeOutline} slot="start" size="small" color="medium" />
                        <IonLabel className="ion-text-wrap" style={{ fontSize: '0.9rem' }}>
                            <strong>{t('Visores')}</strong>: {t('Ver tus rutas o paradas configuradas.')}
                        </IonLabel>
                    </IonItem>
                    <IonItem style={{ '--background': 'transparent', '--padding-start': '0' }}>
                        <IonIcon icon={listOutline} slot="start" size="small" color="medium" />
                        <IonLabel className="ion-text-wrap" style={{ fontSize: '0.9rem' }}>
                            <strong>{t('Mis visores')}</strong>: {t('Gestionar, ordenar y eliminar tus visores.')}
                        </IonLabel>
                    </IonItem>
                    <IonItem style={{ '--background': 'transparent', '--padding-start': '0' }}>
                        <IonIcon icon={addCircleOutline} slot="start" size="small" color="medium" />
                        <IonLabel className="ion-text-wrap" style={{ fontSize: '0.9rem' }}>
                            <strong>{t('Añadir')}</strong>: {t('Menús para agregar nuevas paradas o rutas.')}
                        </IonLabel>
                    </IonItem>
                </IonList>

                <div style={{ background: 'var(--ion-color-step-50)', padding: '12px', borderRadius: '12px', marginTop: '16px' }}>
                    <p style={{ fontSize: '0.9rem', margin: 0, display: 'flex', alignItems: 'center' }}>
                        <IonIcon icon={settingsOutline} style={{ marginRight: '8px' }} />
                        {t('En la pantalla de visores, busca el botón de opciones para ajustes específicos del servicio (tarifas, líneas, etc.).')}
                    </p>
                </div>

                <p className="wizard-description" style={{ marginTop: '24px' }}>
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

export default AppExplanationStep;
