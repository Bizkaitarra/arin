import {Redirect, Route} from 'react-router-dom';
import {IonApp, IonRouterOutlet, IonTabs, setupIonicReact} from '@ionic/react';
import {IonReactRouter} from '@ionic/react-router';

import '@ionic/react/css/core.css';
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';
import '@ionic/react/css/palettes/dark.system.css';

import './theme/variables.css';

import BizkaibusViewers from "./pages/Bizkaibus/BizkaibusViewers";
import BizkaibusConfiguration from "./pages/Bizkaibus/BizkaibusConfiguration";
import MetroBilbaoViewers from "./pages/MetroBilbao/MetroBilbaoViewers";
import MetroBilbaoConfiguration from "./pages/MetroBilbao/MetroBilbaoConfiguration";
import BizkaibusHorarioPage from "./pages/Bizkaibus/BizkaibusHorarioPage";
import React, {useEffect, useState} from "react";
import {StatusBar} from "@capacitor/status-bar";
import {Capacitor} from "@capacitor/core";
import BizkaibusStopsManagement from "./pages/Bizkaibus/BizkaibusStopsManagement";
import MetroBilbaoStopsManagement from "./pages/MetroBilbao/MetroBilbaoStopsManagement";
import AboutTheApp from "./pages/AboutTheApp";
import Configuration from "./pages/Configuration";
import {useTranslation} from "react-i18next";
import {loadSettings} from "./services/ConfigurationStorage";

// Importar el ConfigurationProvider
import { ConfigurationProvider } from './context/ConfigurationContext';

setupIonicReact();


const App: React.FC = () => {
    const { i18n } = useTranslation();
    const [isLanguageLoaded, setIsLanguageLoaded] = useState(false); // Estado para evitar re-render innecesario

    // Cargar idioma guardado en configuración
    useEffect(() => {
        const fetchLanguage = async () => {
            const settings = await loadSettings();
            if (settings?.language) {
                await i18n.changeLanguage(settings.language); // Cambiamos el idioma en i18next
            }
            setIsLanguageLoaded(true); // Indicamos que se cargó el idioma
        };

        fetchLanguage();
    }, [i18n]);

    React.useEffect(() => {
        if (Capacitor.isNativePlatform()) {
            StatusBar.setOverlaysWebView({ overlay: false });
            StatusBar.setBackgroundColor({ color: '#ffffff' });
        }
    }, []);

    return (
        <IonApp>
            {/* Envolver la aplicación en el ConfigurationProvider */}
            <ConfigurationProvider>
                <IonReactRouter>
                    <IonTabs>
                        <IonRouterOutlet>
                            <Route exact path="/bizkaibus-viewers" component={BizkaibusViewers} />
                            <Route exact path="/configure-bizkaibus" component={BizkaibusConfiguration} />
                            <Route exact path="/manage-bizkaibus-stops" component={BizkaibusStopsManagement} />
                            <Route exact path="/metro-bilbao-viewers" component={MetroBilbaoViewers} />
                            <Route exact path="/configure-metro-bilbao" component={MetroBilbaoConfiguration} />
                            <Route exact path="/manage-metro-bilbao-stops" component={MetroBilbaoStopsManagement} />
                            <Route exact path="/about-app" component={AboutTheApp} />
                            <Route exact path="/configuration" component={Configuration} />
                            <Route exact path="/" render={() => <Redirect to="/bizkaibus-viewers" />} />
                            <Route path="/horarios/:line" component={BizkaibusHorarioPage} />
                        </IonRouterOutlet>
                    </IonTabs>
                </IonReactRouter>
            </ConfigurationProvider>
        </IonApp>
    );
};

export default App;
