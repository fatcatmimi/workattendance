import React from 'react'
import { Card, Table, DatePicker, Space, Button, message, Modal, Form, InputNumber } from 'antd'
import moment from 'moment'
import { getStageCoefficientData } from '../../api/stageCoefficient'
import { PlusOutlined } from '@ant-design/icons';

const { Column } = Table
const { RangePicker } = DatePicker;

export default class StageCoefficient extends React.Component {
    dateRef = React.createRef()
    formRef = React.createRef();

    state = {
        data: [],
        date: ['2022-01-01', '2022-12-31']
    }

    componentDidMount() {
        this.handleSearch()
    }

    getData = (stype) => {
        let { date: [start, end] } = this.state
        start = start.replace(/-/g, '');
        end = end.replace(/-/g, '');
        return getStageCoefficientData(stype, start, end, null, null)
    }

    handleAutoCreate = async () => {
        const result = await getStageCoefficientData(2, null, null, null, null)
        if (result.ret === 'OK') {
            message.success('自动生成成功')
        } else {
            message.error(result.ret)
        }
    }

    handleChange = (_dates, dateStrings) => {
        this.setState({
            date: dateStrings
        })
    }

    handleSearch = async () => {
        const result = await this.getData(1)
        this.lock = parseInt(result.total.lock) === 1
        if (result.ret === 'OK') {
            this.setState({
                data: result.rows
            })
        }
    }
    handleDelete = async (record) => {
        const result = await getStageCoefficientData(3, null, null, null, record.Id)
        if (result.ret === 'OK') {
            this.handleSearch()
        } else {
            message.error(result.ret)
        }
    }

    handleAdd = () => {
        Modal.confirm({
            title: '阶段系数管理',
            centered: true,
            content: <Form
                ref={this.formRef}
            >
                <Form.Item
                    name="startAndEndDate"
                    label="起止时间"
                    rules={[{ required: true, message: '请输入起止时间!' }]}
                >
                    <RangePicker />
                </Form.Item>
                <Form.Item
                    name="stageRatio"
                    label="阶段系数"
                    rules={[{ required: true, message: '请输入阶段系数!' }]}
                >
                    <InputNumber min={0} max={1} />
                </Form.Item>
            </Form>,
            onOk: () => {
                return new Promise(async (resolve, reject) => {
                    try {
                        const values = await this.formRef.current.validateFields()
                        let { stageRatio, startAndEndDate: [start, end] } = values
                        start = start.format('YYYY-MM-DD')
                        end = end.format('YYYY-MM-DD')
                        const result = await getStageCoefficientData(4, start, end, stageRatio, null);
                        if (result.ret === 'OK') {
                            this.handleSearch()
                            resolve()
                        } else {
                            message.error(result.ret)
                            reject()
                        }
                    } catch (e) {
                        reject()
                    }

                })
            }
        })
    }

    render() {
        const { data, date } = this.state
        return (
            <Card title={
                <Space>
                    <RangePicker
                        defaultValue={[moment(date[0]), moment(date[1])]}
                        onChange={this.handleChange}
                    />
                    <Button type='primary' onClick={this.handleSearch}>查询</Button>
                    <Button type='primary' onClick={this.handleAutoCreate} disabled={this.lock}>自动生成</Button>
                    <Button type='primary' icon={<PlusOutlined />} onClick={this.handleAdd}>添加</Button>
                </Space>

            }>
                <Table style={{ width: 700 }}
                    dataSource={data}
                    rowKey='Id'
                    pagination={false}
                    size="small"
                >
                    <Column title="开始时间" dataIndex="StartDate" key="StartDate" align="center" width={150} />
                    <Column title="结束时间" dataIndex="EndDate" key="EndDate" align="center" width={150} />
                    <Column title="阶段系数" dataIndex="StageRatio" key="StageRatio" align="center" width={150} />
                    <Column title="操作" align="center" render={(record) =>
                        <Button type='danger' size={'small'} onClick={() => this.handleDelete(record)}>删除</Button>
                    } />
                </Table>
            </Card>
        )
    }
}