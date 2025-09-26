import RenfeStopTitle from "../StopTitle/RenfeStopTitle";
import {RenfeStop} from "../../../services/Renfe/RenfeStop";

interface StopResumeProps {
    stop: RenfeStop;
}

const RenfeStopResume: React.FC<StopResumeProps> = ({stop}) => {
    return (
        <>
            <RenfeStopTitle stop={stop}/>
        </>
    );
};

export default RenfeStopResume;