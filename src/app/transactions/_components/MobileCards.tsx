import { Badge } from "@/components/ui/badge"
import { Transaction } from "@/redux/features/paymentSlice"
import { DollarIcon, RupeeIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

interface TransactionProps {
    transaction: Transaction
    formatted: string
    status: "failed" | "success" | "timeout"
}
export default function MobileCard({ transaction, formatted, status }: TransactionProps) {
    return (
        <div
            key={transaction.transactionId}
            className="bg-white rounded-2xl shadow-sm border border-black/5 p-4 space-y-3"
        >
            {/* Top row */}
            <div className="flex justify-between items-center">
                <p className="text-xs text-zinc-500">Transaction</p>
                <Badge variant={status} className="capitalize">
                    {transaction.status}
                </Badge>
            </div>

            {/* Transaction ID */}
            <p className="text-sm font-medium break-all">
                {formatted}
            </p>

            {/* Amount */}
            <div className="flex justify-between text-sm">
                <p className="text-zinc-500">Amount</p>
                <div className="flex items-center gap-1 font-medium">
                    <HugeiconsIcon
                        icon={transaction.currency === "usd" ? DollarIcon : RupeeIcon}
                        size={14}
                        strokeWidth={3}
                        className="opacity-80"
                    />
                    {transaction.amount}
                </div>
            </div>

            {/* Card Number */}
            <div className="flex justify-between text-sm">
                <p className="text-zinc-500">Card</p>
                <p className="font-medium">{transaction.cardNumber}</p>
            </div>

            {/* Attempts */}
            <div className="flex justify-between text-sm">
                <p className="text-zinc-500">Attempts</p>
                <p className="font-medium">
                    {transaction.retryCount} / 3
                </p>
            </div>
        </div>
    )
}