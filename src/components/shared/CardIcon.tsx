import { getCardType } from "@/lib/utils"
import { CreditCardIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import Image from "next/image"

interface CardIconProps {
    card_number: string
    className?: string
}
export default function CardIcon({ card_number, className }: CardIconProps) {
    const cardType = getCardType(card_number)
    return (
        <>
            {
                cardType === "unknown" ?
                    <HugeiconsIcon icon={CreditCardIcon} size={16} />
                    :
                    <div className={`${className}`}>
                        <Image src={`/media/${cardType}.png`} alt="card-icon" height={50} width={50} className="w-full" />
                    </div>
            }
        </>
    )
}