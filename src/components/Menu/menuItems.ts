import {
    addCircleOutline,
    addCircleSharp,
    cashOutline,
    listOutline,
    searchOutline,
    timeOutline
} from "ionicons/icons";

export const bizkaibusMenuItems = [
    {
        text: 'Mis visores',
        icon: listOutline,
        path: '/bizkaibus-my-displays',
        id: 'bizkaibus-my-displays'
    },
    {
        text: 'Añadir parada por pueblo',
        icon: addCircleOutline,
        path: '/bizkaibus-add-stop-by-town',
        id: 'bizkaibus-add-by-town'
    },
    {
        text: 'Añadir parada por localización',
        icon: addCircleSharp,
        path: '/bizkaibus-add-stop-by-location',
        id: 'bizkaibus-add-by-location'
    },
    {
        text: 'Ver líneas',
        icon: searchOutline,
        path: '/bizkaibus-search-lines',
        id: 'bizkaibus-search-lines'
    },
];

export const metroMenuItems = [
    {
        text: 'Mis visores',
        icon: listOutline,
        path: '/metro-bilbao-my-displays',
        id: 'metro-my-displays'
    },
    {
        text: 'Añadir parada de Metro',
        icon: addCircleOutline,
        path: '/metro-bilbao-add-stop',
        id: 'metro-add-stop'
    },
    {
        text: 'Añadir viaje',
        icon: addCircleSharp,
        path: '/metro-bilbao-add-route',
        id: 'metro-add-trip'
    },
    {
        text: 'Buscar a otras horas',
        icon: timeOutline,
        path: '/metro-bilbao-trip-planner',
        id: 'metro-trip-planner'
    },
    {
        text: 'Tarifas',
        icon: cashOutline,
        path: '/metro-bilbao-tarifas',
        id: 'metro-fares'
    },
];

export const renfeMenuItems = [
    {
        text: 'Mis visores',
        icon: listOutline,
        path: '/renfe-my-displays',
        id: 'renfe-my-displays'
    },
    {
        text: 'Añadir viaje',
        icon: addCircleOutline,
        path: '/renfe-add-route',
        id: 'renfe-add-trip'
    },
];

export const kbusMenuItems = [
    {
        text: 'Mis visores',
        icon: listOutline,
        path: '/k-bus-my-displays',
        id: 'kbus-my-displays'
    },
    {
        text: 'Añadir parada',
        icon: addCircleOutline,
        path: '/k-bus-add-stop',
        id: 'kbus-add-stop'
    },
];
