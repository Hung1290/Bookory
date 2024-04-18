import React, { useState } from 'react';
import { Button, Divider, Form, Input, message, notification } from 'antd';
import './index.scss'
import { Link, useNavigate } from 'react-router-dom';
import { callRegister } from '../../services/api';

const Register = () => {
    const [isSubmit, setIsSubmit] = useState(false)
    const navigate = useNavigate()

    const onFinish = async (values) => {
        const { fullName, email, phone, password } = values
        setIsSubmit(true)
        const res = await callRegister(fullName, email, phone, password)
        setIsSubmit(false)
        if (res?.status === 201) {
            message.success(res.data.message);
            navigate('/login')
        } else {
            notification.error({
                message: 'Có lỗi xảy ra!',
                description: res?.data?.error,
                duration: 5
            })
        }
    };

    return (
        <div className='register-page'>
            <main className='main'>
                <div className='container'>
                    <section className='wrapper'>
                        <div className='heading'>
                            <h2><strong>Đăng ký tài khoản</strong></h2>
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
                                    label="Họ tên"
                                    name="fullName"
                                    rules={[{ required: true, message: 'Họ tên không được để trống!' }]}
                                >
                                    <Input />
                                </Form.Item>

                                <Form.Item
                                    label="Email"
                                    name="email"
                                    rules={[{ required: true, message: 'Email không được để trống!' }]}
                                >
                                    <Input />
                                </Form.Item>

                                <Form.Item
                                    label="Số điện thoại"
                                    name="phone"
                                    rules={[{ required: true, message: 'Số điện thoại không được để trống!' }]}
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
                                        Đăng ký
                                    </Button>
                                </Form.Item>
                            </Form>
                        </div>
                        <Divider>Or</Divider>
                        <p className='text'>
                            Đã có tài khoản? &nbsp;
                            <span>
                                <Link to='/login'>Đăng nhập</Link>
                            </span>
                        </p>
                    </section>
                </div>
            </main>
        </div>

    )
};

export default Register;