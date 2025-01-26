import {Redirect, Route} from 'react-router-dom';
import {
    IonApp,
    IonContent,
    IonHeader, IonIcon, IonItem, IonList,
    IonMenu, IonMenuToggle, IonPage,
    IonRouterOutlet, IonSplitPane,
    IonTitle,
    IonToolbar,
    setupIonicReact
} from '@ionic/react';
import {IonReactRouter} from '@ionic/react-router';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/**
 * Ionic Dark Mode
 * -----------------------------------------------------
 * For more info, please see:
 * https://ionicframework.com/docs/theming/dark-mode
 */

/* import '@ionic/react/css/palettes/dark.always.css'; */
/* import '@ionic/react/css/palettes/dark.class.css'; */
import '@ionic/react/css/palettes/dark.system.css';

/* Theme variables */
import './theme/variables.css';
import BizkaibusViewers from "./pages/BizkaibusViewers";
import ConfigureBizkaibus from "./pages/ConfigureBizkaibus";
import MetroBilbaoViewers from "./pages/MetroBilbaoViewers";
import ConfigureMetroBilbao from "./pages/ConfigureMetroBilbao";
import {busOutline, settingsOutline, trainOutline} from "ionicons/icons";
import React from "react";

setupIonicReact();

const App: React.FC = () => {
    return (
        <IonApp>
            <IonReactRouter>
                <IonSplitPane contentId="main">
                    {/* Menú Lateral */}
                    <IonMenu contentId="main">
                        <IonHeader>
                            <IonToolbar>
                                <IonTitle>Menú</IonTitle>
                            </IonToolbar>
                        </IonHeader>
                        <IonContent>
                            <IonList>
                                <IonMenuToggle>
                                    <IonItem routerLink="/bizkaibus-viewers" routerDirection="root">
                                        <IonIcon icon={busOutline} slot="start"></IonIcon>
                                        Visores Bizkaibus
                                    </IonItem>
                                </IonMenuToggle>
                                <IonMenuToggle>
                                    <IonItem routerLink="/configure-bizkaibus" routerDirection="root">
                                        <IonIcon icon={settingsOutline} slot="start"></IonIcon>
                                        Configurar Bizkaibus
                                    </IonItem>
                                </IonMenuToggle>
                                <IonMenuToggle>
                                    <IonItem routerLink="/metro-bilbao-viewers" routerDirection="root">
                                        <IonIcon icon={trainOutline} slot="start"></IonIcon>
                                        Visores Metro Bilbao
                                    </IonItem>
                                </IonMenuToggle>
                                <IonMenuToggle>
                                    <IonItem routerLink="/configure-metro-bilbao" routerDirection="root">
                                        <IonIcon icon={settingsOutline} slot="start"></IonIcon>
                                        Configurar Metro Bilbao
                                    </IonItem>
                                </IonMenuToggle>

                            </IonList>
                        </IonContent>
                    </IonMenu>

                    {/* Contenido Principal */}
                    <IonRouterOutlet id="main">
                        <Route exact path="/bizkaibus-viewers" component={BizkaibusViewers}/>
                        <Route exact path="/configure-bizkaibus" component={ConfigureBizkaibus}/>
                        <Route exact path="/metro-bilbao-viewers" component={MetroBilbaoViewers}/>
                        <Route exact path="/configure-metro-bilbao" component={ConfigureMetroBilbao}/>
                        <Route exact path="/" render={() => <Redirect to="/bizkaibus-viewers"/>}/>
                    </IonRouterOutlet>
                </IonSplitPane>
            </IonReactRouter>
        </IonApp>
    );
};

export default App;
