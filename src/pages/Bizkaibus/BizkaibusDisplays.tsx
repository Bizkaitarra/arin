import React from 'react';
import {IonButton, IonIcon, IonText} from '@ionic/react';
import StopsDisplay from '../../components/Bizkaibus/StopsDisplay/StopsDisplay';
import {busOutline, settingsOutline} from 'ionicons/icons';
import {useHistory} from 'react-router-dom';
import {getSavedStationIds} from '../../services/BizkaibusStorage';
import Page from "../Page";
import {useTranslation} from "react-i18next";
import BizkaibusAddStopButton from "./BizkaibusAddStopsButton";

const BizkaibusDisplays: React.FC = () => {
    const {t} = useTranslation();
    const history = useHistory();

    return (
        <Page title={t("Visores")} icon={busOutline}>
                {getSavedStationIds().length > 0 ? (
                    <StopsDisplay/>
                ) : (
                    <div style={{ textAlign: 'center', marginTop: '2rem' }}>
                        <IonText>
                            <h2>{t('No tienes visores favoritos configurados')}</h2>
                            <p>{t('Para poder ver tus visores favoritos, debes configurarlos en la página de configuración')}.</p>
                        </IonText>
                        <BizkaibusAddStopButton/>
                    </div>
                )}
        </Page>
    );
};

export default BizkaibusDisplays;
