import React, { useState } from 'react';
import { FaReact } from 'react-icons/fa'
import { FiShoppingCart } from 'react-icons/fi';
import { VscSearchFuzzy } from 'react-icons/vsc';
import { Divider, Badge, Drawer, message, Avatar } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { DownOutlined, UserOutlined } from '@ant-design/icons';
import { Dropdown, Space, Popover, Input } from 'antd';
import { useNavigate } from 'react-router';
import './header.scss';
import { doLogoutAction } from '../../redux/account/accountSlice';
import { Link } from 'react-router-dom';
import ManageAccount from './manageAccount';
import { doPlaceOrderAction } from '../../redux/order/orderSlice';

const Header = (props) => {
    const { setSearchTerm } = props
    const { Search } = Input;
    const [search, setSearch] = useState('');
    const [openDrawer, setOpenDrawer] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const isAuthenticated = useSelector(state => state.account.isAuthenticated);
    const user = useSelector(state => state.account.user);
    const carts = useSelector(state => state.order.carts);
    const navigate = useNavigate();
    const dispatch = useDispatch()

    const handleLogout = async () => {
        dispatch(doLogoutAction());
        dispatch(doPlaceOrderAction());
        message.success('Đăng xuất thành công');
        navigate('/')
    }

    const handleChange = (event) => {
        const value = event.target.value;
        setSearch(value);
    };

    const onSearch = () => {
        setSearchTerm(search)
    }

    let items = [
        {
            label: <label onClick={() => setIsModalOpen(true)} style={{ cursor: 'pointer' }}>Quản lý tài khoản</label>,
            key: 'account',
        },
        {
            label: <Link to='/history'><label style={{ cursor: 'pointer' }}>Lịch sử đặt hàng</label></Link>,
            key: 'history',
        },
        {
            label: <label
                style={{ cursor: 'pointer' }}
                onClick={() => handleLogout()}
            >Đăng xuất</label>,
            key: 'logout',
        },

    ];

    if (user?.role === 'ADMIN') {
        items.unshift({
            label: <Link to='/admin'>Trang quản trị</Link>,
            key: 'admin',
        })
    }

    const contentPopover = () => (
        <div className='pop-cart-body'>
            <div className='pop-cart-content'>
                {
                    carts?.map((item, index) => {
                        return (
                            <div className='book' key={`index-${index}`} span={24} style={{ padding: '7px 0' }}>
                                <img src={item.detail.thumbnail[0].name} />
                                <div>{item.detail.name}</div>
                                <div style={{ color: '#ee4d2d', fontWeight: '500' }}>
                                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.detail.price)}
                                </div>
                            </div>
                        )
                    })
                }
            </div>
            <div className='pop-cart-footer'>
                <Link to='/order' style={{ color: '#fff' }}>
                    <button>Xem giỏ hàng</button>
                </Link>
            </div>
        </div>
    );

    return (
        <>
            <div className='header-container'>
                <header className="page-header">
                    <div className="page-header__top">
                        <div className="page-header__toggle" onClick={() => {
                            setOpenDrawer(true)
                        }}>☰</div>
                        <div className='page-header__logo'>
                            <Link to='/'>
                                <span className='logo'>
                                    <FaReact className='rotate icon-react' />
                                    Bookory
                                    {/* <VscSearchFuzzy className='icon-search' /> */}
                                </span>
                            </Link>
                            {/* <input
                                className="input-search"
                                type={'text'}
                                placeholder="Bạn tìm gì hôm nay"
                                onChange={handleChange}
                                value={search}
                            /> */}
                            <Search
                                // className="input-search"
                                placeholder="Bạn tìm gì hôm nay"
                                allowClear
                                onSearch={onSearch}
                                onChange={handleChange}
                                value={search}
                                style={{ width: "100%" }}
                            />
                        </div>

                    </div>
                    <nav className="page-header__bottom">
                        <ul id="navigation" className="navigation">
                            <li className="navigation__item">
                                <Popover
                                    className='popover-carts'
                                    rootClassName='popover-carts'
                                    placement="bottomRight"
                                    title={"Sản phẩm mới thêm"}
                                    content={contentPopover}
                                >
                                    <Badge
                                        count={carts?.length ?? 0}
                                        size={"small"}
                                        showZero
                                    >
                                        <FiShoppingCart className='icon-cart' />
                                    </Badge>
                                </Popover>
                            </li>
                            <li className="navigation__item mobile"><Divider type='vertical' /></li>
                            <li className="navigation__item mobile">
                                {!isAuthenticated ?
                                    <span onClick={() => navigate('/login')}> Tài Khoản</span>
                                    :
                                    <Dropdown menu={{ items }} trigger={['click']}>
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
                                }
                            </li>
                        </ul>
                    </nav>
                </header>
            </div>
            <Drawer
                title="Menu chức năng"
                placement="left"
                onClose={() => setOpenDrawer(false)}
                open={openDrawer}
            >
                <p>Quản lý tài khoản</p>
                <Divider />

                <p>Đăng xuất</p>
                <Divider />
            </Drawer>

            <ManageAccount
                isModalOpen={isModalOpen}
                setIsModalOpen={setIsModalOpen}
            />
        </>
    )
};

export default Header;
