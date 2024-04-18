import React, { useEffect, useState } from 'react';
import { Badge, Descriptions, Divider, Drawer, Modal, Upload } from 'antd';
import { v4 as uuidv4 } from 'uuid';

const BookViewDetail = (props) => {

    const { openViewDetail, setOpenViewDetail, dataViewDetail, setDataViewDetail } = props

    const getBase64 = (file) => {
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
        });
    }

    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [previewTitle, setPreviewTitle] = useState('');
    const [fileList, setFileList] = useState([]);

    useEffect(() => {
        if (dataViewDetail) {
            let imgThumbnail = {}, imgSlider = []
            if (dataViewDetail?.thumbnail) {
                imgThumbnail = {
                    uid: uuidv4(),
                    name: 'Thumbnail',
                    status: 'done',
                    url: `${dataViewDetail.thumbnail[0].name}`
                }
            }
            if (dataViewDetail.slider && dataViewDetail.slider.length > 0) {
                dataViewDetail.slider.map(item => {
                    imgSlider.push({
                        uid: uuidv4(),
                        name: 'Slider',
                        status: 'done',
                        url: `${item.name}`
                    })
                })
            }
            setFileList([imgThumbnail, ...imgSlider])
        }
    }, [dataViewDetail])

    const handleCancel = () => setPreviewOpen(false);

    const handlePreview = async (file) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }

        setPreviewImage(file.url || (file.preview));
        setPreviewOpen(true);
        setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
    };

    const handleChange = ({ fileList: newFileList }) => {
        setFileList(newFileList);
    }

    const onClose = () => {
        setOpenViewDetail(false);
        setDataViewDetail(null)
    };

    return (
        <>
            <Drawer
                title="Thông tin chi tiết"
                onClose={onClose}
                open={openViewDetail}
                width={'50vw'}
            >
                <Descriptions
                    title="Thông tin Sách"
                    bordered
                    column={2}
                >
                    <Descriptions.Item label="ID">{dataViewDetail?.id}</Descriptions.Item>
                    <Descriptions.Item label="Tên Sách">{dataViewDetail?.name}</Descriptions.Item>
                    <Descriptions.Item label="Thể loại">{dataViewDetail?.category}</Descriptions.Item>
                    <Descriptions.Item label="Tác giả">{dataViewDetail?.author}</Descriptions.Item>
                    <Descriptions.Item label="Giá tiền" span={2}>
                        <Badge status='processing' text={dataViewDetail?.price} />
                    </Descriptions.Item>
                    <Descriptions.Item label="Số lượng">{dataViewDetail?.quantity}</Descriptions.Item>
                    <Descriptions.Item label="Đã bán">{dataViewDetail?.sold}</Descriptions.Item>
                </Descriptions>
                <Divider orientation={'left'}>Ảnh sách</Divider>
                <Upload
                    listType="picture-card"
                    fileList={fileList}
                    onPreview={handlePreview}
                    onChange={handleChange}
                    showUploadList={
                        { showRemoveIcon: false }
                    }
                >
                </Upload>
                <Modal open={previewOpen} title={previewTitle} footer={null} onCancel={handleCancel}>
                    <img alt="example" style={{ width: '100%' }} src={previewImage} />
                </Modal>
            </Drawer>
        </>
    );
};

export default BookViewDetail;