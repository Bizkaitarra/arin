import {IonButton, IonCard, IonCardContent, IonCardHeader, IonCardTitle} from "@ionic/react";

const ArinRideTooltip = ({ step, primaryProps, skipProps, backProps, closeProps }) => {
    return (
        <IonCard style={{ padding: '16px', backgroundColor: '#1e1e1e', color: '#fff' }}>
            <IonCardHeader>
                <IonCardTitle>{step.title}</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
                <p>{step.content}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '16px' }}>
                    <IonButton {...backProps} color="medium">
                        Atrás
                    </IonButton>
                    <IonButton {...skipProps} color="danger">
                        Saltar
                    </IonButton>
                    <IonButton {...primaryProps} color="success">
                        {step.index === step.totalSteps - 1 ? 'Finalizar' : 'Siguiente'}
                    </IonButton>
                </div>
            </IonCardContent>
        </IonCard>
    );
};
export default ArinRideTooltip;
