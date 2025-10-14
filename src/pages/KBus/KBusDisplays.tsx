import React from 'react';
import {IonText} from '@ionic/react';
import {mapOutline} from 'ionicons/icons';
import Page from "../Page";
import {useTranslation} from "react-i18next";
import StopsDisplay from "../../components/KBus/StopsDisplay/StopsDisplay";
import {KBusStorage} from "../../services/KBus/KBusStorage";
import KBusAddButton from "../../components/KBus/KBusAddButton/KBusAddButton";

const KBusDisplays: React.FC = () => {
    const {t} = useTranslation();
    const storage = new KBusStorage();
    return (
        <Page title={t("Visores")} icon={mapOutline}>
                {storage.getSavedStationIds().length > 0 ? (
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