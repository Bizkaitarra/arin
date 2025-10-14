import PayPalDonateButton from "../components/PayPalDonateButton";
import {informationCircle} from "ionicons/icons";
import Page from "./Page";
import {useTranslation} from "react-i18next";

const AboutTheApp: React.FC = () => {
    const {t} = useTranslation();
    return (
        <Page title={t("Sobre Arin")} icon={informationCircle}>
            <div className="page-container">
                <p>{t('Esta APP ha sido desarrollada de manera personal y sin ánimo de lucro')}.</p>
                <p>{t('La información proporcionada sobre los tiempos y las paradas son obtenidas de los medios de transporte afectados')}</p>
                <h2>{t('Objetivos')}</h2>
                <p>{t('Los objetivos de la APP son los siguientes')}:</p>
                <ul>
                    <li>{t('Fomentar el uso del transporte público')}</li>
                    <li>{t('Facilitar acceder a los visores ocultando la configuración de paradas favoritas. Esto permite que una persona poco habil con el movil pueda disfrutar de la APP cuando se la configure su amigo/a o familiar')}.</li>
                </ul>
                <h2>{t('¿Por qué no puedo gestionar las paradas en el visor?')}</h2>
                <p>{t('La configuración de los visores se "oculta" en el menú para separar configuración de "día a día"')}.</p>
                <p>{t('De esta manera le podrás decir a tu familiar o amigo poco amigo de los móviles: sin problema, te configuro la app y tú solo tienes que iniciarla')}</p>
                <h2>{t('Ayuda al autor')}</h2>
                <p>{t('Si te gusta la app y quieres apoyar mi trabajo, puedes hacer una donación a través de PayPal')}</p>
                <PayPalDonateButton/>

            </div>
        </Page>
    );
};

export default AboutTheApp;
