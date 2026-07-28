import { FridgeChefApp } from "@/components/FridgeChefApp";
import { ServiceWorkerRegister } from "@/components/ServiceWorkerRegister";

export default function Home() {
  return (
    <main className="flex grow flex-col">
      <FridgeChefApp />
      <ServiceWorkerRegister />
    </main>
  );
}
