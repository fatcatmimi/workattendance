import React from 'react';
import { Tabs } from 'antd'
import Detail from '../Detail/Detail';

import HumanProperty from '../HumanProperty/HumanProperty'
import HumanPropertyLogin from '../HumanProperty/HumanPropertyLogin'

import StageCoefficient from '../StageCoefficient/StageCoefficient'
import CommonCoefficient from '../CommonCoefficient/CommonCoefficient'
import cookie from 'react-cookies'
const { TabPane } = Tabs;
export default class Tablayout extends React.Component {
    state = {
        isLogin: false
    }

    componentDidMount() {
        if (cookie.load('wnPersonId')) {
            window.personId = parseInt(cookie.load('wnPersonId'))
        } else {
            console.error('未登录')
        }
    }

    updateLogin = isLogin => {
        this.setState({
            isLogin
        })
    }

    render() {
        const { isLogin } = this.state;

        return <>
            <Tabs type="card">
                <TabPane tab="苦劳明细" key="1">
                    <Detail />
                </TabPane>
                {/* <TabPane tab="系数合计" key="2">
                    <p>待开发</p>
                </TabPane> */}
                <TabPane tab="人员属性管理" key="3">
                    {/* <HumanProperty /> */}

                    {!isLogin ? <HumanPropertyLogin updateLogin={this.updateLogin} /> : <HumanProperty updateLogin={this.updateLogin} />}

                </TabPane>
                <TabPane tab="阶段系数管理" key="4">
                    <StageCoefficient />
                </TabPane>
                <TabPane tab="公共系数管理" key="5">
                    <CommonCoefficient />
                </TabPane>
            </Tabs>
        </>
    }
}