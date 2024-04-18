import { FilterTwoTone, ReloadOutlined } from '@ant-design/icons';
import { Row, Col, Form, Checkbox, Divider, InputNumber, Button, Rate, Tabs, Pagination, Spin, Drawer } from 'antd';
import './home.scss';
import { callFetchBookPaginate, callFetchCategory } from '../../services/api';
import { useEffect, useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';

const Home = () => {
    const [searchTerm, setSearchTerm] = useOutletContext();

    const [listBook, setListBook] = useState()
    const [current, setCurrent] = useState(1)
    const [pageSize, setPageSize] = useState(5)
    const [total, setTotal] = useState(2)

    const [isLoading, setIsLoading] = useState(false)
    const [fillter, setFillter] = useState("")
    const [sortQuery, setSortQuery] = useState("_sort=sold&_order=desc")
    const [form] = Form.useForm();
    const [listCategory, setListCategory] = useState([])
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);

    const showDrawer = () => {
        setOpen(true);
    };

    const onClose = () => {
        setOpen(false);
    };

    const fetchBook = async () => {
        setIsLoading(true)
        let query = `_page=${current}&_limit=${pageSize}`
        if (fillter) {
            query += `&${fillter}`
        }
        if (sortQuery) {
            query += `&${sortQuery}`
        }
        if (searchTerm) {
            query += `&name_like=${searchTerm}`
        }
        const res = await callFetchBookPaginate(query)
        if (res?.data) {
            setListBook(res.data)
            setTotal(parseInt(res.headers.get('X-Total-Count'), 10))
        }
        setIsLoading(false)
    }

    useEffect(() => {
        fetchBook()
    }, [current, pageSize, fillter, sortQuery, searchTerm])

    useEffect(() => {
        const fetchCategory = async () => {
            const res = await callFetchCategory();
            if (res && res.data) {
                const d = res.data.map(item => {
                    return { label: item, value: item }
                })
                setListCategory(d);
            }
        }
        fetchCategory();
    }, [])

    const handleChangeFilter = (changedValues, values) => {
        if (changedValues?.category) {
            const cate = changedValues.category
            if (cate && cate.length > 0) {
                const f = cate.join('&category=')
                setFillter(`category=${f}`)
            } else {
                setFillter('')
            }
        }
    }

    const handleOnchangePage = (pagination) => {
        if (pagination && pagination.current !== current) {
            setCurrent(pagination.current)
        }
        if (pagination && pagination.pageSize !== pageSize) {
            setPageSize(pagination.pageSize)
            setCurrent(1)
        }
    }

    const onFinish = (values) => {
        if (values?.range?.from >= 0 && values?.range?.to >= 0) {
            let f = `price_gte=${values?.range?.from}&price_lte=${values?.range?.to}`
            if (values?.category?.length) {
                const cate = values?.category?.join('&category=')
                f += `&category=${cate}`
            }
            setFillter(f)
        }
    }

    const nonAccentVietnamese = (str) => {
        str = str.replace(/A|Á|À|Ã|Ạ|Â|Ấ|Ầ|Ẫ|Ậ|Ă|Ắ|Ằ|Ẵ|Ặ/g, "A");
        str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
        str = str.replace(/E|É|È|Ẽ|Ẹ|Ê|Ế|Ề|Ễ|Ệ/, "E");
        str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
        str = str.replace(/I|Í|Ì|Ĩ|Ị/g, "I");
        str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
        str = str.replace(/O|Ó|Ò|Õ|Ọ|Ô|Ố|Ồ|Ỗ|Ộ|Ơ|Ớ|Ờ|Ỡ|Ợ/g, "O");
        str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
        str = str.replace(/U|Ú|Ù|Ũ|Ụ|Ư|Ứ|Ừ|Ữ|Ự/g, "U");
        str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
        str = str.replace(/Y|Ý|Ỳ|Ỹ|Ỵ/g, "Y");
        str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
        str = str.replace(/Đ/g, "D");
        str = str.replace(/đ/g, "d");
        // Some system encode vietnamese combining accent as individual utf-8 characters
        str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ""); // Huyền sắc hỏi ngã nặng
        str = str.replace(/\u02C6|\u0306|\u031B/g, ""); // Â, Ê, Ă, Ơ, Ư
        return str;
    }

    const convertSlug = (str) => {
        str = nonAccentVietnamese(str);
        str = str.replace(/^\s+|\s+$/g, ''); // trim
        str = str.toLowerCase();

        // remove accents, swap ñ for n, etc
        const from = "ÁÄÂÀÃÅČÇĆĎÉĚËÈÊẼĔȆĞÍÌÎÏİŇÑÓÖÒÔÕØŘŔŠŞŤÚŮÜÙÛÝŸŽáäâàãåčçćďéěëèêẽĕȇğíìîïıňñóöòôõøðřŕšşťúůüùûýÿžþÞĐđßÆa·/_,:;";
        const to = "AAAAAACCCDEEEEEEEEGIIIIINNOOOOOORRSSTUUUUUYYZaaaaaacccdeeeeeeeegiiiiinnooooooorrsstuuuuuyyzbBDdBAa------";
        for (let i = 0, l = from.length; i < l; i++) {
            str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
        }

        str = str.replace(/[^a-z0-9 -]/g, '') // remove invalid chars
            .replace(/\s+/g, '-') // collapse whitespace and replace by -
            .replace(/-+/g, '-'); // collapse dashes

        return str;
    }

    const handleRedirectBook = (book) => {
        const slug = convertSlug(book.name);
        navigate(`/book/${slug}?id=${book.id}`)
    }

    const items = [
        {
            key: '_sort=sold&_order=desc',
            label: `Phổ biến`,
            children: <></>,
        },
        {
            key: '_sort=price&_order=asc',
            label: `Giá Thấp Đến Cao`,
            children: <></>,
        },
        {
            key: '_sort=price&_order=desc',
            label: `Giá Cao Đến Thấp`,
            children: <></>,
        },
    ];

    return (
        <div className="homepage-container" style={{ maxWidth: 1440, margin: '0 auto' }}>
            <Row gutter={[20, 20]}>
                <Col md={4} sm={0} xs={0}>
                    <div style={{ padding: '20px', backgroundColor: '#fff', borderRadius: '10px' }}>
                        <div style={{ display: 'flex', justifyContent: "space-between" }}>
                            <span> <FilterTwoTone /><strong style={{ paddingLeft: '10px' }}>Bộ lọc tìm kiếm</strong></span>
                            <ReloadOutlined
                                title="Reset"
                                onClick={() => {
                                    form.resetFields()
                                    setFillter('')
                                    setSortQuery('_sort=sold&_order=desc')
                                }}
                            />
                        </div>
                        <Divider />
                        <Form
                            onFinish={onFinish}
                            form={form}
                            onValuesChange={(changedValues, values) => handleChangeFilter(changedValues, values)}
                        >
                            <Form.Item
                                name="category"
                                label="Danh mục sản phẩm"
                                labelCol={{ span: 24 }}
                            >
                                <Checkbox.Group>
                                    <Row>
                                        {
                                            listCategory?.map((item, index) => {
                                                return (
                                                    <Col key={`index-${index}`} span={24} style={{ padding: '7px 0' }}>
                                                        <Checkbox value={item.value} >
                                                            {item.label}
                                                        </Checkbox>
                                                    </Col>
                                                )
                                            })
                                        }
                                    </Row>
                                </Checkbox.Group>
                            </Form.Item>
                            <Divider />
                            <Form.Item
                                label="Khoảng giá"
                                labelCol={{ span: 24 }}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
                                    <Form.Item name={["range", 'from']}>
                                        <InputNumber
                                            name='from'
                                            min={0}
                                            placeholder="đ TỪ"
                                            formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                        />
                                    </Form.Item>
                                    <span >-</span>
                                    <Form.Item name={["range", 'to']}>
                                        <InputNumber
                                            name='to'
                                            min={0}
                                            placeholder="đ ĐẾN"
                                            formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                        />
                                    </Form.Item>
                                </div>
                                <div>
                                    <Button onClick={() => form.submit()}
                                        style={{ width: "100%" }} type='primary'>Áp dụng</Button>
                                </div>
                            </Form.Item>
                            <Divider />
                            <Form.Item
                                label="Đánh giá"
                                labelCol={{ span: 24 }}
                            >
                                <div>
                                    <Rate value={5} disabled style={{ color: '#ffce3d', fontSize: 15 }} />
                                    <span className="ant-rate-text"></span>
                                </div>
                                <div>
                                    <Rate value={4} disabled style={{ color: '#ffce3d', fontSize: 15 }} />
                                    <span className="ant-rate-text">trở lên</span>
                                </div>
                                <div>
                                    <Rate value={3} disabled style={{ color: '#ffce3d', fontSize: 15 }} />
                                    <span className="ant-rate-text">trở lên</span>
                                </div>
                                <div>
                                    <Rate value={2} disabled style={{ color: '#ffce3d', fontSize: 15 }} />
                                    <span className="ant-rate-text">trở lên</span>
                                </div>
                                <div>
                                    <Rate value={1} disabled style={{ color: '#ffce3d', fontSize: 15 }} />
                                    <span className="ant-rate-text">trở lên</span>
                                </div>
                            </Form.Item>
                        </Form>
                    </div>
                </Col>
                <Col md={19} xs={24}>
                    <div style={{ padding: '20px', backgroundColor: '#fff', borderRadius: '10px' }}>
                        <Row>
                            <Tabs defaultActiveKey="_sort=sold&_order=desc" items={items} onChange={(value) => setSortQuery(value)} />
                        </Row>
                        <span onClick={() => showDrawer()}> <FilterTwoTone /><strong style={{ paddingLeft: '10px' }}>Lọc</strong></span>
                        <Spin spinning={isLoading} tip="Loading...">
                            <Row className='customize-row'>
                                {
                                    listBook?.map((item, index) => {
                                        return (
                                            <div
                                                key={`book-${index}`}
                                                className="column"
                                                onClick={() => handleRedirectBook(item)}
                                            >
                                                <div className='wrapper'>
                                                    <div className='thumbnail'>
                                                        <img src={item.thumbnail[0].name} alt="thumbnail book" />
                                                    </div>
                                                    <div className='text'>{item.name}</div>
                                                    <div className='price'>
                                                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price)}
                                                    </div>
                                                    <div className='rating'>
                                                        <Rate value={5} disabled style={{ color: '#ffce3d', fontSize: 10 }} />
                                                        <span>Đã bán {item.sold}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })
                                }
                            </Row>
                        </Spin>
                        <Divider />
                        <Row style={{ display: "flex", justifyContent: "center" }}>
                            <Pagination
                                current={current}
                                pageSize={pageSize}
                                total={total}
                                responsive
                                onChange={(p, s) => handleOnchangePage({ current: p, pageSize: s })}
                            />
                        </Row>
                    </div>
                </Col>
            </Row>
            <Drawer title="Lọc sản phẩm" onClose={onClose} open={open}>
                <Form
                    onFinish={onFinish}
                    form={form}
                    onValuesChange={(changedValues, values) => handleChangeFilter(changedValues, values)}
                >
                    <Form.Item
                        name="category"
                        label="Danh mục sản phẩm"
                        labelCol={{ span: 24 }}
                    >
                        <Checkbox.Group>
                            <Row>
                                {
                                    listCategory?.map((item, index) => {
                                        return (
                                            <Col key={`index-${index}`} span={24} style={{ padding: '7px 0' }}>
                                                <Checkbox value={item.value} >
                                                    {item.label}
                                                </Checkbox>
                                            </Col>
                                        )
                                    })
                                }
                            </Row>
                        </Checkbox.Group>
                    </Form.Item>
                    <Divider />
                    <Form.Item
                        label="Khoảng giá"
                        labelCol={{ span: 24 }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
                            <Form.Item name={["range", 'from']}>
                                <InputNumber
                                    name='from'
                                    min={0}
                                    placeholder="đ TỪ"
                                    formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                />
                            </Form.Item>
                            <span >-</span>
                            <Form.Item name={["range", 'to']}>
                                <InputNumber
                                    name='to'
                                    min={0}
                                    placeholder="đ ĐẾN"
                                    formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                />
                            </Form.Item>
                        </div>
                        <div>
                            <Button onClick={() => form.submit()}
                                style={{ width: "100%" }} type='primary'>Áp dụng</Button>
                        </div>
                    </Form.Item>
                    <Divider />
                    <Form.Item
                        label="Đánh giá"
                        labelCol={{ span: 24 }}
                    >
                        <div>
                            <Rate value={5} disabled style={{ color: '#ffce3d', fontSize: 15 }} />
                            <span className="ant-rate-text"></span>
                        </div>
                        <div>
                            <Rate value={4} disabled style={{ color: '#ffce3d', fontSize: 15 }} />
                            <span className="ant-rate-text">trở lên</span>
                        </div>
                        <div>
                            <Rate value={3} disabled style={{ color: '#ffce3d', fontSize: 15 }} />
                            <span className="ant-rate-text">trở lên</span>
                        </div>
                        <div>
                            <Rate value={2} disabled style={{ color: '#ffce3d', fontSize: 15 }} />
                            <span className="ant-rate-text">trở lên</span>
                        </div>
                        <div>
                            <Rate value={1} disabled style={{ color: '#ffce3d', fontSize: 15 }} />
                            <span className="ant-rate-text">trở lên</span>
                        </div>
                    </Form.Item>
                </Form>
            </Drawer>
        </div>
    )
}

export default Home;