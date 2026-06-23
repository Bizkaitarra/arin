import React from "react";
import {
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonList,
    IonItem,
    IonLabel,
    IonSkeletonText
} from "@ionic/react";
import AppLoader from "./AppLoader";

interface LoaderProps {
    serviceName: string;
    reloading: boolean;
}

const Loader: React.FC<LoaderProps> = ({ serviceName, reloading }) => {
    // Normalizar el nombre del servicio
    const normalizedService = serviceName.toLowerCase();

    // Si es una recarga rápida o el servicio no es de transporte, usar el cargador tradicional
    if (reloading || !["bizkaibus", "metro bilbao", "renfe", "kbus", "euskotren"].includes(normalizedService)) {
        return <AppLoader serviceName={serviceName} reloading={reloading} />;
    }

    // Configurar colores corporativos de cabecera para los esqueletos
    const getHeaderColor = () => {
        switch (normalizedService) {
            case "bizkaibus":
                return "var(--arin-bizkaibus-color, #147014)";
            case "metro bilbao":
                return "var(--arin-metro-red, #e4002b)";
            case "renfe":
                return "var(--arin-renfe-color, #6f2b90)";
            case "kbus":
                return "var(--arin-kbus-color, #005c99)";
            case "euskotren":
                return "var(--arin-euskotren-color, #8bc34a)";
            default:
                return "var(--ion-color-primary, #3880ff)";
        }
    };

    // Renderizar 2 tarjetas esqueleto simuladas
    return (
        <div style={{ padding: "8px 0" }}>
            {[1, 2].map((cardIndex) => (
                <IonCard key={cardIndex} style={{ margin: "0 0 16px 0", borderRadius: "12px", background: "var(--arin-card-background, #fff)" }}>
                    <IonCardHeader style={{ backgroundColor: getHeaderColor(), padding: "12px 16px" }}>
                        <IonCardTitle>
                            <IonSkeletonText animated style={{ width: "55%", height: "20px", background: "rgba(255, 255, 255, 0.3)" }} />
                        </IonCardTitle>
                    </IonCardHeader>
                    <IonCardContent style={{ padding: 0 }}>
                        <IonList lines="none" style={{ background: "transparent" }}>
                            {[1, 2, 3].map((itemIndex) => (
                                <IonItem key={itemIndex} style={{ "--background": "transparent", "--padding-start": "16px", "--padding-end": "16px", borderBottom: "1px solid var(--arin-border-color, #f0f0f0)" }}>
                                    <IonLabel style={{ margin: "10px 0" }}>
                                        <h3>
                                            <IonSkeletonText animated style={{ width: "35%", height: "16px" }} />
                                        </h3>
                                        <p style={{ marginTop: "4px" }}>
                                            <IonSkeletonText animated style={{ width: "60%", height: "12px" }} />
                                        </p>
                                    </IonLabel>
                                    <IonLabel slot="end" style={{ textAlign: "right", margin: "10px 0" }}>
                                        <IonSkeletonText animated style={{ width: "45px", height: "20px", marginLeft: "auto" }} />
                                    </IonLabel>
                                </IonItem>
                            ))}
                        </IonList>
                    </IonCardContent>
                </IonCard>
            ))}
        </div>
    );
};

export default Loader;
