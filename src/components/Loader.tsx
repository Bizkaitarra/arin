import React from "react";
import AppLoader from "./AppLoader";

interface LoaderProps {
    serviceName: string;
    reloading: boolean;
}

const Loader: React.FC<LoaderProps> = ({ serviceName, reloading }) => {
    return <AppLoader serviceName={serviceName} reloading={reloading} />;
};

export default Loader;
