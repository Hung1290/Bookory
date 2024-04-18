import { Avatar, Button, Col, Form, Input, Row, Upload, message } from 'antd'
import React, { useState } from 'react'
import { UserOutlined, UploadOutlined } from '@ant-design/icons';
import { callUpdateUserInfo, callUploadAvatar } from '../../services/api';
import { useDispatch, useSelector } from 'react-redux';
import { doUpdateUserInfoAction, doUploadAvatarAction } from '../../redux/account/accountSlice';

const UserInfo = () => {
    const dispatch = useDispatch()
    const user = useSelector(state => state.account.user)
    const [userAvatar, setUserAvatar] = useState(user?.avatar ?? "")
    const [isSubmit, setIsSubmit] = useState(false)

    const getBase64 = (img, callback) => {
        const reader = new FileReader();
        reader.addEventListener('load', () => callback(reader.result));
        reader.readAsDataURL(img);
    };

    const handleUploadAvatar = async ({ file, onSuccess, onError }) => {
        try {
            const base64 = await new Promise((resolve, reject) => {
                getBase64(file, (base64) => {
                    resolve(base64);
                });
            });

            const res = await callUploadAvatar(base64);

            if (res && res.data) {
                const newAvatar = res.data
                dispatch(doUploadAvatarAction({ avatar: newAvatar }))
                setUserAvatar(newAvatar)
                onSuccess('ok');
            } else {
                onError('Đã có lỗi khi upload file');
            }
        } catch (error) {
            onError('Đã có lỗi khi upload file');
        }
    }


    const propsUpload = {
        maxCount: 1,
        multiple: false,
        showUploadList: false,
        customRequest: handleUploadAvatar,
        onChange(info) {
            if (info.file.status !== 'uploading') {
                // console.log(info.file, info.fileList);
            }
            if (info.file.status === 'done') {
                message.success('Upload file thành công');
            } else if (info.file.status === 'error') {
                message.error('Upload file thất bại');
            }
        },
    };

    const onFinish = async (values) => {
        const { fullName, phone } = values;
        setIsSubmit(true);
        const res = await callUpdateUserInfo(user?.id, userAvatar, fullName, phone);
        if (res?.data) {
            dispatch(doUpdateUserInfoAction({ avatar: userAvatar, fullName, phone }))
            message.success('Cập nhật thành công!');
        }
        setIsSubmit(false);
    };

    const initialValues = {
        email: user?.email || '',
        fullName: user?.fullName || '',
        phone: user?.phone || '',
    };

    return (
        <Row>
            <Col sm={24} md={12}>
                <Row gutter={[30, 30]}>
                    <Col span={24}>
                        <Avatar
                            size={{ xs: 32, sm: 64, md: 80, lg: 128, xl: 160, xxl: 200 }}
                            icon={<UserOutlined />}
                            shape='circle'
                            src={user?.tempAvatar ?? userAvatar}
                        />
                    </Col>
                    <Col span={24}>
                        <Upload {...propsUpload}>
                            <Button icon={<UploadOutlined />}>Upload avatar</Button>
                        </Upload>
                    </Col>
                </Row>
            </Col>
            <Col sm={24} md={12}>
                <Form
                    name="basic"
                    labelCol={{ span: 24 }}
                    wrapperCol={{ span: 24 }}
                    style={{ maxWidth: 600 }}
                    initialValues={initialValues}
                    onFinish={onFinish}
                    autoComplete="off"
                >

                    <Form.Item
                        label="Email"
                        name="email"
                    >
                        <Input disabled />
                    </Form.Item>

                    <Form.Item
                        label="Tên hiển thị"
                        name="fullName"
                        rules={[{ required: true, message: 'Họ tên không được để trống!' }]}
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

                    <Form.Item wrapperCol={{ offset: 0, span: 16 }}>
                        <Button htmlType="submit" loading={isSubmit}>
                            Cập nhật
                        </Button>
                    </Form.Item>
                </Form>
            </Col>
        </Row>
    )
}

export default UserInfo