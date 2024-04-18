import React from 'react';
import { Modal, Tabs } from 'antd';
import UserInfo from './userInfo';
import ChangePassword from './changePassword';

const ManageAccount = (props) => {
    const { isModalOpen, setIsModalOpen } = props

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const items = [
        {
            key: '1',
            label: 'Cập nhật thông tin',
            children: <UserInfo />,
        },
        {
            key: '2',
            label: 'Đổi mật khẩu',
            children: <ChangePassword />,
        }
    ];

    const onChange = (key) => {
        // console.log(key);
    };

    return (
        <>
            <Modal
                title="Quản lý tài khoản"
                open={isModalOpen}
                onCancel={handleCancel}
                footer={[]}
                width={"50vw"}
            >
                <Tabs defaultActiveKey="1" items={items} onChange={onChange} />
            </Modal>
        </>
    );
};

export default ManageAccount;