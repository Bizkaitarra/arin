import Page from "../Page";
import {settingsOutline} from "ionicons/icons";
import {KBusStorage} from "../../services/KBus/KBusStorage";
import MyDisplays from "../../components/MyDisplays/MyDisplays";
import {useTranslation} from "react-i18next";
import {KBUS_TYPE} from "../../services/StopType";

const BizkaibusMyDisplays: React.FC = () => {
    const { t } = useTranslation();
    return (
        <Page title={`${t('Mis visores')}`} icon={settingsOutline}>
            <MyDisplays storageService={new KBusStorage()} stopType={KBUS_TYPE}/>
        </Page>
    );
};

export default BizkaibusMyDisplays;
