import { useEffect, useState } from "react";
import { IonInput, IonItem, IonLabel, IonSelect, IonSelectOption, IonToggle } from "@ionic/react";
import LanguageSwitcher from "../components/LanguageSwitcher";
import { trainOutline } from "ionicons/icons";
import Page from "./Page";
import { useTranslation } from "react-i18next";
import { useConfiguration } from "../context/ConfigurationContext";

const Configuration: React.FC = () => {
    const { t, i18n } = useTranslation();
    const { settings, updateSettings } = useConfiguration(); // Usamos el hook del contexto

    const [isSettingsModified, setIsSettingsModified] = useState(false); // Indicador de si los valores se han modificado

    // Elimina la carga desde storage, ya no es necesario

    // Guardar configuraciones solo cuando haya cambios
    useEffect(() => {
        console.log('comprobar si guardar');
        if (isSettingsModified) {
            console.log('guardar');
            // Aquí es donde normalmente se guardaría en el storage, pero ya no lo hacemos
            setIsSettingsModified(false); // Reiniciamos el flag de cambios
        }
    }, [settings, isSettingsModified]);

    // Manejo de cambios en los select/input/toggle
    const handleSelectVisoresChange = (e: CustomEvent) => {
        const { value } = e.detail;
        const name = "visores";
        updateSettings({ [name]: value });
        setIsSettingsModified(true); // Marcamos que hubo un cambio
    };

    const handleToggleFrecuenciaChange = (e: CustomEvent) => {
        const { checked } = e.detail; // Los toggles usan "checked"
        const name = "verFrecuencia";
        updateSettings({ [name]: checked });
        setIsSettingsModified(true); // Marcamos que hubo un cambio
    };

    const handleToggleNumeroVagonesChange = (e: CustomEvent) => {
        const { checked } = e.detail; // Los toggles usan "checked"
        const name = "verNumeroVagones";
        updateSettings({ [name]: checked });
        setIsSettingsModified(true); // Marcamos que hubo un cambio
    };

    const handleMaxTrenes = (e: CustomEvent) => {
        const { value } = e.detail;
        const name = "maxTrenes";
        updateSettings({ [name]: parseInt(value) || 60 }); // Actualizamos el estado global
        setIsSettingsModified(true); // Marcamos que hubo un cambio
    };

    const handleLanguageChange = (language: string) => {
        i18n.changeLanguage(language);
        updateSettings({ language });
        setIsSettingsModified(true); // Marcamos que hubo un cambio
    };

    return (
        <Page title={t("Configuración general")} icon={trainOutline}>
            <h2>{t('Configuración general')}</h2>
            <IonItem>
                <LanguageSwitcher language={settings.language} onLanguageChange={handleLanguageChange} />
            </IonItem>
            <IonItem>
                <IonLabel>{t('Visores a mostrar')}</IonLabel>
                <IonSelect name="visores" value={settings.visores} onIonChange={handleSelectVisoresChange}>
                    <IonSelectOption value="bizkaibus_metro">Bizkaibus + Metro Bilbao</IonSelectOption>
                    <IonSelectOption value="bizkaibus">Bizkaibus</IonSelectOption>
                    <IonSelectOption value="metro">Metro Bilbao</IonSelectOption>
                    <IonSelectOption value="ninguno">{t('Ninguno')}</IonSelectOption>
                </IonSelect>
            </IonItem>
            <h4>Metro Bilbao</h4>
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
            <h4>Bizkaibus</h4>
            <p>{t('Indica si quieres ver la diferencia de tiempo entre los autobuses que proporiciona Bizkaibus. Esto puede dar una orientación de cuando puede ser el siguiente que venga ya que Bizkaibus solo proporciona dos autobuses por línea.')}</p>
            <IonItem>
                <IonLabel>{t('Ver frecuencia')}</IonLabel>
                <IonToggle name="verFrecuencia" checked={settings.verFrecuencia} onIonChange={handleToggleFrecuenciaChange} />
            </IonItem>
        </Page>
    );
};

export default Configuration;
