export async function POST(req: Request) {
    try {
        const { name, card_number, cvv, expiry_date, amount } = await req.json()

        const random = Math.random();

        // 60% success
        if (random < 0.60) {
            return new Response("Transaction successful");
        }
        // 25% failure
        else if (random < 0.85) {
            throw new Error("Insufficient funds")
        }
        // 15% delayed response
        else {
            await new Promise(resolve => setTimeout(resolve, 8000));
            return new Response("Request delayed", { status: 504 })
        }
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Unexpected error';
        return new Response(message, { status: 500 });
    }
}