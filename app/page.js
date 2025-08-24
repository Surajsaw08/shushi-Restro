import Header from "@/components/Header";
import Hero from "@/components/Hero";
import AboutSection from "@/components/AboutSection";
import ProductList from "@/components/ProductList";
import PopularSection from "@/components/PopularSection";
import RecentlySection from "@/components/RecentlySection";
import NewsletterSection from "@/components/NewsletterSection";
import Footer from "@/components/Footer";
import CartProvider from "@/components/CartProvider";

export default function Home() {
  return (
    <CartProvider>
      <div className="px-20">
        <Header />
        <Hero />
        <section id="about">
          <AboutSection />
        </section>
        <section id="popular">
          <PopularSection />
        </section>
        <section id="recently">
          <RecentlySection />
        </section>
        <section id="subscription">
          <NewsletterSection />
        </section>
        <Footer />
        {/* <ProductList /> */}
      </div>
    </CartProvider>
  );
}
