import { createSlice } from '@reduxjs/toolkit'
import { message } from 'antd';

const initialState = {
    carts: []
}

export const orderSlice = createSlice({
    name: 'order',
    initialState,
    reducers: {
        doAddBookAction: (state, action) => {
            let carts = state.carts
            const item = action.payload

            let isExistIndex = carts.findIndex(c => c.id === item.id)
            if (isExistIndex > -1) {
                carts[isExistIndex].quantityCart = carts[isExistIndex].quantityCart + item.quantityCart
                if (carts[isExistIndex].quantityCart > carts[isExistIndex].detail.quantity) {
                    carts[isExistIndex].quantityCart = carts[isExistIndex].detail.quantity
                }
            } else {
                carts.push({ quantityCart: item.quantityCart, id: item.id, detail: item.detail })
            }
            state.carts = carts
            message.success("Sản phẩm đã được thêm vào giỏ hàng!")
        },
        doUpdateCartAction: (state, action) => {
            let carts = state.carts
            const item = action.payload

            let isExistIndex = carts.findIndex(c => c.id === item.id)
            if (isExistIndex > -1) {
                carts[isExistIndex].quantityCart = item.quantityCart
                if (carts[isExistIndex].quantityCart > carts[isExistIndex].detail.quantity) {
                    carts[isExistIndex].quantityCart = carts[isExistIndex].detail.quantity
                }
            } else {
                carts.push({ quantityCart: item.quantityCart, id: item.id, detail: item.detail })
            }
            state.carts = carts
        },
        doDeleteItemCartAction: (state, action) => {
            state.carts = state.carts.filter(c => c.id !== action.payload.id)
        },
        doPlaceOrderAction: (state, action) => {
            state.carts = []
        }
    },
})

// Action creators are generated for each case reducer function
export const { doAddBookAction, doUpdateCartAction, doDeleteItemCartAction, doPlaceOrderAction } = orderSlice.actions

export default orderSlice.reducer