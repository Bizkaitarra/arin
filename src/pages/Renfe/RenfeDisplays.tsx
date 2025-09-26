import React from 'react';
import {IonFab, IonFabButton, IonIcon, IonText, useIonActionSheet} from '@ionic/react';
import {addCircleOutline, trainOutline, chevronUpSharp, listOutline} from 'ionicons/icons';
import Page from "../Page";
import {useTranslation} from "react-i18next";
import StopsDisplay from "../../components/Renfe/StopsDisplay/StopsDisplay";
import {RenfeStorage} from "../../services/Renfe/RenfeStorage";
import RenfeAddButton from "../../components/Renfe/RenfeAddButton/RenfeAddButton";
import {useHistory} from "react-router-dom";

const RenfeDisplays: React.FC = () => {
    const {t} = useTranslation();
    const storage = new RenfeStorage();
    const history = useHistory();
    const [presentActionSheet] = useIonActionSheet();

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
            <IonFab slot="fixed" vertical="bottom" horizontal="end">
                <IonFabButton color="medium" onClick={() =>
                    presentActionSheet({
                        header: 'Opciones',
                        buttons: [
                            {
                                text: 'Añadir visor',
                                icon: addCircleOutline,
                                handler: () => history.push('/renfe-add-route'),
                            },
                            {
                                text: 'Mis visores',
                                icon: listOutline,
                                handler: () => history.push('/renfe-my-displays'),
                            },
                        ],
                    })
                }>
                    <IonIcon icon={chevronUpSharp}></IonIcon>
                </IonFabButton>
            </IonFab>
        </Page>
    );
};

export default RenfeDisplays;
