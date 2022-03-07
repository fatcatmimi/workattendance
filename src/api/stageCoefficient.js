import { sendAxios, Base } from "./sendAxios";


//获取Detail
export const getStageCoefficientData =
    (stype, start = null, end = null, stageRatio = null, id = null) =>
        sendAxios(Base + 'HardWorkSystem/interface/asynRead.php?cmd=StageDataGet',
            { stype, start, end, stageRatio, id }, 'GET')