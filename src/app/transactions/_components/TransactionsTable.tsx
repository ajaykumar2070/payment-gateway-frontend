'use client'
import { Badge } from "@/components/ui/badge"
import { Transaction } from "@/redux/features/paymentSlice"
import { useAppSelector } from "@/redux/hooks"
import { DollarIcon, FileEmptyIcon, RupeeIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import MobileCard from "./MobileCards"
import DesktopRow from "./DesktopRow"

export default function TransactionsTable() {
    const transactions = useAppSelector(s => s.payment.transactions)
    const hasTransactions = transactions.length > 0
    return (
        <section className="p-4 md:p-6 md:h-screen">
            <div className="max-w-7xl mx-auto bg-[#f2f2f2] p-4 rounded-2xl h-full">
                <h2 className="text-2xl font-bold">Recent Transactions:</h2>
                {hasTransactions &&
                    <div className="hidden md:grid grid-cols-5 font-medium opacity-50 mt-6 border-b border-black/20 py-2">
                        <p>Transaction Id</p>
                        <p className="text-center">Amount</p>
                        <p className="text-center">Card Number</p>
                        <p className="text-center">Attempts</p>
                        <p className="text-end">Status</p>
                    </div>
                }
                <div className="md:max-h-[calc(100vh-180px)] overflow-y-auto">
                    {
                        !hasTransactions ?
                            <div className="bg-white shadow p-8 text-center border border-black/5 rounded-3xl w-md mx-auto mt-10 space-y-4">
                                <HugeiconsIcon icon={FileEmptyIcon} className="mx-auto opacity-50" size={80} />
                                <h2 className="text-3xl font-semibold opacity-50">No Transactions yet</h2>
                            </div>
                            :
                            (
                                transactions.map((transaction, i) => {
                                    const formatted = (transaction.transactionId).slice(0, 8) + "..." + (transaction.transactionId).slice(-8)
                                    const status = transaction.status === 'success' ? 'success' : transaction.status === 'failed' ? 'failed' : 'timeout'
                                    return (
                                        <>
                                            <div className="hidden md:block">
                                                <DesktopRow transaction={transaction} formatted={formatted} status={status} />
                                            </div>
                                            <div className="md:hidden mt-4">
                                                <MobileCard transaction={transaction} formatted={formatted} status={status} />
                                            </div>

                                        </>
                                    )
                                })
                            )
                    }
                </div>
            </div>
        </section>
    )
}




