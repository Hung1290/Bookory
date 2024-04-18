import axios from "../utils/axios-customize";

export const callRegister = (fullName, email, phone, password) => {
    return axios.post('/register', { fullName, email, phone, password })
}

export const callLogin = (email, password) => {
    return axios.post('/login', { email, password })
}

export const callFetchUser = () => {
    return axios.get('/users')
}

export const callFetchUserPaginate = (query) => {
    return axios.get(`/users?${query}`)
}

export const callUpdateUser = (id, fullName, phone) => {
    return axios.patch(`/users/${id}`, { fullName, phone })
}

export const callDeleteUser = (id) => {
    return axios.delete(`/users/${id}`)
}

export const callAddNewBook = (name, category, author, price, quantity, sold, thumbnail, slider) => {
    return axios.post('/books', { name, category, author, price, quantity, sold, thumbnail, slider })
}

export const callFetchBookPaginate = (query) => {
    return axios.get(`/books?${query}`)
}

export const callUpdateBook = (id, name, category, author, price, quantity) => {
    return axios.patch(`/books/${id}`, { name, category, author, price, quantity })
}

export const callDeleteBook = (id) => {
    return axios.delete(`/books/${id}`)
}

export const callFetchBookDetail = (id) => {
    return axios.get(`/books/${id}`)
}

export const callFetchCategory = () => {
    return axios.get(`/category`)
}

export const callUploadBookImg = (base64) => {
    return axios.post('/imgBooks', { base64 })
}

export const callPlaceOrder = (userId, name, phone, address, totalPrice, detailOrder) => {
    return axios.post('/order', { userId, name, phone, address, totalPrice, detailOrder })
}

export const callFetchOrderHistory = (query) => {
    return axios.get(`/order?${query}`)
}

export const callUploadAvatar = (base64) => {
    return axios.post('/avatar', { base64 })
}

export const callUpdateUserInfo = (id, avatar, fullName, phone) => {
    return axios.patch(`/users/${id}`, { avatar, fullName, phone })
}

export const callUpdateUserPassword = (id, oldPassword, newPassword) => {
    return axios.put(`/update-password/${id}`, { oldPassword, newPassword })
}
