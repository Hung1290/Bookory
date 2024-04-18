import React, { useState } from 'react';
import { Button, Divider, Form, Input, message, notification } from 'antd';
import './index.scss'
import { Link, useNavigate } from 'react-router-dom';
import { callLogin } from '../../services/api';
import { useDispatch } from 'react-redux';
import { doLoginAction } from '../../redux/account/accountSlice';

const Login = () => {
    const [isSubmit, setIsSubmit] = useState(false)
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const onFinish = async (values) => {
        const { email, password } = values
        setIsSubmit(true)
        const res = await callLogin(email, password)
        setIsSubmit(false)
        if (res?.status === 200) {
            dispatch(doLoginAction(res.data))
            message.success('Đăng nhập thành công!');
            navigate('/')
        } else {
            notification.error({
                message: 'Có lỗi xảy ra!',
                description: res?.data?.message,
                duration: 5
            })
        }
    };
    return (
        <div className='login-page'>
            <main className='main'>
                <div className='container'>
                    <section className='wrapper'>
                        <div className='heading'>
                            <h2><strong>Đăng nhập</strong></h2>
                            <Divider />
                        </div>
                        <div className='form'>
                            <Form
                                name="basic"
                                labelCol={{ span: 24 }}
                                wrapperCol={{ span: 24 }}
                                style={{ maxWidth: 600 }}
                                initialValues={{ remember: true }}
                                onFinish={onFinish}
                                autoComplete="off"
                            >
                                <Form.Item
                                    label="Email"
                                    name="email"
                                    rules={[{ required: true, message: 'Email không được để trống!' }]}
                                >
                                    <Input />
                                </Form.Item>

                                <Form.Item
                                    label="Mật khẩu"
                                    name="password"
                                    rules={[{ required: true, message: 'Mật khẩu không được để trống!' }]}
                                >
                                    <Input.Password />
                                </Form.Item>

                                <Form.Item wrapperCol={{ offset: 0, span: 16 }}>
                                    <Button type="primary" htmlType="submit" loading={isSubmit}>
                                        Đăng nhập
                                    </Button>
                                </Form.Item>

                            </Form>
                        </div>
                        <Divider>Or</Divider>
                        <p className='text'>
                            Chưa có tài khoản? &nbsp;
                            <span>
                                <Link to='/register'>Đăng ký</Link>
                            </span>
                        </p>
                    </section>
                </div>
            </main>
        </div>
    )
};

export default Login;