import {IonButton} from "@ionic/react";




const ArinRideBeacon = (props: any) => {
    return (
        <IonButton
            onClick={props.handleClick}
            style={{
                width: '20px',
                height: '20px',
                borderRadius: '50%',
                backgroundColor: '#007bff',
                boxShadow: '0 0 10px rgba(0, 123, 255, 0.7)',
                animation: 'pulse 1.5s infinite',
                padding: 0,
                minHeight: 0,
                minWidth: 0,
            }}
        />
    );
};

export default ArinRideBeacon;
