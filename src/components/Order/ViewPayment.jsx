import { Col, Divider, Row, Input, Form, Radio, message } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { LoadingOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import { callPlaceOrder } from '../../services/api';
import { doPlaceOrderAction } from '../../redux/order/orderSlice';

const ViewPayment = (props) => {
    const { setCurrentStep } = props
    const carts = useSelector(state => state.order.carts)
    const user = useSelector(state => state.account.user)
    const [totalPrice, setTotalPrice] = useState(0)
    const [isSubmit, setIsSubmit] = useState(false)
    const [form] = Form.useForm();
    const dispatch = useDispatch()

    useEffect(() => {
        if (carts && carts.length > 0) {
            let sum = 0
            carts.map(item => {
                sum += item.quantityCart * item.detail.price
            })
            setTotalPrice(sum)
        } else {
            setTotalPrice(0)
        }
    }, [carts])

    const onFinish = async (values) => {
        const { name, phone, address } = values;
        const detailOrder = carts.map(item => {
            return {
                bookName: item.detail.name,
                quantity: item.quantityCart,
                id: item.id
            }
        })
        setIsSubmit(true);
        const res = await callPlaceOrder(user?.id, name, phone, address, totalPrice, detailOrder);
        if (res?.data) {
            message.success('Đặt hàng thành công!');
            dispatch(doPlaceOrderAction())
            setCurrentStep(2)
        }
        setIsSubmit(false);
    };

    return (
        <Row gutter={[20, 20]}>
            <Col md={18} xs={24}>
                {
                    carts?.map((book, index) => {
                        const currentBookPrice = book?.detail?.price ?? 0
                        return (
                            <div className='order-book' key={`index-${index}`}>
                                <div className='book-content'>
                                    <img src={book.detail.thumbnail[0].name} />
                                    <div className='title'>
                                        {book.detail.name}
                                    </div>
                                    <div className='price'>
                                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(currentBookPrice)}
                                    </div>
                                </div>
                                <div className='action'>
                                    <div className='quantity'>
                                        Số lượng: {book.quantityCart}
                                    </div>
                                    <div className='sum'>
                                        Tổng: {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(currentBookPrice * book.quantityCart)}
                                    </div>
                                </div>
                            </div>
                        )
                    })
                }
            </Col>
            <Col md={6} xs={24} >
                <div className='order-sum'>
                    <Form
                        labelCol={{ span: 24 }}
                        onFinish={onFinish}
                        form={form}
                    >
                        <Form.Item
                            style={{ margin: 0 }}
                            label="Tên người nhận"
                            name="name"
                            initialValue={user?.fullName}
                            rules={[{ required: true, message: 'Tên người nhận không được để trống!' }]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            style={{ margin: 0 }}
                            label="Số điện thoại"
                            name="phone"
                            initialValue={user?.phone}
                            rules={[{ required: true, message: 'Số điện thoại không được để trống!' }]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            style={{ margin: 0 }}
                            label="Địa chỉ"
                            name="address"
                            rules={[{ required: true, message: 'Địa chỉ không được để trống!' }]}
                        >
                            <Input.TextArea rows={4} />
                        </Form.Item>

                    </Form>
                    <div>
                        <div style={{ marginBottom: '10px' }}>Hình thức thanh toán</div>
                        <Radio checked={true}>Thanh toán khi nhận hàng</Radio>
                    </div>
                    <Divider style={{ margin: "10px 0" }} />
                    <div className='calculate'>
                        <span> Tổng tiền</span>
                        <span className='sum-final'>  {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalPrice || 0)}</span>
                    </div>
                    <Divider style={{ margin: "10px 0" }} />
                    <button
                        onClick={() => form.submit()}
                        disabled={isSubmit}
                    >
                        {isSubmit && <span><LoadingOutlined /> &nbsp;</span>}
                        Đặt hàng ({carts?.length ?? 0})
                    </button>
                </div>
            </Col>
        </Row>
    )
}

export default ViewPayment;