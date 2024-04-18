import React, { useState } from 'react';
import {
    AppstoreOutlined,
    ExceptionOutlined,
    HeartTwoTone,
    TeamOutlined,
    UserOutlined,
    DollarCircleOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    DownOutlined,
} from '@ant-design/icons';
import { Layout, Menu, Dropdown, Space, message, Avatar } from 'antd';
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Link } from 'react-router-dom';
import './layout.scss';
import { useDispatch, useSelector } from 'react-redux';
import { doLogoutAction } from '../../../redux/account/accountSlice';
import { doPlaceOrderAction } from '../../../redux/order/orderSlice';

const { Content, Footer, Sider } = Layout;

const items = [
    {
        label: <Link to='/admin'>Manage Users</Link>,
        key: '/admin',
        icon: <UserOutlined />
    },
    {
        label: <Link to='/admin/book'>Manage Books</Link>,
        key: '/admin/book',
        icon: <ExceptionOutlined />
    },
    {
        label: <Link to='/admin/order'>Manage Orders</Link>,
        key: '/admin/order',
        icon: <DollarCircleOutlined />
    },

];

const LayoutAdmin = () => {
    const location = useLocation();
    const [collapsed, setCollapsed] = useState(false);
    const user = useSelector(state => state.account.user);

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleLogout = async () => {
        dispatch(doLogoutAction());
        dispatch(doPlaceOrderAction());
        message.success('Đăng xuất thành công');
        navigate('/')
    }


    const itemsDropdown = [
        {
            label: <Link to='/'>
                <label
                    style={{ cursor: 'pointer' }}
                >Trang chủ</label>
            </Link>,
            key: 'home',
        },
        {
            label: <label
                style={{ cursor: 'pointer' }}
                onClick={() => handleLogout()}
            >Đăng xuất</label>,
            key: 'logout',
        },
    ];

    return (
        <Layout
            style={{ minHeight: '100vh' }}
            className="layout-admin"
        >
            <Sider
                theme='light'
                collapsible
                collapsed={collapsed}
                onCollapse={(value) => setCollapsed(value)}>
                <div style={{ height: 32, margin: 16, textAlign: 'center' }}>
                    Admin
                </div>
                <Menu
                    selectedKeys={[location.pathname]}
                    mode="inline"
                    items={items}
                />
            </Sider>
            <Layout>
                <div className='admin-header'>
                    <span>
                        {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
                            className: 'trigger',
                            onClick: () => setCollapsed(!collapsed),
                        })}
                    </span>
                    <Dropdown menu={{ items: itemsDropdown }} trigger={['click']}>
                        <a onClick={(e) => e.preventDefault()}>
                            <Space>
                                <Avatar
                                    icon={<UserOutlined />}
                                    src={user?.avatar} />
                                {user?.fullName}
                                <DownOutlined />
                            </Space>
                        </a>
                    </Dropdown>
                </div>
                <Content style={{ margin: '16px' }}>
                    <Outlet />
                </Content>
                <Footer style={{ padding: 0 }}>
                    Nguyễn Việt Hùng &copy; 2024 <HeartTwoTone />
                </Footer>
            </Layout>
        </Layout>
    );
};

export default LayoutAdmin;