import React, { useEffect, useState } from 'react';
import { Table, Row, Col, Popconfirm, Typography } from 'antd';
import { EditTwoTone, DeleteTwoTone } from '@ant-design/icons';
import { callFetchOrderHistory } from '../../../services/api';

const History = () => {
    const [listUser, setListUser] = useState()
    const [current, setCurrent] = useState(1)
    const [pageSize, setPageSize] = useState(5)
    const [total, setTotal] = useState(2)
    const [sortQuery, setSortQuery] = useState("")
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        fetchOrder()
    }, [current, pageSize, sortQuery])

    const fetchOrder = async () => {
        setIsLoading(true)
        let query = `_page=${current}&_limit=${pageSize}`
        if (sortQuery) {
            query += `&${sortQuery}`
        }
        const res = await callFetchOrderHistory(query)
        if (res?.data) {
            setListUser(res.data)
            setTotal(parseInt(res.headers.get('X-Total-Count'), 10))
        }
        setIsLoading(false)
    }

    const columns = [
        {
            title: 'ID',
            dataIndex: 'userId',
            sorter: true,
        },
        {
            title: 'Tổng giá đơn hàng',
            dataIndex: 'totalPrice',
            render: (record) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(record),
            sorter: true,
        },
        {
            title: 'Tên',
            dataIndex: 'name',
            sorter: true,
        },
        {
            title: 'Địa chỉ',
            dataIndex: 'address',
            sorter: true,
        },
        {
            title: 'Số điện thoại',
            dataIndex: 'phone',
            sorter: true,
        },
        {
            title: 'Ngày cập nhật',
            dataIndex: 'updatedAt',
            sorter: true,
        },
    ];

    const onChange = (pagination, filters, sorter, extra) => {
        if (pagination && pagination.current !== current) {
            setCurrent(pagination.current)
        }
        if (pagination && pagination.pageSize !== pageSize) {
            setPageSize(pagination.pageSize)
            setCurrent(1)
        }
        if (sorter?.field) {
            const q = sorter.order === 'ascend' ? `_sort=${sorter.field}&_order=asc` : `_sort=${sorter.field}&_order=desc`
            setSortQuery(q)
        }
    };


    return (
        <>
            <Row gutter={[20, 20]}>
                <Col span={24}>
                    <Table
                        title={() => <>Danh sách đơn hàng</>}
                        columns={columns}
                        dataSource={listUser}
                        onChange={onChange}
                        rowKey={'id'}
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
                </Col>
            </Row>

        </>
    )
}


export default History;