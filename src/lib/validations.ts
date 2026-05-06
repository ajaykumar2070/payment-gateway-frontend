import z from "zod";

export const paymentSchema = z.object({
  name: z
    .string()
    .min(2, "Name is required")
    .regex(/^[a-zA-Z\s]+$/, "Only letters allowed"),

  card_number: z
    .string()
    .transform((val) => val.replace(/\s+/g, "")) // remove spaces
    .refine((val) => /^\d{13,19}$/.test(val), {
      message: "Invalid card number",
    }),


  expiry_date: z
    .string()
    .regex(/^(0[1-9]|1[0-2])\/\d{2}$/, "Format must be MM/YY")
    .refine((val) => {
      const [month, year] = val.split("/").map(Number);
      const now = new Date();
      const expiry = new Date(2000 + year, month); // next month
      return expiry > now;
    }, "Card has expired"),

  cvv: z
    .string()
    .regex(/^\d{3,4}$/, "CVV must be 3 or 4 digits"),

  amount: z
    .string()
    .regex(/^\d+(\.\d{1,2})?$/, "Invalid amount")
});

export type CardInputTypes = z.infer<typeof paymentSchema>