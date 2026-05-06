type PaymentRequest = {
  transaction_id: string;
  amount: number;
};

type PaymentSuccess = {
  success: true;
  status: "success";
  message: string;
};

type PaymentFailure = {
  success: false;
  status: "failed";
  message: string;
};

type PaymentTimeout = {
  success: false;
  status: "timeout";
  message: string;
  retryable: true;
};

type PaymentResponse = PaymentSuccess | PaymentFailure | PaymentTimeout;

type StoreEntry =
  | {
      state: "processing";
      promise: Promise<{ statusCode: number; result: PaymentResponse }>;
    }
  | {
      state: "completed";
      statusCode: number;
      result: PaymentResponse;
    };

const store = new Map<string, StoreEntry>();

export async function POST(req: Request) {
  try {
    const body: PaymentRequest = await req.json();
    const { transaction_id, amount } = body;

    if (!transaction_id) {
      return Response.json(
        {
          success: false,
          status: "failed",
          message: "transaction_id is required",
        } satisfies PaymentFailure,
        { status: 400 }
      );
    }

    // Idempotency check
    const existing = store.get(transaction_id);

    if (existing) {
      if (existing.state === "processing") {
        const result = await existing.promise;
        return Response.json(result.result, {
          status: result.statusCode,
        });
      }

      return Response.json(existing.result, {
        status: existing.statusCode,
      });
    }

    // Create processing promise
    const processingPromise: Promise<{
      statusCode: number;
      result: PaymentResponse;
    }> = (async () => {
      await new Promise((r) => setTimeout(r, 2000));

      const rand = Math.random();

      if (rand < 0.6) {
        return {
          statusCode: 200,
          result: {
            success: true,
            status: "success",
            message: "Transaction successful",
          },
        };
      } else if (rand < 0.85) {
        return {
          statusCode: 402,
          result: {
            success: false,
            status: "failed",
            message: "Insufficient funds",
          },
        };
      } else {
        await new Promise((r) => setTimeout(r, 8000));

        return {
          statusCode: 504,
          result: {
            success: false,
            status: "timeout",
            message: "Request timeout",
            retryable: true,
          },
        };
      }
    })();

    // Save as processing
    store.set(transaction_id, {
      state: "processing",
      promise: processingPromise,
    });

    const final = await processingPromise;

    // Save final result
    store.set(transaction_id, {
      state: "completed",
      statusCode: final.statusCode,
      result: final.result,
    });

    return Response.json(final.result, {
      status: final.statusCode,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unexpected error";
    return new Response(message, { status: 500 });
  }
}
