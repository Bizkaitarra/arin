import React, {useEffect, useState} from 'react';
import Joyride, {CallBackProps, Step} from 'react-joyride';
import ArinRideTooltip from "./ArinRideTooltip";
import ArinRideBeacon from "./ArinRideBeacon";

interface ArinRideProps {
    onMenuOpen: (isOpen: boolean) => void;
    showModal: boolean;
}

const ArinRide: React.FC<ArinRideProps> = ({ onMenuOpen, showModal }) => {
    const [run, setRun] = useState(false);
    const [modelChangeRequired, setModelChangeRequired] = useState(false);

    const steps: Step[] = [
        {
            target: '.bizkaibus-fast-tab',
            content: 'Aquí podrás acceder a los visores de Bizkaibus de manera rápida.',
            data: { actionOpenMenu: false },  // Este paso no necesita que el menú esté abierto
        },
        {
            target: '.metro-bilbao-fast-tab',
            content: 'Aquí puedes acceder a Metro Bilbao de manera rápida.',
            data: { actionOpenMenu: false },  // Este paso no necesita que el menú esté abierto
        },
        {
            target: '.bizkaibus-header-icon',
            content: 'Aquí podrás ver si estás en una pantalla de Bizkaibus o Metro Bilbao.',
            data: { actionOpenMenu: false },  // Este paso no necesita que el menú esté abierto
        },
        {
            target: '#open-menu',
            content: 'Aquí puedes abrir el menú para navegar por la configuración.',
            data: { actionOpenMenu: false },  // Este paso necesita que el menú esté abierto
        },
        {
            target: '#arin-header-title',
            content: 'Vamos a explicar el menú.',
            data: { actionOpenMenu: true },  // Este paso necesita que el menú esté abierto
        },
        {
            target: '#menu-visores-bizkaibus',
            content: 'Aquí puedes volver a los visores de Bizkaibus.',
            data: { actionOpenMenu: false },  // Este paso necesita que el menú esté abierto
        },
        {
            target: '#menu-add-bizkaibus',
            content: 'Aquí podrás añadir paradas favoritas para ver en los visores de Bizkaibus.',
            data: { actionOpenMenu: false },  // Este paso necesita que el menú esté abierto
        },
        {
            target: '#menu-manage-bizkaibus',
            content: 'Aquí podrás ordenar y eliminar tus paradas favoritas de Bizkaibus.',
            data: { actionOpenMenu: false },  // Este paso necesita que el menú esté abierto
        },
        {
            target: '#menu-title-metro-bilbao',
            content: 'En esta sección tienes las mismas opciones que en Bizkaibus pero para Metro Bilbao',
            data: { actionOpenMenu: false },  // Este paso necesita que el menú esté abierto
        },
        {
            target: '#menu-configuration',
            content: 'Aquí podrás configurar la aplicación a tu gusto. Quitar visores, cambiar idioma, etc.',
            data: { actionOpenMenu: false },  // Este paso necesita que el menú esté abierto
        },
        {
            target: '#arin-header-title',
            content: 'Ya sabes lo básico. Añade tus estaciones para empezar a funcionar.',
            data: { actionCloseMenu: true },  // Este paso necesita que el menú esté abierto
        },
    ];

    const handleJoyrideCallback = (data: CallBackProps) => {
        console.log(data);
        if (data.index === 0) {

        }

        const actionOpenMenu = data.step.data.actionOpenMenu
        console.log("actionOpenMenu", actionOpenMenu);
        if (actionOpenMenu && !showModal) {
            setRun(false);
            onMenuOpen(true);
            setModelChangeRequired(true);
        }
        const actionCloseMenu = data.step.data.actionCloseMenu

        if (actionCloseMenu && showModal) {
            setRun(false);
            onMenuOpen(false);
            setModelChangeRequired(true);
        }
    };

    useEffect(() => {
        console.log("showModal", showModal);
        console.log(modelChangeRequired);
        if (modelChangeRequired) {
            setRun(true);
            setModelChangeRequired(false);
        }

    }, [showModal]);


    return (
        <>
            <button
                onClick={() => setRun(true)}
                className="fixed bottom-4 right-4 bg-blue-600 text-white px-4 py-2 rounded-full shadow-lg"
            >
                Empezar Tutorial
            </button>
        <Joyride
            steps={steps}
            run={run}
            continuous
            showProgress
            showSkipButton
            callback={handleJoyrideCallback}
            tooltipComponent={ArinRideTooltip}

            styles={{
                options: {
                    zIndex: 10000,
                    primaryColor: '#007bff',
                    textColor: '#fff',
                    arrowColor: '#007bff',
                    backgroundColor: '#1e1e1e',
                },
                buttonNext: {
                    borderRadius: '20px',
                    backgroundColor: '#28a745',
                    padding: '8px 16px',
                },
                buttonBack: {
                    marginRight: 10,
                    borderRadius: '20px',
                    backgroundColor: '#6c757d',
                    color: '#fff',
                },
                buttonSkip: {
                    backgroundColor: '#dc3545',
                    color: '#fff',
                },
            }}
            locale={{
                back: 'Atrás',
                close: 'Cerrar',
                last: 'Finalizar tutorial',
                next: 'Siguiente →',
                skip: 'Saltar tutorial',
            }}
        />
        </>
    );
};

export default ArinRide;
