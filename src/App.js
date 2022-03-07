import React from "react";
import 'moment/locale/zh-cn';
import 'antd/dist/antd.css';
import { ConfigProvider } from 'antd'
import zhCN from 'antd/lib/locale/zh_CN';
import TabLayout from './pages/TabLayout/TabLayout'

function App() {
  return (
    <ConfigProvider locale={zhCN}>
      <TabLayout />
    </ConfigProvider>
  );
}

export default App;
