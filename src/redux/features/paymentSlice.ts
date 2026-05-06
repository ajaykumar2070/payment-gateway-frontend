'use client'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export type PaymentStatus = "idle" | "processing" | "success" | "failed" | "timeout"
interface Transaction {
    transactionId: string,
    amount: string,
    cardNumber: string,
    retryCount: number,
    currency: string,
    status: PaymentStatus
}
interface PaymetSliceTypes {
    paymentStatus: PaymentStatus
    transactions: Transaction[]
}

const getTransactions = () => {
    try {
        const transactions = localStorage.getItem("transactions")
        if (!transactions) return []
        return JSON.parse(transactions)
    } catch (error) {
        console.log(error)
    }
}

const initialState: PaymetSliceTypes = {
    paymentStatus: "idle",
    transactions: getTransactions()
}
const paymentSlice = createSlice({
    name: "payment",
    initialState,
    reducers: {
        setPaymentStatus: (state, action: PayloadAction<PaymentStatus>) => {
            state.paymentStatus = action.payload
        },
        setTransactions: (state, action: PayloadAction<Transaction>) => {
            const index = state.transactions.findIndex(transaction => transaction.transactionId === action.payload.transactionId)
            if (index !== -1) {
                state.transactions[index] = action.payload
            } else {
                state.transactions.push(action.payload)
            }

            localStorage.setItem("transactions", JSON.stringify(state.transactions))
        }
    }
})

export const { setPaymentStatus, setTransactions } = paymentSlice.actions
export default paymentSlice.reducer