import React from "react";
import { IonSpinner } from "@ionic/react";
import { useTranslation } from "react-i18next";

type LoaderProps = {
    serviceName: string;
    reloading: boolean;
};

const Loader: React.FC<LoaderProps> = ({ serviceName, reloading }) => {
    const { t } = useTranslation();

    const getMessage = () => {
        if (serviceName === "GPS") {
            return t("Intentando obtener la localización...");
        }
        return t("Obteniendo datos de {{serviceName}}, espera un momento...", { serviceName });
    };

    return (
        <div className="flex flex-col items-center justify-center h-full">
            <p className="mt-4 text-lg font-medium text-gray-700">
                {getMessage()}
            </p>
            <IonSpinner name="dots" className="text-primary" />
        </div>
    );
};

export default Loader;
