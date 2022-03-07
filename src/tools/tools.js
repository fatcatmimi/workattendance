import moment from "moment"
export const lastMonth = () => moment().subtract(1, 'month').startOf('month').format('YYYY-MM')