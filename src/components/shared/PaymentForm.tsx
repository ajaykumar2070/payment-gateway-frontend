'use client'
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { ArrowRight, Dollar01Icon, RupeeIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import CardPreview from "@/components/shared/CardPreview";
import { formatCardNumber } from "@/lib/utils";
import { CardInputTypes, paymentSchema } from "@/lib/validations";
import CardIcon from "@/components/shared/CardIcon";
import { Spinner } from "../ui/spinner";
import { useAppDispatch } from "@/redux/hooks";
import { setPaymentStatus, setTransactions } from "@/redux/features/paymentSlice";
import Link from "next/link";
import StatusModal from "../modals/StatusModal";
import { AmountType, PaymentStatus } from "@/types/payment";

export default function PaymentForm() {
    const dispatch = useAppDispatch()
    const [amountType, setAmountType] = useState<AmountType>('usd')
    const [open, setOpen] = useState(false)
    const [currentTxId, setCurrentTxId] = useState('')
    const [attempt, setAttempt] = useState(1)
    const [lastData, setLastData] = useState<CardInputTypes | null>(null)
    const [errorMessage, setErrorMessage] = useState('')

    const { register, handleSubmit, setValue, watch, reset, formState: { errors, isSubmitting, isValid } } = useForm<CardInputTypes>({
        resolver: zodResolver(paymentSchema),
        mode: "all",
    })

    // process Payment
    const processPayment = async (data: CardInputTypes, transactionId: string, attemptNumber: number) => {
        setOpen(true)
        dispatch(setPaymentStatus("processing"));
        const controller = new AbortController();
        const timeoutId = setTimeout(() => {
            controller.abort();
        }, 6000);

        try {
            const amount = watch("amount")
            await new Promise(resolve => setTimeout(resolve, 2000))
            const res = await fetch("/api/pay", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json"  
                },
                body: JSON.stringify({
                    transaction_id: transactionId,
                    amount
                }),
                signal: controller.signal,
            });

            const result = await res.json();
            const status = result.status;

            if (!res.ok) {
                setErrorMessage(result.message)
            }

            dispatch(setPaymentStatus(status));

            const transaction = {
                transactionId,
                amount: data.amount,
                cardNumber,
                retryCount: attemptNumber,
                currency: amountType,
                status,
            };
            dispatch(setTransactions(transaction));

            // if (status === "success") {
            //     reset();
            // }
            return status;

        } catch (error: any) {
            if (error.name === "AbortError") {
                dispatch(setPaymentStatus("timeout"));

                const transaction = {
                    transactionId,
                    amount: data.amount,
                    cardNumber,
                    retryCount: attemptNumber,
                    currency: amountType,
                    status: "timeout" as PaymentStatus,
                };
                dispatch(setTransactions(transaction))
                return "timeout";
            }

            dispatch(setPaymentStatus("failed"));
            return "failed";
        } finally {
            clearTimeout(timeoutId);
        }
    };

    //handle submit
    const onSubmit = async (data: CardInputTypes) => {
        const transactionId = crypto.randomUUID();
        setCurrentTxId(transactionId)
        setLastData(data)
        await processPayment(data, transactionId, attempt)
    }

    // handle retry
    const handleRetry = async () => {
        if (!lastData) return;
        console.log(attempt)
        if (attempt >= 3) return;

        const nextAttempt = attempt + 1;
        setAttempt(nextAttempt);

        await processPayment(lastData, currentTxId, nextAttempt);

        if (nextAttempt === 3) {
            reset()
            setTimeout(() => {
                setOpen(false)
            }, 2000)
        }
    };

    const cardNumber = watch("card_number")

    return (
        <div className="bg-white shadow-xl rounded-3xl overflow-hidden grid grid-cols-1 md:grid-cols-2 w-full max-w-4xl">
            {/* form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-6">
                <div className="space-y-1">
                    <p className="font-semibold text-xs text-zinc-600">Card older Name*</p>
                    <Input {...register("name")} type="text" placeholder="Card Holder Name" />
                    {errors.name && <p className="text-red-500 text-xs">{errors.name.message}</p>}
                </div>

                <div className="space-y-1">
                    <p className="font-semibold text-xs text-zinc-600">Card Number. *</p>
                    <InputGroup className="overflow-hidden">
                        <InputGroupInput
                            {...register('card_number')}
                            placeholder="0000 0000 0000 000"
                            onChange={(e) => {
                                const formatted = formatCardNumber(e.target.value);
                                setValue("card_number", formatted);
                            }}
                        />

                        <InputGroupAddon align="inline-end">
                            <CardIcon card_number={cardNumber} className="h-5 w-5" />
                        </InputGroupAddon>
                    </InputGroup>
                    {errors.card_number && <p className="text-red-500 text-xs">{errors.card_number.message}</p>}
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                        <p className="font-semibold text-xs text-zinc-600">Expiry Date (mm/yy) *</p>
                        <Input {...register("expiry_date")} type="text" placeholder="MM/YY" />
                        {errors.expiry_date && <p className="text-red-500 text-xs">{errors.expiry_date.message}</p>}
                    </div>

                    <div className="space-y-1">
                        <p className="font-semibold text-xs text-zinc-600">CVV* (3-digit)</p>
                        <Input {...register("cvv")} type="text" placeholder="000" />
                        {errors.cvv && <p className="text-red-500 text-xs">{errors.cvv.message}</p>}
                    </div>
                </div>

                <div className="space-y-1">
                    <p className="font-semibold text-xs text-zinc-600">Amount *</p>
                    <InputGroup className="overflow-hidden">
                        <InputGroupInput {...register("amount")} placeholder="0.00" />
                        <InputGroupAddon>
                            <HugeiconsIcon icon={amountType === 'usd' ? Dollar01Icon : RupeeIcon} size={12} strokeWidth={2.5} className="text-zinc-500" />
                        </InputGroupAddon>
                        <InputGroupAddon align="inline-end" className="flex items-center rounded-full gap-0">
                            {
                                ['usd', 'inr'].map((type, i) => {
                                    return (
                                        <div
                                            key={type + i}
                                            className={`${type === amountType ? 'bg-cyan-500' : ''} py-1 px-2 uppercase rounded-md cursor-pointer text-black`}
                                            onClick={() => setAmountType(type as AmountType)}>{type}</div>
                                    )
                                })
                            }
                        </InputGroupAddon>
                    </InputGroup>
                    {errors.amount && <p className="text-red-500 text-xs">{errors.amount.message}</p>}
                </div>

                <div className="w-fit mx-auto">
                    <Button type="submit" disabled={!isValid || isSubmitting}>
                        Submit
                        {isSubmitting && <Spinner />}
                    </Button>
                </div>
            </form>

            {/* Card preview */}
            <div className="bg-black/15 md:bg-black/10 p-6 relative">
                <CardPreview
                    name={watch("name")}
                    cardNumber={cardNumber}
                    expiry={watch("expiry_date")}
                />
                <div className="w-fit mx-auto mt-8 md:absolute bottom-4 right-4">
                    <Link href="/transactions">
                        <Button className="mx-auto bg-cyan-600">
                            View Recent Transactions
                            <HugeiconsIcon icon={ArrowRight} size={16} />
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Dialog */}
            <StatusModal
                open={open}
                setOpen={setOpen}
                retryAttempts={attempt}
                onRetry={handleRetry}
                errorMessage={errorMessage}
            />
        </div>
    );
}
