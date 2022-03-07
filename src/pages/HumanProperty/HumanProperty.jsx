import React from 'react'
import { Button, Card, Table, Modal, InputNumber, message, Popconfirm } from 'antd'
import { EditableRow, EditableCell } from '../EditableTable/EditableTable'
import { getHumanPropertyData } from '../../api/humanProperty'
import './HumanProperty.css'
import '../EditableTable/editable.css'
import { PlusOutlined } from '@ant-design/icons';


const { Column } = Table;
export default class HumanProperty extends React.Component {
    inputRef = React.createRef()
    state = {
        data: [],
        password: '',
    }
    passwordRef = React.createRef();

    componentDidMount() {
        this.getData(1).then(result => {
            if (result.ret === 'OK') {
                this.setState({
                    data: result.rows
                })
            }
        })
    }

    handleLogOut = () => {
        this.props.updateLogin(false)
    }

    handleAdd = () => {
        const modal = Modal.confirm();
        modal.update({
            width: 400,
            title: '人员属性管理',
            content: <>
                请输入卡号:<InputNumber style={{ width: '150px' }} autoFocus={true}
                    formatter={
                        (value) => value.replace(/\./g, '')
                    }
                    ref={this.inputRef}
                />
            </>,
            centered: true,
            onOk: () => {
                return new Promise(async (resolve, reject) => {
                    const newPersonId = this.inputRef.current.value
                    if (newPersonId.trim()) {
                        const result = await getHumanPropertyData(4, null, null, newPersonId)
                        if (result.ret === 'OK') {
                            message.success('添加成功')
                            this.getData(1).then(data => {
                                if (data.ret === 'OK') {
                                    this.setState({
                                        data: data.rows
                                    })
                                } else {
                                    message.error(result.ret)
                                }
                            })
                            resolve()

                        } else {
                            message.error(result.ret)
                            reject('添加卡号失败!!!')
                        }
                    } else {
                        message.error('请输入卡号!!!');
                        reject('请输入卡号!!!')
                    }

                })
            }
        })
    }

    getData = (stype, queryName = null, queryVal = null, personId = null) => {
        return getHumanPropertyData(stype, queryName, queryVal, personId);
    }



    handleSave = async (row, editName) => {
        const newData = [...this.state.data];

        const index = newData.findIndex((item) => row.PersonId === item.PersonId);

        const item = newData[index];

        newData.splice(index, 1, { ...item, ...row });

        let queryVal = row[editName];
        const personId = row['PersonId'];

        if (editName === 'HireDateChange') {
            queryVal = queryVal.format('YYYY-MM-DD')
        }

        const result = await this.getData(2, editName, queryVal, personId)
        if (result.ret === 'OK') {
            this.getData(1).then((data) => {
                this.setState({
                    data: data.rows
                })
            })
        } else {
            message.error(result.ret)
        }
        // this.setState({
        //     data: newData,
        // }, async () => {
        //     //发送后台更新
        //     const queryVal = row[editName];
        //     const personId = row['PersonId'];

        //     const result = await this.getData(2, editName, queryVal, personId)
        //     if (result.ret === 'OK') {
        //         this.getData(1).then((data) => {
        //             this.setState({
        //                 data: data.rows
        //             })
        //         })
        //     }
        // });
    };

    handleDelete = async (record) => {
        const { PersonId } = record
        const result = await this.getData(3, null, null, PersonId)
        if (result.ret === 'OK') {
            this.getData(1).then((data) => {
                this.setState({
                    data: data.rows
                })
            })
        } else {
            message.error(result.ret)
        }
    }

    render() {
        const { data } = this.state
        const components = {
            body: {
                row: EditableRow,
                cell: EditableCell,
            },
        };
        return (
            <>
                <Card title={<Button icon={<PlusOutlined />} type='primary' onClick={this.handleAdd}>添加</Button>}
                    extra={<Button type="link"
                        onClick={this.handleLogOut}>
                        <span style={{ color: 'red', textDecoration: 'underline' }}>退出</span>
                    </Button>
                    }>

                    <Table
                        components={components}
                        dataSource={data}
                        pagination={false}
                        rowKey={'PersonId'}
                        rowClassName={() => 'editable-row'}
                        size='small'
                        bordered={true}
                    >
                        <Column title="编号" dataIndex="PersonId" key="PersonId" align="center" />
                        <Column title="姓名" dataIndex="PersonName" key="PersonName" align="center" />
                        <Column title="入职时间参考" dataIndex="HireDate" key="HireDate" align="center" />
                        <Column title="入职时间调整"
                            dataIndex="HireDateChange"
                            key="HireDateChange"
                            align="center"
                            onCell={(record) => {
                                return {
                                    record,
                                    editable: true,
                                    dataIndex: 'HireDateChange',
                                    title: "入职时间调整(时长)",
                                    handleSave: this.handleSave,
                                    isdatepicker: 1
                                }
                            }}
                        />
                        <Column title="工龄系数参考" dataIndex="AgeRatio" key="AgeRatio" align="center" />
                        <Column title="工龄系数调整" dataIndex="AgeRatioChange" key="AgeRatioChange" align="center"
                            onCell={(record) => {
                                return {
                                    record,
                                    editable: true,
                                    dataIndex: 'AgeRatioChange',
                                    title: "工龄系数调整",
                                    handleSave: this.handleSave
                                }
                            }}
                        />
                        <Column title="个人系数调整" dataIndex="PersonRatioChange" key="PersonRatioChange" align="center"
                            onCell={(record) => {
                                return {
                                    record,
                                    editable: true,
                                    dataIndex: 'PersonRatioChange',
                                    title: "个人系数调整",
                                    handleSave: this.handleSave
                                }
                            }}
                        />
                        <Column title="操作" align="center" render={(_text, record) => (
                            <Popconfirm
                                placement="bottomRight"
                                title='是否确认删除'
                                onConfirm={() => this.handleDelete(record)}
                                okText="Yes"
                                cancelText="No"
                            >
                                <Button type="danger">删除</Button>
                            </Popconfirm>
                        )} />
                    </Table>

                </Card>
            </>
        )
    }
}