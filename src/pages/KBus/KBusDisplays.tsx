import React from 'react';
import {IonText} from '@ionic/react';
import {busOutline} from 'ionicons/icons';
import {getSavedStationIds} from '../../services/BizkaibusStorage';
import Page from "../Page";
import {useTranslation} from "react-i18next";
import KBusAddButton from "../../components/KBus/KBusAddButton/KBusAddButton";
import StopsDisplay from "../../components/KBus/StopsDisplay/StopsDisplay";

const KBusDisplays: React.FC = () => {
    const {t} = useTranslation();

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
                        <KBusAddButton/>
                    </div>
                )}
        </Page>
    );
};

export default KBusDisplays;
