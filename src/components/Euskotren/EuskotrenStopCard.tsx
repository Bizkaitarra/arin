import React from 'react';
import { IonItem, IonLabel, IonIcon } from '@ionic/react';
import { star, starOutline } from 'ionicons/icons';
import { EuskotrenStop } from '../../services/Euskotren/EuskotrenStorage';
import './EuskotrenStopCard.css';

interface EuskotrenStopCardProps {
    station: EuskotrenStop;
    onFavoriteToggle: (station: EuskotrenStop) => void;
}

const EuskotrenStopCard: React.FC<EuskotrenStopCardProps> = ({ station, onFavoriteToggle }) => {
    return (
        <IonItem className="euskotren-stop-card">
            <IonLabel>
                <h2>{station.Name}</h2>
                <p>{station.Lines.join(', ')}</p>
            </IonLabel>
            <IonIcon
                icon={station.IsFavorite ? star : starOutline}
                slot="end"
                color={station.IsFavorite ? 'warning' : 'medium'}
                onClick={() => onFavoriteToggle(station)}
            />
        </IonItem>
    );
};

export default EuskotrenStopCard;
