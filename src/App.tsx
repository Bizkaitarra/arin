import { Redirect, Route } from 'react-router-dom';
import { IonApp, IonRouterOutlet, IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { homeOutline, searchOutline, mapOutline, settingsOutline } from 'ionicons/icons';

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

import React, { useEffect, useState } from "react";
import { StatusBar, Style } from "@capacitor/status-bar";
import { Capacitor } from "@capacitor/core";
import { useTranslation } from "react-i18next";
import { loadSettings } from "./services/ConfigurationStorage";

// Context
import { ConfigurationProvider } from './context/ConfigurationContext';

// Main Tabs
import Home from "./pages/Home/Home";
import Explore from "./pages/Explore/Explore";
import Planners from "./pages/Planners/Planners";
import Configuration from "./pages/Configuration";

// Other Pages
import BizkaibusAddByTown from "./pages/Bizkaibus/BizkaibusAddByTown";
import BizkaibusAddByLocalization from "./pages/Bizkaibus/BizkaibusAddByLocalization";
import BizkaibusHorarioPage from "./pages/Bizkaibus/BizkaibusHorarioPage";
import BizkaibusMyDisplays from "./pages/Bizkaibus/BizkaibusMyDisplays";
import BizkaibusRoutes from "./pages/Bizkaibus/BizkaibusRoutes";
import RouteItineraries from "./pages/Bizkaibus/RouteItineraries";
import SearchLines from "./pages/Bizkaibus/SearchLines";

import MetroBilbaoAddStop from "./pages/MetroBilbao/MetroBilbaoAddStop";
import MetroBilbaoAddRoute from "./pages/MetroBilbao/MetroBilbaoAddRoute";
import MetroBilbaoTripPlanner from "./pages/MetroBilbao/MetroBilbaoTripPlanner";
import MetroBilbaoMyDisplays from "./pages/MetroBilbao/MetroBilbaoMyDisplays";
import MetroTarifas from "./pages/MetroBilbao/MetroTarifas";

import KBusAddStop from "./pages/KBus/KBusAddStop";
import KBusMyDisplays from "./pages/KBus/KBusMyDisplays";

import RenfeAddStop from "./pages/Renfe/RenfeAddStop";
import RenfeAddRoute from "./pages/Renfe/RenfeAddRoute";
import RenfeTripPlanner from "./pages/Renfe/RenfeTripPlanner";
import RenfeMyDisplays from "./pages/Renfe/RenfeMyDisplays";

import EuskotrenAddRoute from "./pages/Euskotren/EuskotrenAddRoute";
import EuskotrenAddStop from "./pages/Euskotren/EuskotrenAddStop";
import EuskotrenTripPlanner from "./pages/Euskotren/EuskotrenTripPlanner";
import EuskotrenMyDisplays from "./pages/Euskotren/EuskotrenMyDisplays";

import AboutTheApp from "./pages/AboutTheApp";
import GuidedSetup from "./pages/GuidedSetup";
import AppLoader from "./components/AppLoader";

setupIonicReact();

const App: React.FC = () => {
    const { i18n, t } = useTranslation();
    const [isLanguageLoaded, setIsLanguageLoaded] = useState(false);

    useEffect(() => {
        const checkConfiguration = async () => {
            const settings = await loadSettings();
            if (settings) {
                if (settings.language) {
                    await i18n.changeLanguage(settings.language);
                }
            }
            setIsLanguageLoaded(true);
        };

        checkConfiguration();
    }, [i18n]);

    useEffect(() => {
        if (Capacitor.isNativePlatform()) {
            StatusBar.setOverlaysWebView({ overlay: true });
            
            const updateStatusBarTheme = (isDark: boolean) => {
                try {
                    if (isDark) {
                        StatusBar.setBackgroundColor({ color: '#1a1a1a' });
                        StatusBar.setStyle({ style: Style.Dark });
                    } else {
                        StatusBar.setBackgroundColor({ color: '#ffffff' });
                        StatusBar.setStyle({ style: Style.Light });
                    }
                } catch (err) {
                    console.error('Error configuring StatusBar:', err);
                }
            };

            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            updateStatusBarTheme(mediaQuery.matches);

            const handler = (e: MediaQueryListEvent) => updateStatusBarTheme(e.matches);
            mediaQuery.addEventListener('change', handler);

            return () => {
                mediaQuery.removeEventListener('change', handler);
            };
        }
    }, []);

    if (!isLanguageLoaded) {
        return <AppLoader serviceName={"configuration"} reloading={false} />;
    }

    return (
        <IonApp>
            <ConfigurationProvider>
                <IonReactRouter>
                    <Route exact path="/" render={() => {
                        const hasSeenGuidedSetup = localStorage.getItem('hasSeenGuidedSetup');
                        if (hasSeenGuidedSetup) {
                            return <Redirect to="/home" />;
                        } else {
                            return <Redirect to="/guided-setup" />;
                        }
                    }} />
                    
                    <Route exact path="/guided-setup" component={GuidedSetup} />
                    
                    <IonTabs>
                        <IonRouterOutlet>
                            {/* Main Tabs */}
                            <Route exact path="/home" component={Home} />
                            <Route exact path="/explore" component={Explore} />
                            <Route exact path="/planners" component={Planners} />
                            <Route exact path="/configuration" component={Configuration} />

                            {/* Bizkaibus */}
                            <Route exact path="/bizkaibus-add-stop-by-town" component={BizkaibusAddByTown} />
                            <Route exact path="/bizkaibus-add-stop-by-location" component={BizkaibusAddByLocalization} />
                            <Route exact path="/bizkaibus-my-displays" component={BizkaibusMyDisplays} />
                            <Route path="/bizkaibus/scheduled/:line/:route" component={BizkaibusHorarioPage} />
                            <Route path="/bizkaibus/itinerary/:line/:route" component={RouteItineraries} />
                            <Route path="/bizkaibus/routes/:line" component={BizkaibusRoutes} />
                            <Route path="/bizkaibus-search-lines" component={SearchLines} />

                            {/* Metro Bilbao */}
                            <Route exact path="/metro-bilbao-add-stop" component={MetroBilbaoAddStop} />
                            <Route exact path="/metro-bilbao-add-route" component={MetroBilbaoAddRoute} />
                            <Route exact path="/metro-bilbao-trip-planner" component={MetroBilbaoTripPlanner} />
                            <Route exact path="/metro-bilbao-my-displays" component={MetroBilbaoMyDisplays} />
                            <Route exact path="/metro-bilbao-tarifas" component={MetroTarifas} />

                            {/* K-Bus */}
                            <Route exact path="/k-bus-add-stop" component={KBusAddStop} />
                            <Route exact path="/k-bus-my-displays" component={KBusMyDisplays} />

                            {/* Renfe */}
                            <Route exact path="/renfe-add-stop" component={RenfeAddStop} />
                            <Route exact path="/renfe-add-route" component={RenfeAddRoute} />
                            <Route exact path="/renfe-trip-planner" component={RenfeTripPlanner} />
                            <Route exact path="/renfe-my-displays" component={RenfeMyDisplays} />

                            {/* Euskotren */}
                            <Route exact path="/euskotren-add-route" component={EuskotrenAddRoute} />
                            <Route exact path="/euskotren-add-stop" component={EuskotrenAddStop} />
                            <Route exact path="/euskotren-trip-planner" component={EuskotrenTripPlanner} />
                            <Route exact path="/euskotren-my-displays" component={EuskotrenMyDisplays} />

                            {/* General */}
                            <Route exact path="/about-app" component={AboutTheApp} />
                        </IonRouterOutlet>

                        <IonTabBar slot="bottom">
                            <IonTabButton tab="home" href="/home">
                                <IonIcon icon={homeOutline} />
                                <IonLabel>{t('Inicio', 'Inicio')}</IonLabel>
                            </IonTabButton>
                            <IonTabButton tab="explore" href="/explore">
                                <IonIcon icon={searchOutline} />
                                <IonLabel>{t('Explorar', 'Explorar')}</IonLabel>
                            </IonTabButton>
                            <IonTabButton tab="planners" href="/planners">
                                <IonIcon icon={mapOutline} />
                                <IonLabel>{t('Viajes', 'Viajes')}</IonLabel>
                            </IonTabButton>
                            <IonTabButton tab="configuration" href="/configuration">
                                <IonIcon icon={settingsOutline} />
                                <IonLabel>{t('Ajustes', 'Ajustes')}</IonLabel>
                            </IonTabButton>
                        </IonTabBar>
                    </IonTabs>
                </IonReactRouter>
            </ConfigurationProvider>
        </IonApp>
    );
};

export default App;