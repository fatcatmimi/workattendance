import React, { useContext, useState, useEffect, useRef } from 'react';
import { Form, InputNumber, DatePicker } from 'antd'
import moment from 'moment'

const EditableContext = React.createContext(null);

export const EditableRow = ({ index, ...props }) => {
    const [form] = Form.useForm();
    return (
        <Form form={form} component={false}>
            <EditableContext.Provider value={form}>
                <tr {...props} />
            </EditableContext.Provider>
        </Form>
    );
};

export const EditableCell = ({
    title,
    editable,
    children,
    dataIndex,
    record,
    handleSave,
    ...restProps
}) => {
    const [editing, setEditing] = useState(false);
    const inputRef = useRef(null);
    const form = useContext(EditableContext);

    useEffect(() => {
        if (editing) {
            inputRef.current.focus();
        }
    }, [editing]);

    const toggleEdit = () => {
        setEditing(!editing);
        form.setFieldsValue({
            [dataIndex]: restProps.isdatepicker ? moment(record[dataIndex]) : record[dataIndex],
        });
    };

    const save = async () => {
        try {
            const values = await form.validateFields();
            //修改的单元格的key
            const key = Object.keys(values)[0]
            toggleEdit();
            handleSave({ ...record, ...values }, key);
        } catch (errInfo) {
            console.log('Save failed:', errInfo);
        }
    };

    let childNode = children;

    if (editable) {
        childNode = editing ? (
            <Form.Item
                style={{
                    margin: 0,
                }}
                name={dataIndex}
                rules={[
                    {
                        required: true,
                        message: `${title} is required.`,
                    },
                ]}
            >
                {restProps.isdatepicker ? <DatePicker
                    ref={inputRef}
                    onPressEnter={save}
                    onBlur={save}
                    allowClear={false}
                /> :
                    <InputNumber
                        ref={inputRef}
                        onPressEnter={save}
                        onBlur={save} style={{ width: 150 }} />
                }
            </Form.Item>
        ) : (
            <div
                className="editable-cell-value-wrap"
                style={{
                    paddingRight: 24,
                }}
                onClick={toggleEdit}
            >
                {children}
            </div>
        );
    }

    return <td
        {...restProps}
    >{childNode}</td>;
};