'use client'
import { useAppSelector } from "@/redux/hooks";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Dispatch, SetStateAction } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { CheckCheck, ClockAlertIcon, LoaderCircle, SettingsError01Icon, StopCircleIcon } from "@hugeicons/core-free-icons";
import { Button } from "../ui/button";

interface StatusModalProps {
    open: boolean
    setOpen: Dispatch<SetStateAction<boolean>>
    retryAttempts: number
    onRetry: () => void
    errorMessage: string
}
export default function StatusModal({ open, setOpen, retryAttempts, onRetry, errorMessage }: StatusModalProps) {
    const paymentStatus = useAppSelector(s => s.payment.paymentStatus)
    return (
        <Dialog
            open={open}
            onOpenChange={(val) => {
                if (paymentStatus !== "processing") setOpen(val);
            }}>
            {/* <DialogTrigger>Open</DialogTrigger> */}
            <DialogContent showCloseButton={false}>
                <DialogHeader>
                    <DialogTitle className="text-center text-2xl font-bold capitalize">Payment {paymentStatus}</DialogTitle>
                </DialogHeader>
                {/* Processing */}
                {paymentStatus === 'processing' &&
                    <div className="flex flex-col items-center gap-4">
                        <HugeiconsIcon
                            icon={LoaderCircle}
                            size={48}
                            className="animate-spin"
                        />

                        <p>Processing your payment...</p>
                    </div>
                }

                {/* Failed */}
                {paymentStatus === 'failed' &&
                    <div className="flex flex-col items-center gap-4">
                        <div className="bg-red-600/10 rounded-full p-3">
                            <HugeiconsIcon
                                icon={SettingsError01Icon}
                                size={40}
                                className="text-red-600"
                            />
                        </div>
                        <p className="opacity-50 font-medium text-lg">
                            Payment failed. {errorMessage}
                        </p>
                    </div>
                }

                {/* Timeout */}
                {paymentStatus === 'timeout' &&
                    <div className="flex flex-col items-center gap-4">
                        <div className="bg-yellow-600/20 rounded-full p-3">
                        <HugeiconsIcon
                            icon={ClockAlertIcon}
                            size={40}
                            className="text-yellow-600"
                        />
                        </div>
                        <p className="opacity-50 font-medium text-lg"> Request timed out. Retry payment.</p>
                    </div>
                }

                {/* Success */}
                {paymentStatus === 'success' &&
                    <div className="flex flex-col items-center gap-4">
                        <div className="bg-green-600/20 rounded-full p-3">
                            <HugeiconsIcon
                                icon={CheckCheck}
                                size={40}
                                className="text-green-600"
                            />
                        </div>
                        <p className="opacity-50 font-medium text-lg">
                            Payment successful.
                        </p>
                    </div>
                }

                {paymentStatus === "failed" || paymentStatus === "timeout" ? (
                    <div className="space-y-2">
                        <Button
                            className="mt-2 w-full border py-2"
                            onClick={onRetry}
                            disabled={retryAttempts >= 3}
                        >
                            Retry
                        </Button>
                        <p className="opacity-50 text-center text-sm"> Attempt {retryAttempts} of 3 </p>
                    </div>
                ) : null}

            </DialogContent>
        </Dialog>
    )
}