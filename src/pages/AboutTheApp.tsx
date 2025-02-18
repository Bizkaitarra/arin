import PayPalDonateButton from "../components/PayPalDonateButton";
import {informationCircle} from "ionicons/icons";
import Page from "./Page";

const AboutTheApp: React.FC = () => {
    return (
        <Page title="Sobre Arin" icon={informationCircle}>
            <div>
                <h1>Arin</h1>
                <p>Esta APP ha sido desarrollada de manera personal y sin ánimo de lucro.</p>
                <p>La información proporcionada sobre los tiempos y las paradas son obtenidas de los medios de transporte afectados</p>
                <h2>Objetivos</h2>
                <p>Los objetivos de la APP son los siguientes:</p>
                <ul>
                    <li>Fomentar el uso del transporte público</li>
                    <li>Facilitar acceder a los visores ocultando la configuración de paradas favoritas. Esto permite que una persona poco habil con el movil pueda disfrutar de la APP cuando se la configure su amigo/a o familiar.</li>
                </ul>
                <h2>¿Por qué no puedo gestionar las paradas en el visor?</h2>
                <p>La configuración de los visores se "oculta" en el menú para separar configuración de "día a día".</p>
                <p> De esta manera le podrás decir a tu familiar o amigo poco amigo de los móviles: "sin problema, te configuro la app y tú solo tienes que iniciarla"</p>
                <h2>Ayuda al autor</h2>
                <p>Si te gusta la app y quieres apoyar mi trabajo, puedes hacer una donación a través de PayPal</p>
                <PayPalDonateButton/>

            </div>
        </Page>
    );
};

export default AboutTheApp;
