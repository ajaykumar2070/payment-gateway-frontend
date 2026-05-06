export async function POST(req: Request) {
    try {
        const { name, card_number, cvv, expiry_date, amount } = await req.json()

        const random = Math.random();

        // 60% success
        // if (random < 0.60) {
        //     return Response.json({
        //         success: true,
        //         status: "success",
        //         message: "Transaction successful",
        //     })
        // }

        // // 25% failure
        // else if (random < 0.85) {
        //     return Response.json({
        //         success: false,
        //         status: "failed",
        //         message: "Insufficient funds"
        //     },
        //         { status: 402 }
        //     )
        // }

        // if (random < 0.60) {
        //     return Response.json({
        //         success: true,
        //         status: "success",
        //         message: "Transaction successful",
        //     })
        // }

        // 25% failure
        if (random < 0.5) {
            return Response.json({
                success: false,
                status: "failed",
                message: "Insufficient funds"
            },
                { status: 402 }
            )
        }

        // 15% delayed response
        else {
            await new Promise(resolve => setTimeout(resolve, 8000));
            return Response.json(
                {
                    success: false,
                    status: "timeout",
                    message: "Request timed out",
                    retryable: true,
                },
                { status: 408 }
            );
        }
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Unexpected error';
        return new Response(message, { status: 500 });
    }
}