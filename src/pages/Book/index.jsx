import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import ViewDetail from '../../components/Book/ViewDetail'
import { callFetchBookDetail } from '../../services/api'

const Book = () => {
    const [dataBook, setDataBook] = useState()
    let location = useLocation()

    let params = new URLSearchParams(location.search)
    const id = params?.get("id")

    const fetchBookDetail = async () => {
        const res = await callFetchBookDetail(id)
        if (res?.data) {
            let raw = res.data
            raw.items = getImages(raw)
            setDataBook(raw)
        }
    }

    useEffect(() => {
        fetchBookDetail()
    }, [id])


    const getImages = (raw) => {
        const images = []
        if (raw.thumbnail) {
            images.push({
                original: `${raw.thumbnail[0].name}`,
                thumbnail: `${raw.thumbnail[0].name}`,
                originalClass: "original-image",
                thumbnailClass: "thumbnail-image"
            })
        }
        if (raw.slider) {
            raw.slider?.map(item => {
                images.push(
                    {
                        original: `${item.name}`,
                        thumbnail: `${item.name}`,
                        originalClass: "original-image",
                        thumbnailClass: "thumbnail-image"
                    },
                )
            })
        }
        return images;
    }


    return (
        <div><ViewDetail dataBook={dataBook} /></div>
    )
}

export default Book