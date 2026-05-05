'use client'
import { createSlice } from '@reduxjs/toolkit'

const paymentSlice = createSlice({
    name: "payment",
    initialState: {
        paymentStatus: "idle"
    },
    reducers: {
        setPaymentStatus: (state) => {
            state.paymentStatus = "success"
        }
    }
})

export const {setPaymentStatus} = paymentSlice.actions
export default paymentSlice.reducer