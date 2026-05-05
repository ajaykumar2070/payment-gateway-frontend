'use client'
import CardIcon from "./CardIcon";

interface CardPreviewProps {
    name: string;
    cardNumber: string;
    expiry: string;
}

export default function CardPreview({ name, cardNumber, expiry }: CardPreviewProps) {
    return (
        <div className="w-full h-50">
            <div className={`relative w-full h-full`}>
                <div className="absolute w-full h-full rounded-2xl p-5 bg-linear-to-r from-sky-500 to-blue-600 text-white">
                    <div className="flex justify-between items-center">
                        <p className="text-sm opacity-80">Card Preview</p>
                        <CardIcon card_number={cardNumber} className="h-6 w-12" />
                    </div>
                    <div className="mt-6 text-lg tracking-widest">
                        {cardNumber ? cardNumber : "#### #### #### ####"}
                    </div>
                    <div className="flex justify-between mt-6 text-sm">
                        <div>
                            <p className="opacity-70">Card Holder</p>
                            <p className="uppercase font-semibold">{name || "FULL NAME"}</p>
                        </div>
                        <div>
                            <p className="opacity-70">Expires</p>
                            <p className="font-semibold">{expiry || "MM/YY"}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}