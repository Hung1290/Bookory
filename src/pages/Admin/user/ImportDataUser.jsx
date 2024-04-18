import React, { useState } from 'react';
import { Divider, Modal, Table, Upload, message, notification } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import * as XLSX from "xlsx"
import templateFile from './templateFile.xlsx?url'

const ImportDataUser = (props) => {
    const [dataExcel, setDataExcel] = useState([])

    const handleCancel = () => {
        props.setOpenImportDataUser(false);
        setDataExcel([])
    };

    const dummyRequest = ({ file, onSuccess }) => {
        setTimeout(() => {
            onSuccess("ok");
        }, 1000);
    };

    const { Dragger } = Upload;

    const propsUpLoad = {
        name: 'file',
        multiple: false,
        maxCount: 1,
        accept: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        customRequest: dummyRequest,
        onChange(info) {
            const { status } = info.file;
            if (status !== 'uploading') {
                console.log(info.file, info.fileList);
            }
            if (status === 'done') {
                const file = info.fileList[0].originFileObj
                const reader = new FileReader();
                reader.readAsArrayBuffer(file);

                reader.onload = function (e) {
                    const data = new Uint8Array(reader.result);
                    const workbook = XLSX.read(data, { type: 'array' });
                    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
                    const jsonData = XLSX.utils.sheet_to_json(worksheet, {
                        header: ['fullName', 'email', 'phone'],
                        range: 1
                    });
                    if (jsonData?.length > 0) setDataExcel(jsonData)
                };
                message.success(`${info.file.name} file uploaded successfully.`);
            } else if (status === 'error') {
                message.error(`${info.file.name} file upload failed.`);
            }
        },
        onDrop(e) {
            console.log('Dropped files', e.dataTransfer.files);
        },
    };

    const columns = [
        {
            title: 'Tên hiển thị',
            dataIndex: 'fullName',
            key: 'name',
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Số điện thoại',
            dataIndex: 'phone',
            key: 'phone',
        },
    ];

    const title = () => {
        return (
            <div>Dữ liệu upload:</div>
        )
    }

    const onSubmit = async () => {
        const data = dataExcel.map((item, index) => {
            item.password = '123'
            return item
        })
        const requests = data.map(post => {
            return fetch('http://localhost:3000/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(post)
            });
        });

        try {
            const responses = await Promise.all(requests);
            const createdPosts = await Promise.all(responses.map(response => response.json()));
            notification.success({
                message: 'Cập nhật thành công!',
                description: `success: ${createdPosts.filter(item => "message" in item).length}, error: ${createdPosts.filter(item => "error" in item).length}`
            })
            props.fetchUser()
            setDataExcel([])
        } catch (error) {
            console.error('Error creating posts:', error);
        }
    }

    return (
        <>
            <Modal
                title="Import data user"
                open={props.openImportDataUser}
                onOk={onSubmit}
                onCancel={handleCancel}
                okText='Import data'
                okButtonProps={{
                    disabled: dataExcel.length < 1
                }}
                cancelText={"Hủy"}
                width={'50vw'}
                maskClosable={false}
            >
                <Dragger {...propsUpLoad}>
                    <p className="ant-upload-drag-icon">
                        <InboxOutlined />
                    </p>
                    <p className="ant-upload-text">Click or drag file to this area to upload</p>
                    <p className="ant-upload-hint">
                        Support for a single upload. Only accept .csv, .xls, .xlsx . Or
                        &nbsp; <a onClick={e => e.stopPropagation()} href={templateFile} download>Download sample file</a>
                    </p>
                </Dragger>
                <Divider />
                <Table
                    title={title}
                    columns={columns}
                    dataSource={dataExcel}
                />
            </Modal>
        </>
    );
};

export default ImportDataUser;