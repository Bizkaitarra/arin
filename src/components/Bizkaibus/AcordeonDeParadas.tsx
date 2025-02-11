import React, { useState } from 'react';
import { Accordion, AccordionSummary, AccordionDetails, List, ListItem, ListItemText, TextField } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { Municipio, Parada } from "../../services/BizkaibusStorage";
import './AcordeonDeParadas.css';

interface AcordeonDeParadasProps {
    paradas: Parada[];
    onMunicipioClick: (municipio: Municipio) => void;
}

const AcordeonDeParadas: React.FC<AcordeonDeParadasProps> = ({ paradas, onMunicipioClick }) => {
    const provincias = paradas.reduce((acc: { [key: string]: Parada[] }, parada) => {
        const { PROVINCIA, MUNICIPIO } = parada;
        let index = PROVINCIA !== '48' ? "1" : "0";

        if (!acc[index]) {
            acc[index] = [];
        }

        const municipioExiste = acc[index].some(item => item.MUNICIPIO === MUNICIPIO);
        if (!municipioExiste) {
            acc[index].push(parada);
        }

        return acc;
    }, {});

    Object.keys(provincias).forEach((provincia) => {
        provincias[provincia].sort((a, b) => a.DESCRIPCION_MUNICIPIO.localeCompare(b.DESCRIPCION_MUNICIPIO));
    });

    const [searchTerms, setSearchTerms] = useState<{ [key: string]: string }>({ "0": "", "1": "" });

    const handleSearchChange = (provincia: string, value: string) => {
        setSearchTerms(prev => ({ ...prev, [provincia]: value }));
    };

    return (
        <div className="acordeon-container">
            <p>Para poder añadir paradas a favoritas seleccione un municipio</p>
            {Object.keys(provincias).map((provincia) => {
                const filteredMunicipios = provincias[provincia].filter(municipio =>
                    municipio.DESCRIPCION_MUNICIPIO.toLowerCase().includes(searchTerms[provincia].toLowerCase())
                );

                return (
                    <Accordion key={provincia} className="acordeon">
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon className="expand-icon" />}
                            aria-controls={`panel-${provincia}-content`}
                            id={`panel-${provincia}-header`}
                        >
                            <h3 className="provincia-nombre">
                                {provincia === "0" ? "Municipios de Bizkaia" : "Otros municipios"}
                            </h3>
                        </AccordionSummary>
                        <AccordionDetails>
                            <TextField
                                fullWidth
                                label="Buscar municipio"
                                variant="outlined"
                                size="small"
                                value={searchTerms[provincia]}
                                onChange={(e) => handleSearchChange(provincia, e.target.value)}
                                className="municipio-busqueda"
                            />
                            <List>
                                {filteredMunicipios.map((municipio, index) => (
                                    <ListItem
                                        key={index}
                                        className="municipio-item"
                                        onClick={() => onMunicipioClick({
                                            PROVINCIA: municipio.PROVINCIA,
                                            DESCRIPCION_PROVINCIA: municipio.DESCRIPCION_PROVINCIA,
                                            MUNICIPIO: municipio.MUNICIPIO,
                                            DESCRIPCION_MUNICIPIO: municipio.DESCRIPCION_MUNICIPIO,
                                        })}
                                    >
                                        <ListItemText
                                            primary={
                                                provincia === "1"
                                                    ? `${municipio.DESCRIPCION_MUNICIPIO} (${municipio.DESCRIPCION_PROVINCIA})`
                                                    : municipio.DESCRIPCION_MUNICIPIO
                                            }
                                        />
                                        <ChevronRightIcon className="municipio-arrow" />
                                    </ListItem>
                                ))}
                            </List>
                        </AccordionDetails>
                    </Accordion>
                );
            })}
        </div>
    );
};

export default AcordeonDeParadas;
