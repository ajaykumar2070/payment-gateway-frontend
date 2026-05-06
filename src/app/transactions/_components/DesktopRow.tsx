import { Badge } from "@/components/ui/badge"
import { Transaction } from "@/redux/features/paymentSlice"
import { DollarIcon, RupeeIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

interface TransactionProps {
    transaction: Transaction
    formatted: string
    status: "failed" | "success" | "timeout"
}
export default function DesktopRow({ transaction, formatted, status }: TransactionProps) {
    return (
        <div key={transaction.transactionId} className="hidden md:grid grid-cols-5 border-b border-black/5 py-4 text-base">
            <p>{formatted}</p>
            <div className="flex items-center justify-center gap-0.5">
                <HugeiconsIcon icon={transaction.currency === 'usd' ? DollarIcon : RupeeIcon} size={15} strokeWidth={3} className="opacity-80" />
                <p className="text-center">{transaction.amount}</p>
            </div>
            <p className="text-center">{transaction.cardNumber}</p>
            <p className="text-center">{transaction.retryCount}</p>
            <p className="text-end">
                <Badge variant={status} className="capitalize">{transaction.status}</Badge>
            </p>
        </div>
    )
}