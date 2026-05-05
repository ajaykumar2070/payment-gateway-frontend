import PaymentForm from "@/components/shared/PaymentForm";

export default function Home() {
  return (
    <section className="h-screen flex items-center justify-center bg-[#f2f2f2] text-black">
      <div className="space-y-6">
        <h1 className="text-4xl text-center font-bold">Payment Gateway - Frontend Simulation</h1>
        <PaymentForm />
      </div>
    </section>
  );
}
