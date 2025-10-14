import React from 'react';
import { IonCard, IonCardContent, IonIcon, IonText } from '@ionic/react';
import { warningOutline } from 'ionicons/icons';
import './ErrorDisplay.css';

interface ErrorDisplayProps {
    message: string;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ message }) => {
    return (
        <IonCard color="danger" className="error-display-card">
            <IonCardContent>
                <div className="error-content">
                    <IonIcon icon={warningOutline} size="large" />
                    <IonText>
                        <p>{message}</p>
                    </IonText>
                </div>
            </IonCardContent>
        </IonCard>
    );
};

export default ErrorDisplay;
