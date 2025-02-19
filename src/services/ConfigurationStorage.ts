import { Preferences } from "@capacitor/preferences";

const SETTINGS_KEY = "user_settings";

export const loadSettings = async () => {
    const storedSettings = await Preferences.get({ key: SETTINGS_KEY });
    return storedSettings.value ? JSON.parse(storedSettings.value) : null;
};

export const saveSettings = async (settings: any) => {
    await Preferences.set({
        key: SETTINGS_KEY,
        value: JSON.stringify(settings),
    });
};
