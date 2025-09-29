import React, { useEffect, useState } from 'react';
import {
    IonButton,
    IonContent,
    IonInput,
    IonItem,
    IonLabel,
    IonList,
    IonPage,
    IonSelect,
    IonSelectOption,
    useIonViewWillEnter
} from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getBizkaibusLinesByMunicipality, getBizkaibusRoutes, BizkaibusRoute } from '../../services/Bizkaibus/Routes';
import Page from '../Page';
import { searchOutline } from 'ionicons/icons';
import { getStations, Municipio } from '../../services/BizkaibusStorage';

const SearchLines: React.FC = () => {
    const { t } = useTranslation();
    const history = useHistory();
    const [lineCode, setLineCode] = useState('');
    const [municipalityCode, setMunicipalityCode] = useState('');
    const [municipalities, setMunicipalities] = useState<Municipio[]>([]);
    const [searchResults, setSearchResults] = useState<BizkaibusRoute[]>([]);
    const [error, setError] = useState<string | null>(null);

    useIonViewWillEnter(() => {
        setLineCode('');
        setMunicipalityCode('');
        setSearchResults([]);
        setError(null);
    });

    useEffect(() => {
        const fetchMunicipalities = async () => {
            const stations = await getStations();
            const uniqueMunicipalities = stations.reduce((acc: Municipio[], station) => {
                if (!acc.find(m => m.MUNICIPIO === station.MUNICIPIO)) {
                    acc.push({
                        PROVINCIA: station.PROVINCIA,
                        DESCRIPCION_PROVINCIA: station.DESCRIPCION_PROVINCIA,
                        MUNICIPIO: station.MUNICIPIO,
                        DESCRIPCION_MUNICIPIO: station.DESCRIPCION_MUNICIPIO
                    });
                }
                return acc;
            }, []);
            uniqueMunicipalities.sort((a, b) => a.DESCRIPCION_MUNICIPIO.localeCompare(b.DESCRIPCION_MUNICIPIO));
            setMunicipalities(uniqueMunicipalities);
        };
        fetchMunicipalities();
    }, []);

    const filterPrincipalRoutes = (routes: BizkaibusRoute[]): BizkaibusRoute[] => {
        const principalRoutes = routes.filter(r => r.IsPrincipal);
        const nonPrincipalRoutes = routes.filter(r => !r.IsPrincipal);
        
        const lineMap = new Map<string, BizkaibusRoute>();
        
        for (const route of principalRoutes) {
            if (!lineMap.has(route.CodigoLinea)) {
                lineMap.set(route.CodigoLinea, route);
            }
        }
        
        for (const route of nonPrincipalRoutes) {
            if (!lineMap.has(route.CodigoLinea)) {
                lineMap.set(route.CodigoLinea, route);
            }
        }
        
        return Array.from(lineMap.values());
    }

    const handleSearch = async () => {
        setSearchResults([]);
        setError(null);

        let routes: BizkaibusRoute[] = [];
        if (lineCode) {
            routes = await getBizkaibusRoutes(lineCode);
        } else if (municipalityCode) {
            routes = await getBizkaibusLinesByMunicipality(municipalityCode);
        }

        const filteredRoutes = filterPrincipalRoutes(routes);

        if (filteredRoutes.length > 0) {
            setSearchResults(filteredRoutes);
        } else {
            setError(t('No se encontraron líneas'));
        }
    };

    return (
        <Page title={t('Buscar línea')} icon={searchOutline} internalPage={true}>
            <IonItem>
                <IonLabel position="stacked">{t('Código de línea')}</IonLabel>
                <IonInput
                    value={lineCode}
                    placeholder={t('Introduce el código de línea')}
                    onIonInput={(e) => setLineCode(e.detail.value!)}
                />
            </IonItem>
            <IonItem>
                <IonLabel position="stacked">{t('Municipio')}</IonLabel>
                <IonSelect
                    value={municipalityCode}
                    placeholder={t('Selecciona un municipio')}
                    onIonChange={(e) => setMunicipalityCode(e.detail.value)}
                >
                    {municipalities.map(m => (
                        <IonSelectOption key={m.MUNICIPIO} value={m.MUNICIPIO}>
                            {m.DESCRIPCION_MUNICIPIO}
                        </IonSelectOption>
                    ))}
                </IonSelect>
            </IonItem>
            <IonButton expand="full" onClick={handleSearch} style={{ marginTop: '1rem' }}>
                {t('Buscar línea')}
            </IonButton>

            {error && <p style={{ textAlign: 'center', color: 'red', marginTop: '1rem' }}>{error}</p>}

            {searchResults.length > 0 && (
                <IonList style={{ marginTop: '1rem' }}>
                    {searchResults.map(route => (
                        <IonItem key={`${route.CodigoLinea}-${route.RouteNumber}`}>
                            <IonLabel>
                                <h2>{route.CodigoLinea} - {route.LineName}</h2>
                                <p>{route.RouteName}</p>
                            </IonLabel>
                            <IonButton onClick={() => history.push(`/routes/${route.CodigoLinea}`)}>
                                {t('Ver información')}
                            </IonButton>
                        </IonItem>
                    ))}
                </IonList>
            )}
        </Page>
    );
};

export default SearchLines;
