import React from 'react';
import { Badge, Descriptions, Drawer } from 'antd';

const UserViewDetail = (props) => {

    const onClose = () => {
        props.setOpenViewDetail(false);
    };

    return (
        <>
            <Drawer
                title="Thông tin chi tiết"
                onClose={onClose}
                open={props.openViewDetail}
                width={'50vw'}
            >
                <Descriptions
                    title="Thông tin người dùng"
                    bordered
                    column={2}
                >
                    <Descriptions.Item label="ID">{props.dataViewDetail?.id}</Descriptions.Item>
                    <Descriptions.Item label="Tên hiển thị">{props.dataViewDetail?.fullName}</Descriptions.Item>
                    <Descriptions.Item label="Email">{props.dataViewDetail?.email}</Descriptions.Item>
                    <Descriptions.Item label="Số điện thoại">{props.dataViewDetail?.phone}</Descriptions.Item>
                    <Descriptions.Item label="Role" span={2}>
                        <Badge status='processing' text={props.dataViewDetail?.role} />
                    </Descriptions.Item>
                </Descriptions>
            </Drawer>
        </>
    );
};

export default UserViewDetail;