import React, { useState, useEffect } from 'react';
import { IonButton, IonToggle, IonLabel, IonItem, IonSelect, IonSelectOption } from '@ionic/react';
import { useTranslation } from 'react-i18next';
import { useConfiguration } from '../../../context/ConfigurationContext';
import BizkaibusAddByTown from '../../../pages/Bizkaibus/BizkaibusAddByTown';
import MetroBilbaoAddStop from '../../../pages/MetroBilbao/MetroBilbaoAddStop';
import MetroBilbaoAddRoute from '../../../pages/MetroBilbao/MetroBilbaoAddRoute';
import EuskotrenAddStop from '../../../pages/Euskotren/EuskotrenAddStop';
import EuskotrenAddRoute from '../../../pages/Euskotren/EuskotrenAddRoute';
import RenfeAddStop from '../../../pages/Renfe/RenfeAddStop';
import RenfeAddRoute from '../../../pages/Renfe/RenfeAddRoute';
import KBusAddStop from '../../../pages/KBus/KBusAddStop';
import MetroBilbaoDisplayList from '../../MetroBilbao/MetroBilbaoDisplayList';
import BizkaibusDisplayList from '../BizkaibusDisplayList';
import RenfeDisplayList from '../RenfeDisplayList';
import EuskotrenDisplayList from '../EuskotrenDisplayList';
import { KBusStorage } from '../../../services/KBus/KBusStorage';
import { KBusStop } from '../../../services/KBus/KbusStop';
import KBusDisplayList from '../KBusDisplayList';
import { getSavedDisplays, saveMetroDisplays } from '../../../services/MetroBilbaoStorage';
import { getStations, saveStationIds, Parada } from '../../../services/BizkaibusStorage';
import { getRenfeStops } from '../../../services/RenfeStorageFunctions';
import { getEuskotrenStops } from '../../../services/Euskotren/EuskotrenStorage';
import { Display } from '../../../services/MetroBilbao/Display';
import { ItemReorderEventDetail } from '@ionic/core';
import WizardStepLayout from '../WizardStepLayout';

interface ServiceConfigStepProps {
    service: string;
    onNext: () => void;
    onBack: () => void;
    onSkip?: () => void;
    stepType?: 'full' | 'config' | 'visors';
}

const ServiceConfigStep: React.FC<ServiceConfigStepProps> = ({
    service,
    onNext,
    onBack,
    onSkip,
    stepType = 'full'
}) => {
    const { t } = useTranslation();
    const { settings, updateSettings } = useConfiguration();
    const [showQuickAdd, setShowQuickAdd] = useState<string | null>(null);
    const [metroDisplays, setMetroDisplays] = useState<Display[]>([]);
    const [bizkaibusDisplays, setBizkaibusDisplays] = useState<Parada[]>([]);
    const [renfeDisplays, setRenfeDisplays] = useState<{ routeId: string; routeName: string }[]>([]);
    const [euskotrenDisplays, setEuskotrenDisplays] = useState<{ routeId: string; routeName: string }[]>([]);
    const [kbusDisplays, setKbusDisplays] = useState<KBusStop[]>([]);
    const kbusStorage = new KBusStorage();

    useEffect(() => {
        if (service === 'metro') {
            loadMetroDisplays();
        } else if (service === 'bizkaibus') {
            loadBizkaibusDisplays();
        } else if (service === 'renfe') {
            loadRenfeDisplays();
        } else if (service === 'euskotren') {
            loadEuskotrenDisplays();
        } else if (service === 'kbus') {
            loadKBusDisplays();
        }
    }, [service]);

    const loadMetroDisplays = () => {
        setMetroDisplays(getSavedDisplays());
    };

    const loadBizkaibusDisplays = async () => {
        const stations = await getStations(true);
        // Filter only favorites
        setBizkaibusDisplays(stations.filter(s => s.IS_FAVORITE));
    };

    const loadRenfeDisplays = () => {
        const savedStops = localStorage.getItem('Renfe_selected_stops');
        if (savedStops) {
            try {
                const ids: string[] = JSON.parse(savedStops);
                // Filter for routes (containing '-')
                const routes = ids.filter(id => id.includes('-'));

                const stations = getRenfeStops();
                const stationMap = new Map(stations.map(s => [s.id, s.name]));

                const mappedRoutes = routes.map(routeId => {
                    const [originId, destId] = routeId.split(' - ');
                    const originName = stationMap.get(originId) || originId;
                    const destName = stationMap.get(destId) || destId;
                    return {
                        routeId,
                        routeName: `${originName} - ${destName}`
                    };
                });

                setRenfeDisplays(mappedRoutes);
            } catch (e) {
                console.error("Error loading Renfe displays", e);
            }
        }
    };

    const loadEuskotrenDisplays = () => {
        const savedStops = localStorage.getItem('euskotren_selected_stops');
        if (savedStops) {
            try {
                const ids: string[] = JSON.parse(savedStops);
                // Euskotren might have single stops saved, but we only want routes now?
                // The requirement says "solo debe dejar añadir rutas". 
                // We should probably filter for routes (containing '-') just to be safe and consistent with the new UI.
                const routes = ids.filter(id => id.includes('-'));

                const stations = getEuskotrenStops();
                const stationMap = new Map(stations.map(s => [s.Code, s.Name]));

                const mappedRoutes = routes.map(routeId => {
                    const [originId, destId] = routeId.split(' - ');
                    const originName = stationMap.get(originId) || originId;
                    const destName = stationMap.get(destId) || destId;
                    return {
                        routeId,
                        routeName: `${originName} - ${destName}`
                    };
                });

                setEuskotrenDisplays(mappedRoutes);
            } catch (e) {
                console.error("Error loading Euskotren displays", e);
            }
        }
    };

    const loadKBusDisplays = () => {
        const stations = kbusStorage.getStations() as KBusStop[];
        setKbusDisplays(stations.filter(s => s.isFavorite));
    };

    const getServiceLabel = (id: string) => {
        const labels: { [key: string]: string } = {
            'bizkaibus': 'Bizkaibus',
            'metro': 'Metro Bilbao',
            'euskotren': 'Euskotren',
            'renfe': 'Renfe',
            'kbus': 'KBus'
        };
        return labels[id] || id;
    };

    const getStepTitle = () => {
        const baseLabel = getServiceLabel(service);
        if (service === 'metro') {
            if (stepType === 'config') return `${baseLabel} - ${t('Configuración')}`;
            if (stepType === 'visors') return `${baseLabel} - ${t('Visores')}`;
        }
        return baseLabel;
    };

    const handleQuickAddComplete = () => {
        setShowQuickAdd(null);
        if (service === 'metro') {
            loadMetroDisplays();
        } else if (service === 'bizkaibus') {
            loadBizkaibusDisplays();
        } else if (service === 'renfe') {
            loadRenfeDisplays();
        } else if (service === 'euskotren') {
            loadEuskotrenDisplays();
        } else if (service === 'kbus') {
            loadKBusDisplays();
        }
    };

    const handleRemoveMetroDisplay = (display: Display) => {
        const newDisplays = metroDisplays.filter(
            (d) => d.origin.Code !== display.origin.Code || d.destination?.Code !== display.destination?.Code
        );
        saveMetroDisplays(newDisplays);
        setMetroDisplays(newDisplays);
    };

    const handleRemoveBizkaibusDisplay = (stop: Parada) => {
        // Toggle favorite status (remove)
        const newDisplays = bizkaibusDisplays.filter(s => s.PARADA !== stop.PARADA);
        setBizkaibusDisplays(newDisplays);

        // Update storage
        const stopIds = newDisplays.map(s => s.PARADA);
        saveStationIds(stopIds);
    };

    const handleRemoveRenfeDisplay = (routeId: string) => {
        const savedStops = localStorage.getItem('Renfe_selected_stops');
        if (savedStops) {
            try {
                let ids: string[] = JSON.parse(savedStops);
                ids = ids.filter(id => id !== routeId);
                localStorage.setItem('Renfe_selected_stops', JSON.stringify(ids));

                // Reload to update state with names
                loadRenfeDisplays();
            } catch (e) {
                console.error("Error removing Renfe display", e);
            }
        }
    };

    const handleRemoveEuskotrenDisplay = (routeId: string) => {
        const savedStops = localStorage.getItem('euskotren_selected_stops');
        if (savedStops) {
            try {
                let ids: string[] = JSON.parse(savedStops);
                ids = ids.filter(id => id !== routeId);
                localStorage.setItem('euskotren_selected_stops', JSON.stringify(ids));
                loadEuskotrenDisplays();
            } catch (e) {
                console.error("Error removing Euskotren display", e);
            }
        }
    };

    const handleRemoveKBusDisplay = (stop: KBusStop) => {
        kbusStorage.removeStop(stop);
        loadKBusDisplays();
    };

    const handleReorderMetroDisplays = (event: CustomEvent<ItemReorderEventDetail>) => {
        const fromIndex = event.detail.from;
        const toIndex = event.detail.to;

        const reorderedList = Array.from(metroDisplays);
        const [movedItem] = reorderedList.splice(fromIndex, 1);
        reorderedList.splice(toIndex, 0, movedItem);

        setMetroDisplays(reorderedList);
        saveMetroDisplays(reorderedList);
        event.detail.complete();
    };

    const renderQuickAdd = () => {
        if (!showQuickAdd) return null;

        const components: { [key: string]: React.ReactNode } = {
            'bizkaibus-stop': <BizkaibusAddByTown onComplete={handleQuickAddComplete} />,
            'metro-stop': <MetroBilbaoAddStop onComplete={handleQuickAddComplete} />,
            'metro-route': <MetroBilbaoAddRoute onComplete={handleQuickAddComplete} />,
            'euskotren-stop': <EuskotrenAddStop onComplete={handleQuickAddComplete} />,
            'euskotren-route': <EuskotrenAddRoute onComplete={handleQuickAddComplete} />,
            'renfe-route': <RenfeAddRoute onComplete={handleQuickAddComplete} />,
            'kbus-stop': <KBusAddStop onComplete={handleQuickAddComplete} />,
        };

        return (
            <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
                <h3 className="wizard-title" style={{ fontSize: '1.5rem', flexShrink: 0 }}>{t('Añadir')} {getServiceLabel(service)}</h3>
                <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                    {components[showQuickAdd]}
                </div>
                <IonButton fill="clear" onClick={handleQuickAddComplete} style={{ marginTop: '16px', flexShrink: 0 }}>
                    {t('Volver')}
                </IonButton>
            </div>
        );
    };

    if (showQuickAdd) {
        return renderQuickAdd();
    }

    const renderSettings = () => {
        switch (service) {
            case 'metro':
                return (
                    <>
                        {(stepType === 'config' || stepType === 'full') && (
                            <>
                                <IonItem lines="none" className="ion-no-padding" style={{ '--background': 'transparent', marginBottom: '16px' }}>
                                    <IonLabel>{t('Ver número de vagones')}</IonLabel>
                                    <IonToggle checked={settings.verNumeroVagones} onIonChange={(e) => updateSettings({ verNumeroVagones: e.detail.checked })} />
                                </IonItem>
                                <IonItem lines="none" className="ion-no-padding" style={{ '--background': 'transparent', marginBottom: '16px' }}>
                                    <IonLabel position="stacked" style={{ marginBottom: '8px', fontSize: '14px', color: 'var(--ion-color-step-600)' }}>{t('Mostrar metros hasta')}</IonLabel>
                                    <IonSelect value={settings.maxTrenes} onIonChange={(e) => updateSettings({ maxTrenes: parseInt(e.detail.value, 10) })} interface="popover" fill="outline" style={{ width: '100%' }}>
                                        <IonSelectOption value={15}>15 {t('minutos')}</IonSelectOption>
                                        <IonSelectOption value={30}>30 {t('minutos')}</IonSelectOption>
                                        <IonSelectOption value={45}>45 {t('minutos')}</IonSelectOption>
                                        <IonSelectOption value={60}>60 {t('minutos')}</IonSelectOption>
                                    </IonSelect>
                                </IonItem>
                            </>
                        )}

                        {(stepType === 'visors' || stepType === 'full') && metroDisplays.length > 0 && (
                            <div style={{ marginTop: '24px' }}>
                                <h4 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '8px' }}>{t('Mis Visores')}</h4>
                                <MetroBilbaoDisplayList
                                    displays={metroDisplays}
                                    onRemove={handleRemoveMetroDisplay}
                                    onReorder={handleReorderMetroDisplays}
                                />
                            </div>
                        )}
                    </>
                );
            case 'bizkaibus':
                return (
                    <>
                        <IonItem lines="none" className="ion-no-padding" style={{ '--background': 'transparent', marginBottom: '16px' }}>
                            <IonLabel>{t('Ver frecuencia')}</IonLabel>
                            <IonToggle checked={settings.verFrecuencia} onIonChange={(e) => updateSettings({ verFrecuencia: e.detail.checked })} />
                        </IonItem>

                        {bizkaibusDisplays.length > 0 && (
                            <div style={{ marginTop: '24px' }}>
                                <h4 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '8px' }}>{t('Mis Paradas')}</h4>
                                <BizkaibusDisplayList
                                    stops={bizkaibusDisplays}
                                    onRemove={handleRemoveBizkaibusDisplay}
                                />
                            </div>
                        )}
                    </>
                );
            case 'euskotren':
                return (
                    <>
                        {euskotrenDisplays.length > 0 ? (
                            <div style={{ marginTop: '24px' }}>
                                <h4 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '8px' }}>{t('Mis Visores')}</h4>
                                <EuskotrenDisplayList
                                    routes={euskotrenDisplays}
                                    onRemove={handleRemoveEuskotrenDisplay}
                                />
                            </div>
                        ) : (
                            <p style={{ color: 'var(--ion-color-step-600)', fontSize: '0.9rem' }}>
                                {t('No hay rutas configuradas. Añade una ruta para comenzar.')}
                            </p>
                        )}
                    </>
                );
            case 'renfe':
                return (
                    <>
                        {renfeDisplays.length > 0 ? (
                            <div style={{ marginTop: '24px' }}>
                                <h4 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '8px' }}>{t('Mis Visores')}</h4>
                                <RenfeDisplayList
                                    routes={renfeDisplays}
                                    onRemove={handleRemoveRenfeDisplay}
                                />
                            </div>
                        ) : (
                            <p style={{ color: 'var(--ion-color-step-600)', fontSize: '0.9rem' }}>
                                {t('No hay rutas configuradas. Añade una ruta para comenzar.')}
                            </p>
                        )}
                    </>
                );
            case 'kbus':
                return (
                    <>
                        <IonItem lines="none" className="ion-no-padding" style={{ '--background': 'transparent', marginBottom: '16px' }}>
                            <IonLabel>{t('Ver frecuencia')}</IonLabel>
                            <IonToggle checked={settings.verFrecuencia} onIonChange={(e) => updateSettings({ verFrecuencia: e.detail.checked })} />
                        </IonItem>

                        {kbusDisplays.length > 0 && (
                            <div style={{ marginTop: '24px' }}>
                                <h4 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '8px' }}>{t('Mis Paradas')}</h4>
                                <KBusDisplayList
                                    stops={kbusDisplays}
                                    onRemove={handleRemoveKBusDisplay}
                                />
                            </div>
                        )}
                    </>
                );
            default:
                return <p>{t('No hay configuración específica para este servicio.')}</p>;
        }
    };

    const renderActions = () => {
        if (stepType === 'config') return null;

        switch (service) {
            case 'bizkaibus':
                return <IonButton expand="block" fill="outline" onClick={() => setShowQuickAdd('bizkaibus-stop')}>{t('Añadir Parada por Pueblo')}</IonButton>;
            case 'metro':
                return (
                    <div style={{ display: 'flex', gap: '16px' }}>
                        <IonButton expand="block" fill="outline" style={{ flex: 1 }} onClick={() => setShowQuickAdd(`${service}-stop`)}>{t('Añadir Parada')}</IonButton>
                        <IonButton expand="block" fill="outline" style={{ flex: 1 }} onClick={() => setShowQuickAdd(`${service}-route`)}>{t('Añadir Ruta')}</IonButton>
                    </div>
                );
            case 'euskotren':
                return (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <IonButton expand="block" fill="outline" onClick={() => setShowQuickAdd('euskotren-route')}>{t('Añadir Ruta')}</IonButton>
                    </div>
                );
            case 'renfe':
                return (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <IonButton expand="block" fill="outline" onClick={() => setShowQuickAdd('renfe-route')}>{t('Añadir Ruta')}</IonButton>
                    </div>
                );
            case 'kbus':
                return <IonButton expand="block" fill="outline" onClick={() => setShowQuickAdd('kbus-stop')}>{t('Añadir Parada')}</IonButton>;
            default:
                return null;
        }
    }

    const getStepDescription = () => {
        if (service === 'metro') {
            if (stepType === 'config') return t('Configura las opciones generales de visualización.');
            if (stepType === 'visors') return t('Añade tus paradas y rutas frecuentes.');
        }
        return t('Configura tus preferencias y añade tu primera parada o ruta.');
    };

    return (
        <WizardStepLayout
            title={getStepTitle()}
            onNext={onNext}
            onBack={onBack}
            onSkip={onSkip}
        >
            <p className="wizard-description">{getStepDescription()}</p>

            <div style={{ marginBottom: '32px', textAlign: 'left' }}>
                {(stepType === 'config' || stepType === 'full') && (
                    <>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '16px' }}>{t('Preferencias')}</h3>
                        {renderSettings()}
                    </>
                )}

                {(stepType === 'visors' || stepType === 'full') && (
                    <>
                        {/* If we are in 'visors' mode, renderSettings might render the list, so we call it here too if needed, 
                             but renderSettings logic handles the conditional rendering internally for the list part. 
                             However, for structure, if we are ONLY in visors mode, we might want to ensure the list is shown.
                             The current renderSettings implementation handles 'visors' case for Metro list.
                         */}
                        {stepType === 'visors' && renderSettings()}

                        <h3 style={{ fontSize: '1.1rem', fontWeight: 600, margin: '24px 0 16px' }}>{t('Acciones Rápidas')}</h3>
                        {renderActions()}
                    </>
                )}
            </div>
        </WizardStepLayout>
    );
};

export default ServiceConfigStep;
