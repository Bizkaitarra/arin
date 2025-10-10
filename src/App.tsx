import {Redirect, Route} from 'react-router-dom';
import {IonApp, IonRouterOutlet, IonSpinner, IonTabs, setupIonicReact} from '@ionic/react';
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

import BizkaibusDisplays from "./pages/Bizkaibus/BizkaibusDisplays";
import BizkaibusAddByTown from "./pages/Bizkaibus/BizkaibusAddByTown";
import MetroBilbaoDisplays from "./pages/MetroBilbao/MetroBilbaoDisplays";
import MetroBilbaoAddStop from "./pages/MetroBilbao/MetroBilbaoAddStop";
import BizkaibusHorarioPage from "./pages/Bizkaibus/BizkaibusHorarioPage";
import React, {useEffect, useState} from "react";
import {StatusBar} from "@capacitor/status-bar";
import {Capacitor} from "@capacitor/core";
import BizkaibusMyDisplays from "./pages/Bizkaibus/BizkaibusMyDisplays";
import MetroBilbaoMyDisplays from "./pages/MetroBilbao/MetroBilbaoMyDisplays";
import AboutTheApp from "./pages/AboutTheApp";
import Configuration from "./pages/Configuration";
import {useTranslation} from "react-i18next";
import {loadSettings} from "./services/ConfigurationStorage";

// Importar el ConfigurationProvider
import { ConfigurationProvider } from './context/ConfigurationContext';
import BizkaibusAddByLocalization from "./pages/Bizkaibus/BizkaibusAddByLocalization";
import MetroBilbaoAddRoute from "./pages/MetroBilbao/MetroBilbaoAddRoute";
import MetroBilbaoTripPlanner from "./pages/MetroBilbao/MetroBilbaoTripPlanner";
import BizkaibusRoutes from "./pages/Bizkaibus/BizkaibusRoutes";
import RouteItineraries from "./pages/Bizkaibus/RouteItineraries";
import SearchLines from "./pages/Bizkaibus/SearchLines";
import KBusMyDisplays from "./pages/KBus/KBusMyDisplays";
import KBusAddStop from "./pages/KBus/KBusAddStop";
import KBusDisplays from "./pages/KBus/KBusDisplays";
import RenfeDisplays from "./pages/Renfe/RenfeDisplays";
import RenfeMyDisplays from "./pages/Renfe/RenfeMyDisplays";
import RenfeAddStop from "./pages/Renfe/RenfeAddStop";
import RenfeAddRoute from "./pages/Renfe/RenfeAddRoute";

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

    if (!isLanguageLoaded) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <IonSpinner />
            </div>
        );
    }

    return (
        <IonApp>
            {/* Envolver la aplicación en el ConfigurationProvider */}
            <ConfigurationProvider>
                <IonReactRouter>
                    <IonTabs>
                        <IonRouterOutlet>
                            <Route exact path="/bizkaibus-viewers" component={BizkaibusDisplays} />
                            <Route exact path="/bizkaibus-add-stop-by-town" component={BizkaibusAddByTown} />
                            <Route exact path="/bizkaibus-add-stop-by-location" component={BizkaibusAddByLocalization} />
                            <Route exact path="/bizkaibus-my-displays" component={BizkaibusMyDisplays} />
                            <Route exact path="/metro-bilbao-displays" component={MetroBilbaoDisplays} />
                            <Route exact path="/metro-bilbao-add-stop" component={MetroBilbaoAddStop} />
                            <Route exact path="/metro-bilbao-add-route" component={MetroBilbaoAddRoute} />
                            <Route exact path="/metro-bilbao-trip-planner" component={MetroBilbaoTripPlanner} />
                            <Route exact path="/metro-bilbao-my-displays" component={MetroBilbaoMyDisplays} />
                            <Route exact path="/k-bus-displays" component={KBusDisplays} />
                            <Route exact path="/k-bus-my-displays" component={KBusMyDisplays} />
                            <Route exact path="/k-bus-add-stop" component={KBusAddStop} />
                            <Route exact path="/renfe-displays" component={RenfeDisplays} />
                            <Route exact path="/renfe-my-displays" component={RenfeMyDisplays} />
                            <Route exact path="/renfe-add-stop" component={RenfeAddStop} />
                            <Route exact path="/renfe-add-route" component={RenfeAddRoute} />
                            <Route exact path="/about-app" component={AboutTheApp} />
                            <Route exact path="/configuration" component={Configuration} />
                            <Route exact path="/" render={() => <Redirect to="/bizkaibus-viewers" />} />
                            <Route path="/scheduled/:line/:route" component={BizkaibusHorarioPage} />
                            <Route path="/itinerary/:line/:route" component={RouteItineraries} />
                            <Route path="/routes/:line" component={BizkaibusRoutes} />
                            <Route path="/bizkaibus-search-lines" component={SearchLines} />
                        </IonRouterOutlet>
                    </IonTabs>
                </IonReactRouter>
            </ConfigurationProvider>
        </IonApp>
    );
};

export default App;
