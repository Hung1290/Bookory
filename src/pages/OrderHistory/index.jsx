import React, { useEffect, useState } from 'react';
import { Table, Tag } from 'antd';
import { callFetchOrderHistory } from '../../services/api';
import ReactJson from 'react-json-view'
import { useSelector } from 'react-redux';

const OrderHistory = () => {
    const [listOrderHistory, setListOrderHistory] = useState()
    const [current, setCurrent] = useState(1)
    const [pageSize, setPageSize] = useState(5)
    const [total, setTotal] = useState(2)
    const [isLoading, setIsLoading] = useState(false)
    const user = useSelector(state => state.account.user)

    const fetchHistory = async () => {
        setIsLoading(true)
        let query = `userId=${user.id}&_page=${current}&_limit=${pageSize}`
        const res = await callFetchOrderHistory(query)
        if (res?.data) {
            setListOrderHistory(res.data)
            setTotal(parseInt(res.headers.get('X-Total-Count'), 10))
        }
        setIsLoading(false)
    }

    useEffect(() => {
        fetchHistory()
    }, [current, pageSize])

    const columns = [
        {
            title: 'STT',
            render: (text, record, index) => index + 1,
        },
        {
            title: 'Thời gian',
            dataIndex: 'createdAt',
        },
        {
            title: 'Tổng số tiền',
            dataIndex: 'totalPrice',
            render: (record) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(record),
        },
        {
            title: 'Trạng thái',
            render: () =>
                <Tag color={'green'}>
                    Thành công
                </Tag>
        },
        {
            title: 'Chi tiết',
            render: (record) => <ReactJson name='Chi tiết đơn hàng' src={record.detailOrder} collapsed={true} />,
        },
    ];

    return (
        <>
            <div style={{ maxWidth: '1440px', margin: '0 auto' }}>
                <div style={{ marginBottom: '10px' }}>
                    Lịch sử đặt hàng:
                </div>
                <Table
                    columns={columns}
                    dataSource={listOrderHistory}
                    loading={isLoading}
                    pagination={
                        {
                            current: current,
                            pageSize: pageSize,
                            showSizeChanger: true,
                            total: total,
                            showTotal: (total, range) => { return (<div>{range[0]} - {range[1]} trên {total} rows</div>) }
                        }
                    }
                />
            </div>
        </>
    )
}


export default OrderHistory;