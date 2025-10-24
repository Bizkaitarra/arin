import React from 'react';
import { IonFab, IonFabButton, IonIcon, useIonActionSheet } from '@ionic/react';
import { chevronUpSharp } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { bizkaibusMenuItems, metroMenuItems, renfeMenuItems, kbusMenuItems, euskotrenMenuItems } from './Menu/menuItems';

interface FabMenuProps {
    transportType: string;
}

const FabMenu: React.FC<FabMenuProps> = ({ transportType }) => {
    const { t } = useTranslation();
    const history = useHistory();
    const [presentActionSheet] = useIonActionSheet();

    let menuItems: any[] = [];
    switch (transportType) {
        case 'Bizkaibus':
            menuItems = bizkaibusMenuItems;
            break;
        case 'Metro Bilbao':
            menuItems = metroMenuItems;
            break;
        case 'Renfe':
            menuItems = renfeMenuItems;
            break;
        case 'KBus':
            menuItems = kbusMenuItems;
            break;
        case 'Euskotren':
            menuItems = euskotrenMenuItems;
            break;
        default:
            return null;
    }

    const actionSheetButtons = menuItems.map(item => ({
        text: t(item.text),
        icon: item.icon,
        handler: () => history.push(item.path),
    }));

    return (
        <IonFab style={{ '--offset-bottom': 'calc(env(safe-area-inset-bottom, 0px) + 25px)' }} slot="fixed" vertical="bottom" horizontal="end">
            <IonFabButton color="medium" onClick={() =>
                presentActionSheet({
                    header: t('Opciones'),
                    buttons: actionSheetButtons,
                })
            }>
                <IonIcon icon={chevronUpSharp} />
            </IonFabButton>
        </IonFab>
    );
};

export default FabMenu;
