import Page from "../Page";
import {settingsOutline} from "ionicons/icons";
import {useTranslation} from "react-i18next";
import {RENFE_TYPE} from "../../services/StopType";
import {RenfeStorage} from "../../services/Renfe/RenfeStorage";
import MyDisplays from "../../components/Renfe/MyDisplays/MyDisplays";

const RenfeMyDisplays: React.FC = () => {
    const { t } = useTranslation();
    return (
        <Page title={`${t('Mis visores')}`} icon={settingsOutline}>
            <MyDisplays storageService={new RenfeStorage()} stopType={RENFE_TYPE}/>
        </Page>
    );
};

export default RenfeMyDisplays;
