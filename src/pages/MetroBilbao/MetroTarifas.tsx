import React, { useEffect, useState } from 'react';
import { IonContent, IonSpinner, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonItem, IonLabel, IonIcon, IonList, IonThumbnail } from '@ionic/react';
import { useTranslation } from 'react-i18next';
import { getFares, FaresResponse, FareCategory, FareItem } from '../../services/ApiMetroBilbao';
import Page from '../Page';
import { chevronDownOutline, chevronUpOutline } from 'ionicons/icons';

const FareItemDetail: React.FC<{ item: FareItem }> = ({ item }) => {
    const { t } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);

    const renderRates = () => {
        const allRates = item.rates.flat();
        if (allRates.length === 0) {
            return null;
        }

        const uniqueTypes = [...new Set(allRates.map(rate => rate.type))];

        if (uniqueTypes.length === 1 && uniqueTypes[0] === 'normal') {
            return (
                <IonList>
                    {allRates.map(rate => (
                        <IonItem key={`${rate.zones}-${rate.price}`}>
                            <IonLabel>{rate.zones > 0 ? `${rate.zones} ${t('zona_s')}` : ''}</IonLabel>
                            <IonLabel slot="end">{rate.price}€</IonLabel>
                        </IonItem>
                    ))}
                </IonList>
            );
        } else {
            return (
                <div>
                    {uniqueTypes.map(type => (
                        <div key={type}>
                            <h4>{t(type)}</h4>
                            <IonList>
                                {allRates.filter(rate => rate.type === type).map(rate => (
                                    <IonItem key={`${type}-${rate.zones}-${rate.price}`}>
                                        <IonLabel>{rate.zones > 0 ? `${rate.zones} ${t('zona_s')}` : ''}</IonLabel>
                                        <IonLabel slot="end">{rate.price}€</IonLabel>
                                    </IonItem>
                                ))}
                            </IonList>
                        </div>
                    ))}
                </div>
            );
        }
    };

    return (
        <IonCard>
            <IonItem button onClick={() => setIsOpen(!isOpen)}>
                <IonThumbnail slot="start" style={{ border: '1px solid black', width: '100px', height: 'auto' }}>
                    <img src={item.img} alt={item.name} />
                </IonThumbnail>
                <IonLabel>{item.name}</IonLabel>
                <IonIcon icon={isOpen ? chevronUpOutline : chevronDownOutline} slot="end" />
            </IonItem>
            {isOpen && (
                <IonCardContent>
                    {item.subTitle && <h5>{item.subTitle}</h5>}
                    <div dangerouslySetInnerHTML={{ __html: item.terms }} />
                    {renderRates()}
                </IonCardContent>
            )}
        </IonCard>
    );
};

const MetroTarifas: React.FC = () => {
    const { t } = useTranslation();
    const [fares, setFares] = useState<FaresResponse | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFares = async () => {
            try {
                const data = await getFares();
                setFares(data);
            } catch (error) {
                console.error("Failed to fetch fares", error);
            } finally {
                setLoading(false);
            }
        };

        fetchFares();
    }, []);

    const renderCategories = () => {
        if (!fares?.configuration.categorized) {
            return null;
        }

        const categories = Object.values(fares.configuration.categorized).sort((a, b) => a.order - b.order);

        return categories.map((category: FareCategory) => (
            <div key={category.order}>
                <h2 style={{ paddingLeft: '16px', paddingTop: '16px' }}>{category.type}</h2>
                {category.items.map(item => (
                    <FareItemDetail key={item.code} item={item} />
                ))}
            </div>
        ));
    };

    return (
        <Page title={t('Tarifas Metro Bilbao')} internalPage={true}>
            {loading ? (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                    <IonSpinner />
                </div>
            ) : (
                <IonContent>
                    {renderCategories()}
                </IonContent>
            )}
        </Page>
    );
};

export default MetroTarifas;
