import { InAppReview } from "@capacitor-community/in-app-review";
import { Capacitor } from "@capacitor/core";
import { Browser } from "@capacitor/browser";

const APP_ID = "bizkaitarra.arin";

export const requestReview = async () => {
    if (Capacitor.getPlatform() === "android") {
        try {
            await InAppReview.requestReview();
        } catch (error) {
            console.error("Error al solicitar la valoración:", error);
        }
    } else {
        const url = `https://play.google.com/store/apps/details?id=${APP_ID}`;
        await Browser.open({ url });
    }
};
