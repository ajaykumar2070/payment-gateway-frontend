'use client'
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Dollar01Icon, RupeeIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useForm } from "react-hook-form";
import z from "zod"
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import CardPreview from "@/components/shared/CardPreview";
import { formatCardNumber } from "@/lib/utils";
import { paymentSchema } from "@/lib/validations";
import CardIcon from "@/components/shared/CardIcon";

type CardInputTypes = z.infer<typeof paymentSchema>
type AmountType = "usd" | "inr"

export default function PaymentForm() {
    const [amountType, setAmountType] = useState<AmountType>('usd')
    const { register, handleSubmit, setValue, watch, formState: { errors, isSubmitting, isValid } } = useForm<CardInputTypes>({
        resolver: zodResolver(paymentSchema),
        mode: "all",
        reValidateMode: "onChange"
    })
    
    const onSubmit = (data: CardInputTypes) => {
        try {
            const transactionId = crypto.randomUUID()
            console.log('transactionId', transactionId)
            console.log('form submit', data)
        } catch (error) {
            console.log(error)
        }
    }

    const cardNumber = watch("card_number")

    return (
        <div className="bg-white shadow-xl rounded-3xl overflow-hidden grid grid-cols-2 w-4xl">
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
                    <Button type="submit" disabled={!isValid || isSubmitting}>Submit</Button>
                </div>
            </form>

            {/* Card preview */}
            <div className="bg-black/10 p-6">
                <CardPreview
                    name={watch("name")}
                    cardNumber={watch("card_number")}
                    expiry={watch("expiry_date")}
                />
            </div>
        </div>
    );
}
