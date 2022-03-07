import { sendAxios, Base } from "./sendAxios";


//获取Detail
export const getCommonCoefficientData =
    (stype, upRatio, upMonth, stageRatio, personRatio) => sendAxios(Base + 'HardWorkSystem/interface/asynRead.php?cmd=PublicDataGet', { stype, upRatio, upMonth, stageRatio, personRatio }, 'GET')



