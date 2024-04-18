import { Col, Divider, InputNumber, Row, Empty } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { DeleteOutlined } from '@ant-design/icons';
import { doDeleteItemCartAction, doUpdateCartAction } from '../../redux/order/orderSlice';
import { useEffect, useState } from 'react';

const ViewOrder = (props) => {
    const { setCurrentStep } = props
    const carts = useSelector(state => state.order.carts)
    const [totalPrice, setTotalPrice] = useState(0)
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

    const handleOnchangeInput = (value, book) => {
        const { id, name, category, author, price, quantity, sold, thumbnail } = book
        if (!value || value < 1) return
        if (!isNaN(value)) {
            dispatch(doUpdateCartAction({ quantityCart: value, id: book.id, detail: { id, name, category, author, price, quantity, sold, thumbnail } }))
        }
    }
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
                                        <InputNumber onChange={(value) => handleOnchangeInput(value, book)} value={book.quantityCart} />
                                    </div>
                                    <div className='sum'>
                                        Tổng: {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(currentBookPrice * book.quantityCart)}
                                    </div>
                                    <DeleteOutlined onClick={() => dispatch(doDeleteItemCartAction({ id: book.id }))} />
                                </div>
                            </div>
                        )
                    })
                }
                {
                    carts.length === 0 &&
                    <div className='empty-order'>
                        <Empty
                            description={'Không có sản phẩm trong giỏ hàng'}
                        />
                    </div>
                }
            </Col>
            <Col md={6} xs={24} >
                <div className='order-sum'>
                    <div className='calculate'>
                        <span>Tạm tính</span>
                        <span> {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalPrice || 0)}</span>
                    </div>
                    <Divider style={{ margin: "10px 0" }} />
                    <div className='calculate'>
                        <span> Tổng tiền</span>
                        <span className='sum-final'>  {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalPrice || 0)}</span>
                    </div>
                    <Divider style={{ margin: "10px 0" }} />
                    <button onClick={() => { carts?.length > 0 && setCurrentStep(1) }}>Mua Hàng ({carts?.length ?? 0})</button>
                </div>
            </Col>
        </Row>
    )
}

export default ViewOrder;