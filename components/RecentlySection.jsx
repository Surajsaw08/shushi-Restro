"use client";
import Image from "next/image";
import { useCart } from "@/components/CartProvider";

const RecentlySection = () => {
  const { addToCart2 } = useCart();
  const dish = {
    id: 4,
    name: "Sushi Samurai",
    description: "Rice ball wrapped in seaweed.",
    price: "₹299",
    image: "/img/recently-salmon-sushi.png",
  };

  return (
    <section className="recently section" id="recently">
      <div className="recently__container container grid">
        <div className="recently__data">
          <span className="section__subtitle">Recently Added</span>
          <h2 className="section__title">
            Sushi Samurai <br />
            Salmón Cheese
          </h2>
          <p className="recently__description">
            Take a look at what's new. And do not deprive yourself of a good
            meal, enjoy and be happy at just{" "}
            <span className="text-[#D56E3F] text-xl font-bold">₹299</span>
          </p>
          <a href="#" className="button" onClick={() => addToCart2(dish)}>
            Add to cart <i className="ri-arrow-right-line"></i>
          </a>

          <Image
            src="/img/spinach-leaf.png"
            alt="recent image"
            width={100}
            height={100}
            className="recently__data-img"
          />
        </div>

        <Image
          src="/img/recently-salmon-sushi.png"
          alt="recent image"
          width={400}
          height={400}
          className="recently__img"
        />
      </div>

      <Image
        src="/img/leaf-branch-2.png"
        alt="recently leaf"
        width={120}
        height={120}
        className="recently__leaf-1"
      />
      <Image
        src="/img/leaf-branch-3.png"
        alt="recently leaf"
        width={120}
        height={120}
        className="recently__leaf-2"
      />
    </section>
  );
};

export default RecentlySection;
