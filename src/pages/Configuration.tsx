import {IonItem, IonLabel, IonSelect, IonSelectOption, IonToggle} from "@ionic/react";
import LanguageSwitcher from "../components/LanguageSwitcher";
import {trainOutline} from "ionicons/icons";
import Page from "./Page";
import {useTranslation} from "react-i18next";
import {useConfiguration} from "../context/ConfigurationContext";

const Configuration: React.FC = () => {
    const { t, i18n } = useTranslation();
    const { settings, updateSettings } = useConfiguration(); // Usamos el hook del contexto


    // Manejo de cambios en los select/input/toggle
    const handleSelectVisoresChange = (e: CustomEvent) => {
        const { value } = e.detail;
        const name = "visores";
        updateSettings({ [name]: value });
    };

    const handleToggleFrecuenciaChange = (e: CustomEvent) => {
        const { checked } = e.detail; // Los toggles usan "checked"
        const name = "verFrecuencia";
        updateSettings({ [name]: checked });
    };

    const handleToggleNumeroVagonesChange = (e: CustomEvent) => {
        const { checked } = e.detail; // Los toggles usan "checked"
        const name = "verNumeroVagones";
        updateSettings({ [name]: checked });
    };

    const handleMaxTrenes = (e: CustomEvent) => {
        const { value } = e.detail;
        const name = "maxTrenes";
        updateSettings({ [name]: parseInt(value) || 60 }); // Actualizamos el estado global
    };

    const handleMetroDisplayFolding = (e: CustomEvent) => {
        const { value } = e.detail;
        const name = "metroDisplayFolding";
        updateSettings({ [name]: value || 'disabled' }); // Actualizamos el estado global
    };

    const handleLanguageChange = (language: string) => {
        i18n.changeLanguage(language);
        updateSettings({ language });
    };

    return (
        <Page title={t("Configuración general")} icon={trainOutline}>
            <IonItem>
                <LanguageSwitcher language={settings.language} onLanguageChange={handleLanguageChange} />
            </IonItem>
            <p>{t('Indica qué atajos quieres mostrar en la cabecera. También puedes elegir que no quieres atajos')}.</p>
            <IonItem>
                <IonLabel>{t('Atajos')}</IonLabel>
                <IonSelect name="visores" value={settings.visores} onIonChange={handleSelectVisoresChange}>
                    <IonSelectOption value="bizkaibus_metro">Bizkaibus + Metro Bilbao</IonSelectOption>
                    <IonSelectOption value="bizkaibus">Bizkaibus</IonSelectOption>
                    <IonSelectOption value="metro">Metro Bilbao</IonSelectOption>
                    <IonSelectOption value="ninguno">{t('Ninguno')}</IonSelectOption>
                </IonSelect>
            </IonItem>
            <hr></hr>
            <strong>Metro Bilbao</strong>
            <p>{t('Indica si deseas ver o no el número de vagones en los resultados del visor')}.</p>
            <IonItem>
                <IonLabel>{t('¿Ver número de vagones?')}</IonLabel>
                <IonToggle name="verNumeroVagones" checked={settings.verNumeroVagones} onIonChange={handleToggleNumeroVagonesChange} />
            </IonItem>
            <p>{t('El número de Metros que pueden ser cargados es elevado. Puedes establecer cual es el máximo tiempo de Metros que saldrán.')}</p>
            <IonItem>
                <IonLabel>{t('Mostrar metros hasta')}</IonLabel>
                <IonSelect name="maxTrenes" value={settings.maxTrenes} onIonChange={handleMaxTrenes}>
                    <IonSelectOption value={15}>15 {t('minutos')}</IonSelectOption>
                    <IonSelectOption value={30}>30 {t('minutos')}</IonSelectOption>
                    <IonSelectOption value={45}>45 {t('minutos')}</IonSelectOption>
                    <IonSelectOption value={60}>60 {t('minutos')}</IonSelectOption>
                </IonSelect>
            </IonItem>
            <p>{t('Indica cómo quieres que se comporte el plegado de visores en Metro Bilbao')}</p>
            <IonItem>
                <IonLabel>{t('Plegado de visores')}</IonLabel>
                <IonSelect okText={t("Confirmar")} cancelText={t("Salir")} name="metroDisplayFolding" value={settings.metroDisplayFolding}  onIonChange={handleMetroDisplayFolding}>
                    <IonSelectOption value={"disabled"}>{t('Desactivado')}</IonSelectOption>
                    <IonSelectOption value={"collapsed"}>{t('Empiezan plegados')}</IonSelectOption>
                    <IonSelectOption value={"not-collapsed"}>{t('Empiezan desplegados')}</IonSelectOption>
                </IonSelect>
            </IonItem>
            <hr></hr>
            <strong>Bizkaibus</strong>
            <p>{t('Indica si quieres ver la diferencia de tiempo entre los autobuses que proporiciona Bizkaibus. Esto puede dar una orientación de cuando puede ser el siguiente que venga ya que Bizkaibus solo proporciona dos autobuses por línea.')}</p>
            <IonItem>
                <IonLabel>{t('Ver frecuencia')}</IonLabel>
                <IonToggle name="verFrecuencia" checked={settings.verFrecuencia} onIonChange={handleToggleFrecuenciaChange} />
            </IonItem>
        </Page>
    );
};

export default Configuration;
