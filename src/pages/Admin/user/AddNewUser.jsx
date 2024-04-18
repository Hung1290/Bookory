import React, { useState } from 'react';
import { Divider, Form, Input, Modal, message, notification } from 'antd';
import { callRegister } from '../../../services/api';

const AddNewUser = (props) => {
  const handleCancel = () => {
    props.setOpenAddNewUser(false);
  };

  const [isSubmit, setIsSubmit] = useState(false);
  const [form] = Form.useForm();

  const onFinish = async (values) => {
    const { fullName, email, phone, password } = values;
    setIsSubmit(true);
    const res = await callRegister(fullName, email, phone, password);
    if (res?.status === 201) {
      message.success('Tạo mới thành công!');
      form.resetFields()
      props.setOpenAddNewUser(false);
      await props.fetchUser()
    } else {
      notification.error({
        message: 'Có lỗi xảy ra!',
        description: res?.data?.error,
        duration: 5
      })
    }
    setIsSubmit(false);
  };

  return (
    <>
      <Modal
        title="Thêm người dùng"
        open={props.openAddNewUser}
        onOk={() => { form.submit() }}
        onCancel={handleCancel}
        okText={'Tạo mới'}
        cancelText={"Hủy"}
        confirmLoading={isSubmit}
      >
        <Divider />
        <Form
          form={form}
          name="basic"
          onFinish={onFinish}
          autoComplete="off"
        >
          <Form.Item
            labelCol={{ span: 24 }} //whole column
            label="Họ tên"
            name="fullName"
            rules={[{ required: true, message: 'Họ tên không được để trống!' }]}
          >
            <Input />
          </Form.Item>


          <Form.Item
            labelCol={{ span: 24 }} //whole column
            label="Email"
            name="email"
            rules={[{ required: true, message: 'Email không được để trống!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            labelCol={{ span: 24 }} //whole column
            label="Số điện thoại"
            name="phone"
            rules={[{ required: true, message: 'Số điện thoại không được để trống!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            labelCol={{ span: 24 }} //whole column
            label="Mật khẩu"
            name="password"
            rules={[{ required: true, message: 'Mật khẩu không được để trống!' }]}
          >
            <Input.Password />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default AddNewUser;