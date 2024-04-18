import React, { useEffect, useState } from 'react';
import { Table, Row, Col, Button, Form, Input, InputNumber, Popconfirm, Typography, message } from 'antd';
import InputSearch from './InputSearch';
import { callDeleteBook, callFetchBookPaginate, callUpdateBook } from '../../../services/api';
import BookViewDetail from './BookViewDetail';
import { DownloadOutlined, PlusOutlined, ReloadOutlined } from '@ant-design/icons';
import AddNewBook from './AddNewBook';
import * as XLSX from "xlsx"
import { EditTwoTone, DeleteTwoTone } from '@ant-design/icons';

// https://stackblitz.com/run?file=demo.tsx
const BookTable = () => {
    const [listBook, setListBook] = useState()
    const [current, setCurrent] = useState(1)
    const [pageSize, setPageSize] = useState(5)
    const [total, setTotal] = useState(2)

    const [isLoading, setIsLoading] = useState(false)
    const [fillter, setFillter] = useState("")
    const [sortQuery, setSortQuery] = useState("")
    const [dataViewDetail, setDataViewDetail] = useState("")
    const [openViewDetail, setOpenViewDetail] = useState("")
    const [openAddNewBook, setOpenAddNewBook] = useState("")
    const [form] = Form.useForm();
    const [editingKey, setEditingKey] = useState('');

    const EditableCell = ({
        editing,
        dataIndex,
        title,
        inputType,
        record,
        index,
        children,
        ...restProps
    }) => {
        const inputNode = inputType === 'number' ? <InputNumber /> : <Input />;

        return (
            <td {...restProps}>
                {editing ? (
                    <Form.Item
                        name={dataIndex}
                        style={{ margin: 0 }}
                        rules={[
                            {
                                required: true,
                                message: `Không được để trống ${title}!`,
                            },
                        ]}
                    >
                        {inputNode}
                    </Form.Item>
                ) : (
                    children
                )}
            </td>
        );
    };

    const isEditing = (record) => record.id === editingKey;

    const edit = (record) => {
        form.setFieldsValue({ ...record });
        setEditingKey(record.id);
    };

    const cancel = () => {
        setEditingKey('');
    };

    const save = async (key) => {
        try {
            const row = await form.validateFields();
            const newData = [...listBook];
            const index = newData.findIndex((item) => key === item.id);
            if (index > -1) {
                const item = newData[index];
                newData.splice(index, 1, {
                    ...item,
                    ...row,
                });
                const res = await callUpdateBook(item.id, newData[index].name, newData[index].category, newData[index].author, newData[index].price, newData[index].quantity)
                if (res?.data) {
                    setListBook(newData);
                    setEditingKey('');
                }
            } else {
                newData.push(row);
                setListBook(newData);
                setEditingKey('');
            }
        } catch (errInfo) {
            console.log('Validate Failed:', errInfo);
        }
    };

    const handleDelete = async (id) => {
        const res = await callDeleteBook(id)
        if (res?.data) {
            message.success("Xóa sách thành công!")
            fetchBook()
        }
    }

    useEffect(() => {
        fetchBook()
    }, [current, pageSize, fillter, sortQuery])

    const fetchBook = async () => {
        setIsLoading(true)
        let query = `_page=${current}&_limit=${pageSize}`
        if (fillter) {
            query += fillter
        }
        if (sortQuery) {
            query += `&${sortQuery}`
        }
        const res = await callFetchBookPaginate(query)
        if (res?.data) {
            setListBook(res.data)
            setTotal(parseInt(res.headers.get('X-Total-Count'), 10))
        }
        setIsLoading(false)
    }

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            sorter: true,
            render: (text, record, index) => {
                return (
                    <a href='#' onClick={() => {
                        setDataViewDetail(record)
                        setOpenViewDetail(true)
                    }}>{record.id}</a>
                )
            },
            width: 320
        },
        {
            title: 'Tên sách',
            dataIndex: 'name',
            sorter: true,
            editable: true
        },
        {
            title: 'Thể loại',
            dataIndex: 'category',
            sorter: true,
            editable: true
        },
        {
            title: 'Tác giả',
            dataIndex: 'author',
            sorter: true,
            editable: true,
        },
        {
            title: 'Giá tiền',
            dataIndex: 'price',
            sorter: true,
            editable: true,
        },
        {
            title: 'Số lượng',
            dataIndex: 'quantity',
            sorter: true,
            editable: true,
        },
        {
            title: 'Đã bán',
            dataIndex: 'sold',
            sorter: true,
        },
        {
            title: 'Action',
            render: (record) => {
                const editable = isEditing(record);
                return editable ? (
                    <span>
                        <Typography.Link
                            onClick={() => save(record.id)}
                            style={{ marginRight: 8 }}
                        >
                            Save
                        </Typography.Link>
                        <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
                            <a>Cancel</a>
                        </Popconfirm>
                    </span>
                ) : (
                    <>
                        <Popconfirm
                            placement="leftTop"
                            title={"Xác nhận xóa sách"}
                            description={"Bạn có chắc chắn muốn xóa sách này ?"}
                            onConfirm={() => handleDelete(record.id)}
                            okText="Xác nhận"
                            cancelText="Hủy"
                        >
                            <span style={{ cursor: "pointer", margin: " 0 20px" }}>
                                <DeleteTwoTone />
                            </span>
                        </Popconfirm>
                        <Typography.Link
                            disabled={editingKey !== ''}
                            onClick={() => edit(record)}
                        >
                            <EditTwoTone />
                        </Typography.Link>
                    </>
                );
            },
        },
    ];

    const mergedColumns = columns.map((col) => {
        if (!col.editable) {
            return col;
        }
        return {
            ...col,
            onCell: (record) => ({
                record,
                inputType: col.dataIndex === 'quantity' || col.dataIndex === 'price' ? 'number' : 'text',
                dataIndex: col.dataIndex,
                title: col.title,
                editing: isEditing(record),
            }),
        };
    });

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

    const handleSearch = (query) => {
        setFillter(query)
    }

    const handleExportBook = () => {
        const worksheet = XLSX.utils.json_to_sheet(listBook);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
        XLSX.writeFile(workbook, "ExportBook.csv");
    }

    const renderHeader = () => {
        return (
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Table list books</span>
                <span style={{ display: 'flex', gap: 15 }}>
                    <Button
                        type="primary"
                        icon={<DownloadOutlined />}
                        onClick={() => handleExportBook()}
                    >
                        Export
                    </Button>
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={() => { setOpenAddNewBook(true) }}
                    >
                        Thêm mới
                    </Button>
                    <Button
                        type="ghost"
                        icon={<ReloadOutlined />}
                        onClick={() => {
                            setFillter("")
                            setSortQuery("")
                        }}
                    >
                    </Button>
                </span>
            </div>
        )
    }

    return (
        <>
            <Row gutter={[20, 20]}>
                <Col span={24}>
                    <InputSearch handleSearch={handleSearch} />
                </Col>
                <Col span={24}>
                    <Form form={form} component={false}>
                        <Table
                            title={renderHeader}
                            components={{
                                body: {
                                    cell: EditableCell,
                                },
                            }}

                            columns={mergedColumns}
                            dataSource={listBook}
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
                    </Form>
                </Col>
            </Row>


            <BookViewDetail
                openViewDetail={openViewDetail}
                setOpenViewDetail={setOpenViewDetail}
                dataViewDetail={dataViewDetail}
                setDataViewDetail={setDataViewDetail}
            />

            <AddNewBook
                openAddNewBook={openAddNewBook}
                setOpenAddNewBook={setOpenAddNewBook}
                fetchBook={fetchBook}
            />
        </>
    )
}


export default BookTable;