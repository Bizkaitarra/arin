import React, { useState, useEffect } from "react";
import {useHistory, useParams} from "react-router-dom";
import {
    IonPage,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButtons,
    IonMenuButton,
    IonIcon,
    IonButton
} from "@ionic/react";
import {ConsultaHorario, loadHorarios} from "../../services/ApiBizkaibus";
import ConsultaHorarioViewer from "../../components/Bizkaibus/ConsultaHorarioViewer";
import {settingsOutline, timerOutline} from "ionicons/icons";
import NavigationTabs from "../../components/NavigationTabs";

interface RouteParams {
    parada: string; // El parámetro de la parada desde la URL
}

const BizkaibusHorarioPage: React.FC = () => {
    const { parada } = useParams<RouteParams>(); // Obtener el parámetro de la URL
    const [horarios, setHorarios] = useState<ConsultaHorario[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const history = useHistory();

    // Cuando el parámetro de parada cambie, cargar los horarios correspondientes
    useEffect(() => {
        if (parada) {
            const fetchHorarios = async () => {
                setLoading(true);
                setError(null);
                try {
                    const data = await loadHorarios(parada); // Obtener los horarios usando la API
                    setHorarios(data);
                } catch (err) {
                    setError("Error al obtener los horarios.");
                } finally {
                    setLoading(false);
                }
            };
            fetchHorarios();
        }
    }, [parada]); // Solo volver a ejecutar si el número de parada cambia

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonMenuButton />
                    </IonButtons>
                    <IonTitle><IonIcon icon={timerOutline} /> Horarios Bizkaibus</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent className="ion-padding">
                <NavigationTabs />
                <IonButton color="secondary" onClick={() => history.push(`/bizkaibus-viewers`)}>
                    Volver a visores <IonIcon icon={timerOutline} />
                </IonButton>
                <div style={{ padding: "20px" }}>
                    <h2>Horarios de la parada: {parada}</h2>
                    {loading && <p>Obteniendo información de Bizkabus, espera con un ☕️...</p>}
                    {error && <p>{error}</p>}
                    {horarios.length > 0 && <ConsultaHorarioViewer horarios={horarios} />}
                </div>
            </IonContent>
        </IonPage>
    );
};

export default BizkaibusHorarioPage;
