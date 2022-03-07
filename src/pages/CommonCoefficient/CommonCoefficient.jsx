import { useState, useEffect } from 'react'
import { Card, Table, Button, message, Modal, Form, InputNumber } from 'antd'
import { getCommonCoefficientData } from '../../api/commonCoefficient'
const { Column, ColumnGroup } = Table

export default function CommonCoefficient() {
    const [data, setData] = useState([])
    const [form] = Form.useForm();
    useEffect(() => {
        getData()
    }, [])

    const handleEdit = () => {
        Modal.confirm({
            title: '公共系数管理',
            centered: true,
            width: 350,
            content: <Form
                form={form}
                labelAlign={'right'}
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 8 }}
                preserve={false}
            >
                <Form.Item
                    label="增长月"
                    name="upMonth"
                    rules={[{ required: true, message: '请输入!' }]}
                >
                    <InputNumber />
                </Form.Item>
                <Form.Item
                    label="增长值"
                    name="upRatio"
                    rules={[{ required: true, message: '请输入!' }]}
                >
                    <InputNumber />
                </Form.Item>
                <Form.Item
                    label="个人系数"
                    name="personRatio"
                    rules={[{ required: true, message: '请输入!' }]}
                >
                    <InputNumber />
                </Form.Item>
                <Form.Item
                    label="阶段系数"
                    name="stageRatio"
                    rules={[{ required: true, message: '请输入!' }]}
                >
                    <InputNumber />
                </Form.Item>
            </Form >,
            onOk: () => {
                return new Promise(async (resolve, reject) => {
                    try {
                        const values = await form.validateFields();

                        const result = await editData(values)

                        if (result.ret === 'OK') {
                            resolve()
                            getData()
                        } else {
                            message.error(result.ret)
                        }
                    } catch (e) {
                        reject()
                    }

                })
            }
        })
    }

    const editData = ({ upMonth, upRatio, personRatio, stageRatio }) => {
        return getCommonCoefficientData(2, upRatio, upMonth, stageRatio, personRatio)
    }


    const getData = async () => {
        const result = await getCommonCoefficientData(1)
        if (result.ret === 'OK') {
            setData(result.rows)
        } else {
            message.error(result.ret)
        }
    }


    return (
        <Card title={<Button type="primary" onClick={handleEdit}>修改</Button>}>
            <Table dataSource={data}
                style={{ width: 500 }}
                rowKey='StageRatio'
                pagination={false}
                bordered={true}
            >
                <ColumnGroup title="工龄系数">
                    <Column title="增长月" dataIndex="UpMonth" key="UpMonth" />
                    <Column title="增长值" dataIndex="UpRatio" key="UpRatio" />
                </ColumnGroup>
                <Column title='个人系数' dataIndex="PersonRatio" key="PersonRatio" />
                <Column title='阶段系数' dataIndex="StageRatio" key="StageRatio" />
            </Table>
        </Card>
    )
}