import React from "react";
import { IonButton, IonIcon } from "@ionic/react";
import { logoPaypal } from "ionicons/icons";
import { Browser } from "@capacitor/browser";

interface PayPalDonateButtonProps {
    amount?: number; // Cantidad opcional
    message?: string; // Mensaje opcional
}

const PayPalDonateButton: React.FC<PayPalDonateButtonProps> = ({ amount, message }) => {
    const openPayPal = async () => {
        let url = "https://www.paypal.me/bizkaitarra"; // Reemplaza con tu enlace

        if (amount) {
            url += `/${amount}`; // Agrega la cantidad si está definida
        }

        if (message) {
            const encodedMessage = encodeURIComponent(message);
            url += `?message=${encodedMessage}`; // Agrega el mensaje si está definido
        }

        await Browser.open({ url });
    };

    return (
        <IonButton
            expand="full"
            color="tertiary"
            shape="round"
            size="large"
            onClick={openPayPal}
            style={{
                fontSize: "1.1rem",
                fontWeight: "bold",
                textTransform: "none"
            }}
        >
            <IonIcon slot="start" icon={logoPaypal} style={{ fontSize: "1.5rem" }} />
            {amount ? `Donar ${amount}€ con PayPal` : "Donar con PayPal"}
        </IonButton>
    );
};

export default PayPalDonateButton;
