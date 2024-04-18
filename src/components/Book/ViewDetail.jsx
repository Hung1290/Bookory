import { Row, Col, Rate, Divider } from 'antd';
import './book.scss';
import ImageGallery from 'react-image-gallery';
import { useRef, useState } from 'react';
import ModalGallery from './ModalGallery';
import { MinusOutlined, PlusOutlined } from '@ant-design/icons';
import { BsCartPlus } from 'react-icons/bs';
import BookLoader from './BookLoader';
import { useSelector, useDispatch } from 'react-redux';
import { doAddBookAction } from '../../redux/order/orderSlice';
import { Link } from 'react-router-dom';

const ViewDetail = (props) => {
    const { dataBook } = props
    const [isOpenModalGallery, setIsOpenModalGallery] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const dispatch = useDispatch()
    const [currentQuantity, setCurrentQuantity] = useState(1)

    const refGallery = useRef(null);

    const images = dataBook?.items ?? [];

    const handleOnClickImage = () => {
        //get current index onClick
        // alert(refGallery?.current?.getCurrentIndex());
        setIsOpenModalGallery(true);
        setCurrentIndex(refGallery?.current?.getCurrentIndex() ?? 0)
        // refGallery?.current?.fullScreen()
    }

    const handleChangeButton = (type) => {
        if (type === 'MINUS') {
            if (currentQuantity - 1 <= 0) return
            setCurrentQuantity(currentQuantity - 1)
        }
        if (type === 'PLUS') {
            if (currentQuantity === +dataBook.quantity) return
            setCurrentQuantity(currentQuantity + 1)
        }
    };

    const handleChangeInput = (value) => {
        if (!isNaN(value)) {
            if (+value > 0 && +value < +dataBook.quantity) {
                setCurrentQuantity(+value)
            }
        }
    }

    const handleAddToCart = async (quantityCart, book) => {
        const { id, name, category, author, price, quantity, sold, thumbnail } = book
        dispatch(doAddBookAction({ quantityCart, id: book.id, detail: { id, name, category, author, price, quantity, sold, thumbnail } }))
    }

    return (
        <div>
            <div className='view-detail-book' style={{ maxWidth: 1440, margin: '0 auto', minHeight: "calc(100vh - 150px)" }}>
                <div style={{ padding: "20px", background: '#fff', borderRadius: 5 }}>
                    {
                        dataBook ?
                            <Row gutter={[20, 20]}>
                                <Col md={10} sm={0} xs={0}>
                                    <ImageGallery
                                        ref={refGallery}
                                        items={images}
                                        showPlayButton={false} //hide play button
                                        showFullscreenButton={false} //hide fullscreen button
                                        renderLeftNav={() => <></>} //left arrow === <> </>
                                        renderRightNav={() => <></>}//right arrow === <> </>
                                        slideOnThumbnailOver={true}  //onHover => auto scroll images
                                        onClick={() => handleOnClickImage()}
                                    />
                                </Col>
                                <Col md={14} sm={24}>
                                    <Col md={0} sm={24} xs={24}>
                                        <ImageGallery
                                            ref={refGallery}
                                            items={images}
                                            showPlayButton={false} //hide play button
                                            showFullscreenButton={false} //hide fullscreen button
                                            renderLeftNav={() => <></>} //left arrow === <> </>
                                            renderRightNav={() => <></>}//right arrow === <> </>
                                            showThumbnails={false}
                                        />
                                    </Col>
                                    <Col span={24}>
                                        <div className='author'>Tác giả: <a href='#'>{dataBook.author}</a> </div>
                                        <div className='title'>{dataBook.name}</div>
                                        <div className='rating'>
                                            <Rate value={5} disabled style={{ color: '#ffce3d', fontSize: 12 }} />
                                            <span className='sold'>
                                                <Divider type="vertical" />
                                                Đã bán {dataBook.sold}</span>
                                        </div>
                                        <div className='price'>
                                            <span className='currency'>
                                                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(dataBook?.price ?? 0)}
                                            </span>
                                        </div>
                                        <div className='delivery'>
                                            <div>
                                                <span className='left-content'>Vận chuyển</span>
                                                <span className='right-content'>Miễn phí vận chuyển</span>
                                            </div>
                                        </div>
                                        <div className='quantity'>
                                            <span className='left-content'>Số lượng</span>
                                            <span className='right-content'>
                                                <button onClick={() => handleChangeButton('MINUS')}><MinusOutlined /></button>
                                                <input onChange={(event) => handleChangeInput(event.target.value)} value={currentQuantity} />
                                                <button onClick={() => handleChangeButton('PLUS')}><PlusOutlined /></button>
                                            </span>
                                            <span style={{ marginLeft: '20px' }}>Số hàng còn trong kho: {dataBook.quantity}</span>
                                        </div>
                                        <div className='buy'>
                                            <button
                                                className='cart'
                                                onClick={() => handleAddToCart(currentQuantity, dataBook)}
                                            >
                                                <BsCartPlus className='icon-cart' />
                                                <span>Thêm vào giỏ hàng</span>
                                            </button>
                                            <Link to='/order'>
                                                <button
                                                    className='now'
                                                    onClick={() => handleAddToCart(currentQuantity, dataBook)}
                                                >Mua ngay</button>
                                            </Link>
                                        </div>
                                    </Col>
                                </Col>
                            </Row>
                            :
                            <BookLoader />
                    }
                </div>
            </div>
            <ModalGallery
                isOpen={isOpenModalGallery}
                setIsOpen={setIsOpenModalGallery}
                currentIndex={currentIndex}
                items={images}
                title={dataBook?.name}
            />
        </div>
    )
}

export default ViewDetail;