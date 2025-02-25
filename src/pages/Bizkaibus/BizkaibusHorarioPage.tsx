import React, {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {ConsultaHorario, loadHorarios} from "../../services/ApiBizkaibus";
import ConsultaHorarioViewer from "../../components/Bizkaibus/ConsultaHorarioViewer";
import {timerOutline} from "ionicons/icons";
import Page from "../Page";
import {useTranslation} from "react-i18next";

interface RouteParams {
    line: string;
}

const BizkaibusHorarioPage: React.FC = () => {
    const {t} = useTranslation();
    const { line } = useParams<RouteParams>(); // Obtener el parámetro de la URL
    const [horarios, setHorarios] = useState<Record<string, ConsultaHorario[]>>();
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    // Cuando el parámetro de parada cambie, cargar los horarios correspondientes
    useEffect(() => {
        if (line) {
            const fetchHorarios = async () => {
                setLoading(true);
                setError(null);
                try {
                    const data = await loadHorarios(line); // Obtener los horarios usando la API
                    const groupedHorarios = data.reduce((acc, horario) => {
                        if (!acc[horario.TRTipoRuta]) {
                            acc[horario.TRTipoRuta] = [];
                        }
                        acc[horario.TRTipoRuta].push(horario);
                        return acc;
                    }, {} as Record<string, ConsultaHorario[]>);
                    setHorarios(groupedHorarios);
                } catch (err) {
                    setError(t("Error al obtener los horarios."));
                } finally {
                    setLoading(false);
                }
            };
            fetchHorarios();
        }
    }, [line]); // Solo volver a ejecutar si el número de parada cambia

    return (
        <Page title="Horario de línea" icon={timerOutline} internalPage={true}>
                <div style={{ padding: "20px" }}>
                    {loading && <p>{t('Obteniendo información de Bizkabus, espera con un ☕️...')}</p>}
                    {error && <p>{error}</p>}
                    {horarios && Object.keys(horarios).length > 0 && <ConsultaHorarioViewer horarios={horarios} />}
                </div>
        </Page>
    );
};

export default BizkaibusHorarioPage;
