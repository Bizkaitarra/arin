import React from "react";
import { IonLabel, IonSelect, IonSelectOption } from "@ionic/react";
import { useTranslation } from "react-i18next";

interface LanguageSwitcherProps {
    language: string;
    onLanguageChange: (language: string) => void;
}

const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ language, onLanguageChange }) => {
    const { t, i18n } = useTranslation();

    const handleLanguageChange = (e: CustomEvent) => {
        const newLanguage = e.detail.value;
        i18n.changeLanguage(newLanguage);
        onLanguageChange(newLanguage);
    };

    return (
        <>
            <IonLabel>{t("Idioma")}</IonLabel>
            <IonSelect value={language} onIonChange={handleLanguageChange}>
                <IonSelectOption value="eu">{t("Euskera")}</IonSelectOption>
                <IonSelectOption value="es">{t("Castellano")}</IonSelectOption>
            </IonSelect>
        </>
    );
};

export default LanguageSwitcher;
