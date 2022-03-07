import { useState, useRef, useEffect } from 'react'
import { Input, Button, Space, Alert } from 'antd'
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import md5 from 'js-md5'
import { getHumanPropertyLogin } from '../../api/humanProperty'
import './HumanProperty.css'



export default function HumanPropertyLogin(props) {
    const passwordRef = useRef(null)

    const [visibleAlert, setVisibleAlert] = useState(false)

    const login = async () => {
        let password = passwordRef.current.state.value

        if (password && password.trim() !== '') {
            password = md5(password)
            const result = await getHumanPropertyLogin(password)

            if (result.ret === 'OK') {
                props.updateLogin(true)

            } else {
                setVisibleAlert(true)

                setTimeout(() => {
                    setVisibleAlert(false)
                }, 1000);
            }
        }
    }




    return (
        <div>
            <div >
                <div className="mask">
                    <div className="login">
                        <Space direction="vertical" size="large">

                            {
                                visibleAlert ? <Alert showIcon
                                    message={'登录失败'}
                                    type={'error'}
                                /> : null
                            }

                            <Input.Password
                                ref={passwordRef}
                                placeholder="请输入密码" iconRender={visible => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                            />
                            <Button type="primary" onClick={login}>登录</Button>
                        </Space>
                    </div>
                </div>
            </div>
        </div>
    )
}