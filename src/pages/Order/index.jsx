import { Steps, Button, Result } from 'antd';
import './order.scss';
import { SmileOutlined } from '@ant-design/icons';
import { useState } from 'react';
import ViewOrder from '../../components/Order/ViewOrder';
import ViewPayment from '../../components/Order/ViewPayment';
import { Link } from 'react-router-dom';

const Order = (props) => {
    const [currentStep, setCurrentStep] = useState(0)

    return (
        <div >
            <div className="order-container" style={{ maxWidth: 1440, margin: '0 auto' }}>
                <Steps
                    className='step-order'
                    size="small"
                    current={currentStep}
                    status={'finish'}
                    items={[
                        {
                            title: 'Đơn hàng',
                        },
                        {
                            title: 'Đặt hàng',
                        },
                        {
                            title: 'Thanh toán',
                        },
                    ]}
                />
                {
                    currentStep === 0 && <ViewOrder setCurrentStep={setCurrentStep} />
                }
                {
                    currentStep === 1 && <ViewPayment setCurrentStep={setCurrentStep} />
                }
                {
                    currentStep === 2 &&
                    <Result
                        icon={<SmileOutlined />}
                        title="Đơn hàng đã được đặt thành công!"
                        extra={<Link to='/history'><Button type="primary">Xem lịch sử</Button></Link>}
                    />
                }
            </div>
        </div>
    )
}

export default Order;