import {IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonItem, IonLabel, IonList, IonNote, IonSelect, IonSelectOption, IonToggle, IonReorder, IonReorderGroup} from "@ionic/react";
import LanguageSwitcher from "../components/LanguageSwitcher";
import {settingsOutline} from "ionicons/icons";
import Page from "./Page";
import {useTranslation} from "react-i18next";
import {useConfiguration} from "../context/ConfigurationContext";
import {getSelectedVisores, TRANSPORTES} from "../services/Atajos";

const Configuration: React.FC = () => {
    const { t, i18n } = useTranslation();
    const { settings, updateSettings } = useConfiguration();

    const handleSettingChange = (name: string, value: any) => {
        updateSettings({ [name]: value });
    };

    return (
        <Page title={t("Configuración")} internalPage={true}>
            <IonList>
                <IonCard>
                    <IonCardHeader>
                        <IonCardTitle>{t('General')}</IonCardTitle>
                    </IonCardHeader>
                    <IonCardContent>
                        <IonItem>
                            <LanguageSwitcher language={settings.language} onLanguageChange={(lang) => handleSettingChange('language', lang)} />
                        </IonItem>
                        <IonItem>
                            <IonLabel>{t('Tasa de refresco')}</IonLabel>
                            <IonSelect name="refreshRate" value={settings.refreshRate} onIonChange={(e) => handleSettingChange('refreshRate', e.detail.value)}>
                                <IonSelectOption value={"Cada minuto"}>{t('Cada minuto')}</IonSelectOption>
                                <IonSelectOption value={"Cada 2 minutos"}>{t('Cada 2 minutos')}</IonSelectOption>
                                <IonSelectOption value={"Nunca"}>{t('Nunca')}</IonSelectOption>
                            </IonSelect>
                        </IonItem>
                    </IonCardContent>
                </IonCard>

                <IonCard>
                    <IonCardHeader>
                        <IonCardTitle>{t('Servicios Activos')}</IonCardTitle>
                    </IonCardHeader>
                    <IonCardContent style={{ padding: 0 }}>
                        <IonList lines="full" style={{ padding: 0 }}>
                            <IonReorderGroup 
                                disabled={false} 
                                onIonItemReorder={(e) => {
                                    const activeIds = getSelectedVisores(settings);
                                    const orderedTransports = [...TRANSPORTES].sort((a, b) => {
                                        let indexA = activeIds.indexOf(a.id);
                                        let indexB = activeIds.indexOf(b.id);
                                        if (indexA !== -1 && indexB !== -1) return indexA - indexB;
                                        if (indexA !== -1) return -1;
                                        if (indexB !== -1) return 1;
                                        return 0;
                                    });
                                    const reorderedList = [...orderedTransports];
                                    const [movedItem] = reorderedList.splice(e.detail.from, 1);
                                    reorderedList.splice(e.detail.to, 0, movedItem);
                                    
                                    const newActiveIds = reorderedList.filter(t => activeIds.includes(t.id)).map(t => t.id);
                                    handleSettingChange('atajos', newActiveIds);
                                    e.detail.complete();
                                }}
                            >
                                {(() => {
                                    const activeIds = getSelectedVisores(settings);
                                    const orderedTransports = [...TRANSPORTES].sort((a, b) => {
                                        let indexA = activeIds.indexOf(a.id);
                                        let indexB = activeIds.indexOf(b.id);
                                        if (indexA !== -1 && indexB !== -1) return indexA - indexB;
                                        if (indexA !== -1) return -1;
                                        if (indexB !== -1) return 1;
                                        return 0;
                                    });

                                    return orderedTransports.map(transport => {
                                        const isActive = activeIds.includes(transport.id);
                                        return (
                                            <IonItem key={transport.id}>
                                                <IonLabel>{t(transport.label)}</IonLabel>
                                                <IonToggle 
                                                    slot="end" 
                                                    checked={isActive}
                                                    onIonChange={(e) => {
                                                        const isChecked = e.detail.checked;
                                                        if (isChecked && !isActive) {
                                                            handleSettingChange('atajos', [...activeIds, transport.id]);
                                                        } else if (!isChecked && isActive) {
                                                            handleSettingChange('atajos', activeIds.filter(id => id !== transport.id));
                                                        }
                                                    }}
                                                />
                                                <IonReorder slot="end" />
                                            </IonItem>
                                        );
                                    });
                                })()}
                            </IonReorderGroup>
                        </IonList>
                        <div style={{ padding: '16px' }}>
                            <IonNote>{t('Activa los servicios que usas y arrástralos para ordenarlos en la pantalla de Inicio.')}</IonNote>
                        </div>
                    </IonCardContent>
                </IonCard>

                <IonCard>
                    <IonCardHeader>
                        <IonCardTitle>{t('Metro Bilbao')}</IonCardTitle>
                    </IonCardHeader>
                    <IonCardContent>
                        <IonItem>
                            <IonLabel>{t('Ver número de vagones')}</IonLabel>
                            <IonToggle name="verNumeroVagones" checked={settings.verNumeroVagones} onIonChange={(e) => handleSettingChange('verNumeroVagones', e.detail.checked)} />
                        </IonItem>
                        <IonItem>
                            <IonLabel>{t('Mostrar metros hasta')}</IonLabel>
                            <IonSelect name="maxTrenes" value={settings.maxTrenes} onIonChange={(e) => handleSettingChange('maxTrenes', parseInt(e.detail.value, 10))}>
                                <IonSelectOption value={15}>15 {t('minutos')}</IonSelectOption>
                                <IonSelectOption value={30}>30 {t('minutos')}</IonSelectOption>
                                <IonSelectOption value={45}>45 {t('minutos')}</IonSelectOption>
                                <IonSelectOption value={60}>60 {t('minutos')}</IonSelectOption>
                            </IonSelect>
                        </IonItem>
                        <IonItem>
                            <IonLabel>{t('Plegado de visores')}</IonLabel>
                            <IonSelect name="metroDisplayFolding" value={settings.metroDisplayFolding} onIonChange={(e) => handleSettingChange('metroDisplayFolding', e.detail.value)}>
                                <IonSelectOption value={"disabled"}>{t('Desactivado')}</IonSelectOption>
                                <IonSelectOption value={"collapsed"}>{t('Plegados')}</IonSelectOption>
                                <IonSelectOption value={"not-collapsed"}>{t('Desplegados')}</IonSelectOption>
                            </IonSelect>
                        </IonItem>
                    </IonCardContent>
                </IonCard>

                <IonCard>
                    <IonCardHeader>
                        <IonCardTitle>{t('Euskotren')}</IonCardTitle>
                    </IonCardHeader>
                    <IonCardContent>
                        <IonItem>
                            <IonLabel>{t('Mostrar trenes hasta')}</IonLabel>
                            <IonSelect name="euskotrenMaxTrenes" value={settings.euskotrenMaxTrenes} onIonChange={(e) => handleSettingChange('euskotrenMaxTrenes', parseInt(e.detail.value, 10))}>
                                <IonSelectOption value={15}>15 {t('minutos')}</IonSelectOption>
                                <IonSelectOption value={30}>30 {t('minutos')}</IonSelectOption>
                                <IonSelectOption value={45}>45 {t('minutos')}</IonSelectOption>
                                <IonSelectOption value={60}>60 {t('minutos')}</IonSelectOption>
                            </IonSelect>
                        </IonItem>
                        <IonItem>
                            <IonLabel>{t('Plegado de visores')}</IonLabel>
                            <IonSelect name="euskotrenDisplayFolding" value={settings.euskotrenDisplayFolding} onIonChange={(e) => handleSettingChange('euskotrenDisplayFolding', e.detail.value)}>
                                <IonSelectOption value={"disabled"}>{t('Desactivado')}</IonSelectOption>
                                <IonSelectOption value={"collapsed"}>{t('Plegados')}</IonSelectOption>
                                <IonSelectOption value={"not-collapsed"}>{t('Desplegados')}</IonSelectOption>
                            </IonSelect>
                        </IonItem>
                    </IonCardContent>
                </IonCard>

                <IonCard>
                    <IonCardHeader>
                        <IonCardTitle>{t('Bizkaibus')}</IonCardTitle>
                    </IonCardHeader>
                    <IonCardContent>
                        <IonItem>
                            <IonLabel>{t('Ver frecuencia')}</IonLabel>
                            <IonToggle name="verFrecuencia" checked={settings.verFrecuencia} onIonChange={(e) => handleSettingChange('verFrecuencia', e.detail.checked)} />
                        </IonItem>
                        <IonNote className='ion-padding-start'>{t('Muestra la diferencia de tiempo entre los dos próximos autobuses.')}</IonNote>
                    </IonCardContent>
                </IonCard>
            </IonList>
        </Page>
    );
};

export default Configuration;
