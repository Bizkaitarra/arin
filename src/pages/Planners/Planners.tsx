import React from 'react';
import Page from "../Page";
import { useTranslation } from "react-i18next";
import { mapOutline, trainOutline } from "ionicons/icons";
import { IonList, IonItem, IonLabel, IonIcon, IonListHeader } from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { useConfiguration } from '../../context/ConfigurationContext';
import { getSelectedVisores } from "../../services/Atajos";

const Planners: React.FC = () => {
    const { t } = useTranslation();
    const history = useHistory();
    const { settings } = useConfiguration();
    const selectedVisores = getSelectedVisores(settings);

    return (
        <Page title={t("Planificador")} icon={mapOutline}>
            <IonList lines="full">
                <IonListHeader>
                    <IonLabel color="primary">{t('Planifica tu ruta')}</IonLabel>
                </IonListHeader>
                
                {selectedVisores.includes('metro') && (
                    <IonItem button onClick={() => history.push('/metro-bilbao-trip-planner')}>
                        <IonIcon slot="start" icon={trainOutline} color="medium"/>
                        <IonLabel>{t('Metro Bilbao')}</IonLabel>
                    </IonItem>
                )}
                {selectedVisores.includes('renfe') && (
                    <IonItem button onClick={() => history.push('/renfe-trip-planner')}>
                        <IonIcon slot="start" icon={trainOutline} color="medium"/>
                        <IonLabel>{t('Renfe Cercanías')}</IonLabel>
                    </IonItem>
                )}
                {selectedVisores.includes('euskotren') && (
                    <IonItem button onClick={() => history.push('/euskotren-trip-planner')}>
                        <IonIcon slot="start" icon={trainOutline} color="medium"/>
                        <IonLabel>{t('Euskotren')}</IonLabel>
                    </IonItem>
                )}
                
                {!selectedVisores.some(v => ['metro', 'renfe', 'euskotren'].includes(v)) && (
                    <div style={{ textAlign: 'center', marginTop: '2rem', padding: '0 20px' }}>
                        <p>{t('No hay planificadores disponibles para los transportes activos.')}</p>
                    </div>
                )}
            </IonList>
        </Page>
    );
};

export default Planners;
