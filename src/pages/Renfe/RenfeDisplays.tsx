import React from 'react';
import {IonText} from '@ionic/react';
import {trainOutline} from 'ionicons/icons';
import Page from "../Page";
import {useTranslation} from "react-i18next";
import StopsDisplay from "../../components/Renfe/StopsDisplay/StopsDisplay";
import {RenfeStorage} from "../../services/Renfe/RenfeStorage";
import RenfeAddButton from "../../components/Renfe/RenfeAddButton/RenfeAddButton";

const RenfeDisplays: React.FC = () => {
    const {t} = useTranslation();
    const storage = new RenfeStorage();

    return (
        <Page title={t("Visores")} icon={trainOutline}>
                {storage.getSavedStationIds().length > 0 ? (
                    <StopsDisplay/>
                ) : (
                    <div style={{ textAlign: 'center', marginTop: '2rem' }}>
                        <IonText>
                            <h2>{t('No tienes visores favoritos configurados')}</h2>
                            <p>{t('Para poder ver tus visores favoritos, debes configurarlos en la página de configuración')}.</p>
                        </IonText>
                        <RenfeAddButton/>
                    </div>
                )}
        </Page>
    );
};

export default RenfeDisplays;