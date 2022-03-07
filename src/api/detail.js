import { sendAxios, Base } from "./sendAxios";


//获取Detail
export const getDetailData =
    (defaultMonth, stype, queryVal, personId) => sendAxios(Base + 'HardWorkSystem/interface/asynRead.php?cmd=MainDataGet', { mon: defaultMonth, stype, queryVal, personId }, 'GET')



