import React from 'react';
import {IonButton, IonIcon, IonText} from '@ionic/react';
import StopsDisplay from '../../components/Bizkaibus/StopsDisplay';
import {busOutline, settingsOutline} from 'ionicons/icons';
import {useHistory} from 'react-router-dom';
import {getSavedStationIds} from '../../services/BizkaibusStorage';
import Page from "../Page";

const BizkaibusViewers: React.FC = () => {
    const history = useHistory();

    return (
        <Page title="Visores Bizkaibus" icon={busOutline}>
                {getSavedStationIds().length > 0 ? (
                    <StopsDisplay/>
                ) : (
                    <div style={{ textAlign: 'center', marginTop: '2rem' }}>
                        <IonText>
                            <h2>No tienes paradas favoritas configuradas</h2>
                            <p>Para poder ver tus paradas favoritas, debes configurarlas en la página de configuración.</p>
                        </IonText>
                        <IonButton color="secondary" onClick={() => history.push(`/configure-bizkaibus`)}>
                            <IonIcon icon={settingsOutline} /> Configurar paradas
                        </IonButton>
                    </div>
                )}
        </Page>
    );
};

export default BizkaibusViewers;
