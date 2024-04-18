import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    isAuthenticated: false,
    isLoading: true,
    user: {
        "id": "",
        "avatar": "",
        "fullName": "",
        "email": "",
        "phone": "",
        "password": "",
        "role": ""
    },
    tempAvatar: ""
}

export const accountSlice = createSlice({
    name: 'account',
    initialState,
    reducers: {
        doLoginAction: (state, action) => {
            state.isAuthenticated = true
            state.isLoading = false
            state.user = action.payload
        },
        doLogoutAction: (state, action) => {
            state.isAuthenticated = false
            state.user = {
                "id": "",
                "avatar": "",
                "fullName": "",
                "email": "",
                "phone": "",
                "password": "",
                "role": ""
            }
        },
        doUploadAvatarAction: (state, action) => {
            state.tempAvatar = action.payload.avatar
        },
        doUpdateUserInfoAction: (state, action) => {
            state.user.avatar = action.payload.avatar
            state.user.fullName = action.payload.fullName
            state.user.phone = action.payload.phone
        },
    },
})

// Action creators are generated for each case reducer function
export const { doLoginAction, doLogoutAction, doUploadAvatarAction, doUpdateUserInfoAction } = accountSlice.actions

export default accountSlice.reducer