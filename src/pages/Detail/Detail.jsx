import React from 'react';
import { Card, DatePicker, Space, Button, Table, message } from 'antd'
import { LockOutlined, CalculatorOutlined } from '@ant-design/icons';
import moment from 'moment';
import { lastMonth } from '../../tools/tools'
import { getDetailData } from '../../api/detail';
import { clickLockPersonList } from '../../tools/config'
import { EditableRow, EditableCell } from '../EditableTable/EditableTable'
import '../EditableTable/editable.css'

const { Column } = Table;

export default class Detail extends React.Component {
    state = {
        defaultMonth: lastMonth(),
        detailData: [],
        calculatData: [],
        loading: 0     //1是上面的   2是下面的
    }

    isLocked = 0      //0未锁定   1锁定
    isRight = false  //false 不能看     1能看

    componentDidMount() {
        this.getData(1)
    }

    handleLockButton = () => {
        if (!this.isLocked) {
            if (clickLockPersonList.includes(window.personId)) {
                this.getData(3)
            } else {
                message.error('无权限锁定');
            }
        } else {
            message.error('当月数据已锁定');
        }

    }

    handleCalculateButton = () => {
        this.getData(2)
    }

    handleSave = (row) => {
        const newData = [...this.state.calculatData];

        const index = newData.findIndex((item) => row.PersonId === item.PersonId);
        const item = newData[index];

        newData.splice(index, 1, { ...item, ...row });

        this.setState({
            calculatData: newData,
        }, () => {
            //发送后台更新
            const { ApplyValidOverTime, PersonId } = row
            this.getData(2, ApplyValidOverTime, PersonId)
        });
    };

    handleChangeMonth = (_moment, date) => {
        this.setState({
            defaultMonth: date
        }, () => {
            this.getData(1)
        })
    }

    getData = async (stype, queryVal = null, personId = null) => {
        stype = parseInt(stype)
        this.setState({
            loading: stype === 1 ? 1 : stype === 2 ? 2 : 0
        })

        let { defaultMonth } = this.state
        defaultMonth = defaultMonth.replace(/-/g, '');

        const data = await getDetailData(defaultMonth, stype, queryVal, personId)


        this.setState({
            loading: 0
        })


        const stateKey = stype === 1 ? 'detailData' : 'calculatData'

        this.isRight = parseInt(data.total.right) === 1
        this.isLocked = data.total.lock;

        if (data.ret === 'OK') {
            this.setState({
                [stateKey]: data.rows
            })
        } else {
            message.error(data.ret)
            this.setState({
                [stateKey]: []
            })
        }
    }

    render() {
        const { defaultMonth, detailData, calculatData, loading } = this.state
        const components = {
            body: {
                row: EditableRow,
                cell: EditableCell,
            },
        };
        return <Card title={
            <Space>
                <DatePicker
                    defaultValue={moment(defaultMonth, 'YYYY-MM')}
                    format={'YYYY-MM'} picker="month"
                    allowClear={false}
                    onChange={this.handleChangeMonth}
                />
                <Button type="primary"
                    icon={<LockOutlined />}
                    onClick={this.handleLockButton}
                    disabled={!(window.personId === 2009864 && this.isLocked === 0)}
                >一键锁定</Button>
                <Button type="primary" icon={<CalculatorOutlined />} onClick={this.handleCalculateButton}>计算</Button>
            </Space>
        } style={{ height: '100 %' }}>
            <Space direction="vertical" size={'large'}>
                <div>
                    <Table
                        dataSource={detailData}
                        pagination={false}
                        rowKey={'PersonId'}
                        loading={loading === 1}
                        scroll={{ y: 300 }}
                        size='small'
                        bordered={true}

                    >
                        <Column title="编号" dataIndex="PersonId" key="PersonId" align="center" />
                        <Column title="姓名" dataIndex="PersonName" key="PersonName" align="center" />
                        <Column title="入职时间" dataIndex="HireDate" key="HireDate" align="center" />
                        {this.isRight ?
                            <>
                                <Column title="工龄系数" dataIndex="AgeRatio" key="AgeRatio" align="center" />
                                <Column title="个人系数" dataIndex="PersonRatio" key="PersonRatio" align="center" />
                            </>
                            : null

                        }
                        <Column title="阶段系数" dataIndex="StageRatio" key="StageRatio" align="center" />
                        <Column title="工作总时长(小时)" dataIndex="AllTime" key="AllTime" align="center" />
                        <Column title="非工作日加班(时长)" dataIndex="ValidOverTime" key="ValidOverTime" align="center" />
                        <Column title="工作日额外工作(时长)" dataIndex="ExtraTime" key="ExtraTime" align="center" />
                        <Column title="应该上班总天数" dataIndex="WorkingDayCnt" key="WorkingDayCnt" align="center" />
                        <Column title="实际上班总天数" dataIndex="WorkingDayAct" key="WorkingDayAct" align="center" />
                        <Column title="正常" dataIndex="Normal" key="Normal" align="center" />
                        <Column title="缺勤" dataIndex="Absence" key="Absence" align="center" />
                        <Column title="迟到/早退" dataIndex="LateOrLeave" key="LateOrLeave" align="center" />
                        <Column title="请假" dataIndex="Holiday" key="Holiday" align="center" />
                        <Column title="出差/外出" dataIndex="TravelOrOut" key="TravelOrOut" align="center" />
                        <Column title="打卡过失" dataIndex="AttendMiss" key="AttendMiss" align="center" />
                        <Column title="最终系数" dataIndex="FinalRatio" key="FinalRatio" align="center" />
                    </Table>
                </div>
                <div style={{ marginTop: '100px' }}>
                    <Table
                        components={components}
                        dataSource={calculatData}
                        pagination={false}
                        rowKey={'PersonId'}
                        rowClassName={() => 'editable-row'}
                        loading={loading === 2}
                        // scroll={{ y: 1000 }}
                        size='small'
                        bordered={true}
                    >
                        <Column title="编号" dataIndex="PersonId" key="PersonId" align="center" />
                        <Column title="姓名" dataIndex="PersonName" key="PersonName" align="center" />
                        <Column title="苦劳系数" dataIndex="FinalRatio" key="FinalRatio" align="center" />
                        <Column title="可申报非工作日加班(时长)"
                            dataIndex="ApplyValidOverTime"
                            key="ApplyValidOverTime"
                            align="center"
                            onCell={(record) => {
                                return {
                                    record,
                                    editable: parseInt(this.isLocked) === 0 && clickLockPersonList.includes(window.personId),
                                    dataIndex: 'ApplyValidOverTime',
                                    title: "可申报非工作日加班(时长)",
                                    handleSave: this.handleSave
                                }
                            }}
                        />
                        <Column title="可申报工作日加班(时长)" dataIndex="ApplyExtraTime" key="ApplyExtraTime" align="center" />
                        <Column title="校验1(非工作日加班实际-可申报)" dataIndex="ApplyValidOverTimeAct1" key="ApplyValidOverTimeAct1" align="center" />
                        <Column title="校验2(工作日额外加班实际-可申报)" dataIndex="ApplyExtraTimeAct2" key="ApplyExtraTimeAct2" align="center" />
                        <Column title="校验3(系数反算)" dataIndex="SideRatio" key="SideRatio" align="center" />
                    </Table>
                </div>
            </Space>
        </Card>
    }
}