import React from 'react';
import Page from "../Page";
import { useTranslation } from "react-i18next";
import { searchOutline, busOutline, trainOutline } from "ionicons/icons";
import { IonList, IonItem, IonLabel, IonIcon, IonListHeader } from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { bizkaibusMenuItems, metroMenuItems, renfeMenuItems, kbusMenuItems, euskotrenMenuItems } from "../../components/Menu/menuItems";
import { useConfiguration } from '../../context/ConfigurationContext';
import { getSelectedVisores } from "../../services/Atajos";

const Explore: React.FC = () => {
    const { t } = useTranslation();
    const history = useHistory();
    const { settings } = useConfiguration();
    const selectedVisores = getSelectedVisores(settings);

    const renderMenuSection = (title: string, icon: string, items: any[], isActive: boolean) => {
        if (!isActive) return null;
        return (
            <>
                <IonListHeader>
                    <IonLabel color="primary">
                        <IonIcon icon={icon} style={{ verticalAlign: 'middle', marginRight: '8px' }} />
                        {t(title)}
                    </IonLabel>
                </IonListHeader>
                {items.map((item, index) => (
                    <IonItem key={index} button onClick={() => history.push(item.path)}>
                        <IonIcon slot="start" icon={item.icon} color="medium"/>
                        <IonLabel>{t(item.text)}</IonLabel>
                    </IonItem>
                ))}
            </>
        );
    };

    return (
        <Page title={t("Explorar")} icon={searchOutline}>
            <IonList lines="full">
                {renderMenuSection('Bizkaibus', busOutline, bizkaibusMenuItems, selectedVisores.includes('bizkaibus'))}
                {renderMenuSection('Metro Bilbao', trainOutline, metroMenuItems, selectedVisores.includes('metro'))}
                {renderMenuSection('Renfe Cercanías', trainOutline, renfeMenuItems, selectedVisores.includes('renfe'))}
                {renderMenuSection('K Bus Barakaldo', busOutline, kbusMenuItems, selectedVisores.includes('kbus'))}
                {renderMenuSection('Euskotren', trainOutline, euskotrenMenuItems, selectedVisores.includes('euskotren'))}
                
                {selectedVisores.length === 0 && (
                    <div style={{ textAlign: 'center', marginTop: '2rem', padding: '0 20px' }}>
                        <p>{t('Activa algún servicio de transporte en Configuración para empezar a explorar.')}</p>
                    </div>
                )}
            </IonList>
        </Page>
    );
};

export default Explore;
