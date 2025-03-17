import { InAppReview } from "@capacitor-community/in-app-review";
import { Capacitor } from "@capacitor/core";
import { Browser } from "@capacitor/browser";

const APP_ID = "bizkaitarra.arin";

export const requestReview = async () => {
    if (Capacitor.getPlatform() === "android") {
        try {
            const { value } = await InAppReview.requestReview();
            console.log("In-App Review mostrado:", value);
        } catch (error) {
            console.error("Error al solicitar la valoración:", error);
        }
    } else {
        // Si está en web, abrir la página de Google Play en una nueva pestaña
        const url = `https://play.google.com/store/apps/details?id=${APP_ID}`;
        await Browser.open({ url });
    }
};
