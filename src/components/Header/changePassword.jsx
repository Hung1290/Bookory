import { Button, Form, Input, message, notification } from 'antd'
import React, { useState } from 'react'
import { useSelector } from 'react-redux';
import { callUpdateUserPassword } from '../../services/api';

const ChangePassword = () => {
    const user = useSelector(state => state.account.user)
    const [isSubmit, setIsSubmit] = useState(false)
    const [form] = Form.useForm()

    const onFinish = async (values) => {
        const { oldPassword, newPassword } = values;
        setIsSubmit(true);
        const res = await callUpdateUserPassword(user?.id, oldPassword, newPassword);
        if (res?.status === 200) {
            form.resetFields()
            message.success('Cập nhật thành công!');
        } else {
            notification.error({
                message: "Đã có lỗi xảy ra",
                description: res.data
            })
        }
        setIsSubmit(false);
    };

    return (
        <>
            <Form
                name="basic"
                labelCol={{ span: 24 }}
                wrapperCol={{ span: 24 }}
                style={{ maxWidth: 600 }}
                onFinish={onFinish}
                autoComplete="off"
                form={form}
            >

                <Form.Item
                    label="Mật khẩu cũ"
                    name="oldPassword"
                    rules={[{ required: true, message: 'Mật khẩu cũ không được để trống!' }]}
                >
                    <Input.Password />
                </Form.Item>

                <Form.Item
                    label="Mật khẩu mới"
                    name="newPassword"
                    rules={[{ required: true, message: 'Mật khẩu mới không được để trống!' }]}
                >
                    <Input.Password />
                </Form.Item>

                <Form.Item wrapperCol={{ offset: 0, span: 16 }}>
                    <Button htmlType="submit" loading={isSubmit}>
                        Cập nhật
                    </Button>
                </Form.Item>
            </Form>
        </>
    )
}

export default ChangePassword