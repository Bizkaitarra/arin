import {IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonItem, IonLabel, IonList, IonNote, IonSelect, IonSelectOption, IonToggle} from "@ionic/react";
import LanguageSwitcher from "../components/LanguageSwitcher";
import {settingsOutline} from "ionicons/icons";
import Page from "./Page";
import {useTranslation} from "react-i18next";
import {useConfiguration} from "../context/ConfigurationContext";
import {getSelectedVisores, TRANSPORTES} from "../services/Atajos";

const Configuration: React.FC = () => {
    const { t, i18n } = useTranslation();
    const { settings, updateSettings } = useConfiguration();

    const handleSettingChange = (name: string, value: any) => {
        updateSettings({ [name]: value });
    };

    return (
        <Page title={t("Configuración")} internalPage={true}>
            <IonList>
                <IonCard>
                    <IonCardHeader>
                        <IonCardTitle>{t('General')}</IonCardTitle>
                    </IonCardHeader>
                    <IonCardContent>
                        <IonItem>
                            <LanguageSwitcher language={settings.language} onLanguageChange={(lang) => handleSettingChange('language', lang)} />
                        </IonItem>
                        <IonItem>
                            <IonLabel>{t('Tasa de refresco')}</IonLabel>
                            <IonSelect name="refreshRate" value={settings.refreshRate} onIonChange={(e) => handleSettingChange('refreshRate', e.detail.value)}>
                                <IonSelectOption value={"Cada minuto"}>{t('Cada minuto')}</IonSelectOption>
                                <IonSelectOption value={"Cada 2 minutos"}>{t('Cada 2 minutos')}</IonSelectOption>
                                <IonSelectOption value={"Nunca"}>{t('Nunca')}</IonSelectOption>
                            </IonSelect>
                        </IonItem>
                    </IonCardContent>
                </IonCard>

                <IonCard>
                    <IonCardHeader>
                        <IonCardTitle>{t('Atajos')}</IonCardTitle>
                    </IonCardHeader>
                    <IonCardContent>
                        <IonItem>
                            <IonLabel>{t('Atajos en cabecera')}</IonLabel>
                            <IonSelect multiple name="atajos" value={getSelectedVisores(settings)} onIonChange={(e) => handleSettingChange('atajos', e.detail.value)}>
                                {TRANSPORTES.map(t => (
                                    <IonSelectOption key={t.id} value={t.id}>
                                        {t.label}
                                    </IonSelectOption>
                                ))}
                            </IonSelect>
                        </IonItem>
                        <IonNote className='ion-padding-start'>{t('Indica qué atajos quieres mostrar en la cabecera.')}</IonNote>
                    </IonCardContent>
                </IonCard>

                <IonCard>
                    <IonCardHeader>
                        <IonCardTitle>{t('Metro Bilbao')}</IonCardTitle>
                    </IonCardHeader>
                    <IonCardContent>
                        <IonItem>
                            <IonLabel>{t('Ver número de vagones')}</IonLabel>
                            <IonToggle name="verNumeroVagones" checked={settings.verNumeroVagones} onIonChange={(e) => handleSettingChange('verNumeroVagones', e.detail.checked)} />
                        </IonItem>
                        <IonItem>
                            <IonLabel>{t('Mostrar metros hasta')}</IonLabel>
                            <IonSelect name="maxTrenes" value={settings.maxTrenes} onIonChange={(e) => handleSettingChange('maxTrenes', parseInt(e.detail.value, 10))}>
                                <IonSelectOption value={15}>15 {t('minutos')}</IonSelectOption>
                                <IonSelectOption value={30}>30 {t('minutos')}</IonSelectOption>
                                <IonSelectOption value={45}>45 {t('minutos')}</IonSelectOption>
                                <IonSelectOption value={60}>60 {t('minutos')}</IonSelectOption>
                            </IonSelect>
                        </IonItem>
                        <IonItem>
                            <IonLabel>{t('Plegado de visores')}</IonLabel>
                            <IonSelect name="metroDisplayFolding" value={settings.metroDisplayFolding} onIonChange={(e) => handleSettingChange('metroDisplayFolding', e.detail.value)}>
                                <IonSelectOption value={"disabled"}>{t('Desactivado')}</IonSelectOption>
                                <IonSelectOption value={"collapsed"}>{t('Plegados')}</IonSelectOption>
                                <IonSelectOption value={"not-collapsed"}>{t('Desplegados')}</IonSelectOption>
                            </IonSelect>
                        </IonItem>
                    </IonCardContent>
                </IonCard>

                <IonCard>
                    <IonCardHeader>
                        <IonCardTitle>{t('Bizkaibus')}</IonCardTitle>
                    </IonCardHeader>
                    <IonCardContent>
                        <IonItem>
                            <IonLabel>{t('Ver frecuencia')}</IonLabel>
                            <IonToggle name="verFrecuencia" checked={settings.verFrecuencia} onIonChange={(e) => handleSettingChange('verFrecuencia', e.detail.checked)} />
                        </IonItem>
                        <IonNote className='ion-padding-start'>{t('Muestra la diferencia de tiempo entre los dos próximos autobuses.')}</IonNote>
                    </IonCardContent>
                </IonCard>
            </IonList>
        </Page>
    );
};

export default Configuration;
