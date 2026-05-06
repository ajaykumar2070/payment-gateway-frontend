export type AmountType = "usd" | "inr"
export type PaymentStatus = "idle" | "processing" | "success" | "failed" | "timeout"

export interface Transaction {
    transactionId: string,
    amount: string,
    cardNumber: string,
    retryCount: number,
    currency: string,
    status: PaymentStatus
}