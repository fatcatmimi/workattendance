import { sendAxios, Base } from "./sendAxios";


//获取Detail
export const getHumanPropertyData =
    (stype, queryName = null, queryVal = null, personId = null) => sendAxios(Base + 'HardWorkSystem/interface/asynRead.php?cmd=ManageDataGet', { stype, queryName, queryVal, personId }, 'GET')

export const getHumanPropertyLogin =
    (passWord) => sendAxios(Base + "HardWorkSystem/interface/asynRead.php?cmd=getRight", { passWord }, 'GET')
