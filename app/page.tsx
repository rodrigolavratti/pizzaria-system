import Contato from "@/app/components/contato/Contato";
import Footer from "@/app/components/footer/Footer";
import Header from "@/app/components/header/Header";
import MenuSection from "@/app/components/menu-pizzas/MenuPizzas";
import Depoimentos from "@/app/components/depoimentos/Depoimentos";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-100 text-neutral-100 font-sans">
      <main>
        {/* HEADER */}
        <Header />

        {/* 2. CARDÁPIO DE PIZZAS */}
        <MenuSection />

        {/* 3. DEPOIMENTOS */}
        <Depoimentos />

        {/* 4. INFORMAÇÕES E CONTATO */}
        <Contato />
      </main>

      {/* 5. RODAPÉ */}
      <Footer />
    </div>
  );
}
