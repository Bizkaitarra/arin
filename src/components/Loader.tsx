import React from "react";
import { IonSpinner } from "@ionic/react";

type LoaderProps = {
    serviceName: string;
    reloading: boolean;
};

const Loader: React.FC<LoaderProps> = ({ serviceName, reloading }) => {
    return (
        <div className="flex flex-col items-center justify-center h-full">
            <p className="mt-4 text-lg font-medium text-gray-700">
                {reloading && "Estamos actualizando los datos para todas tus paradas seleccionadas. "}
                Tómatelo con calma ☕️, {serviceName} se toma su ⏱️
            </p>
            <IonSpinner name="dots" className="text-primary" />
        </div>
    );
};

export default Loader;
