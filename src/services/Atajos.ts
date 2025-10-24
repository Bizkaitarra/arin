export const TRANSPORTES = [
    { id: "bizkaibus", label: "Bizkaibus" },
    { id: "metro", label: "Metro Bilbao" },
    { id: "kbus", label: "KBus" },
    { id: "renfe", label: "Renfe" },
    { id: "euskotren", label: "Euskotren" }
];


const presetToAtajos = (preset: string): string[] => {
    switch (preset) {
        case "bizkaibus_metro":
            return ["bizkaibus", "metro"];
        case "bizkaibus_kbus":
            return ["bizkaibus", "kbus"];
        case "metro_kbus":
            return ["metro", "kbus"];
        case "bizkaibus_metro_kbus":
            return ["bizkaibus", "metro", "kbus"];
        case "bizkaibus":
            return ["bizkaibus"];
        case "metro":
            return ["metro"];
        case "kbus":
            return ["kbus"];
        case "renfe":
            return ["renfe"];
        case "ninguno":
        default:
            return [];
    }
};

export const getSelectedVisores = (
    settings: any,
    updateSettings?: (data: any) => void,
): string[] => {
    if (Array.isArray(settings.atajos)) {
        return settings.atajos;
    } else if (typeof settings.visores === "string") {
        const converted = presetToAtajos(settings.visores);
        if (updateSettings) {
            updateSettings({ atajos: converted });
        }
        return converted;
    } else {
        return [];
    }
};