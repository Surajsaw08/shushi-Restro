"use client";
import Image from "next/image";
import { useCart } from "@/components/CartProvider";

const PopularSection = () => {
  const { addToCart2 } = useCart();

  const dishes = [
    {
      id: 1,
      name: "Onigiri",
      description: "Japanese Dish",
      price: "₹109",
      image: "/img/popular-onigiri.png",
    },
    {
      id: 2,
      name: "Spring Rolls",
      description: "Japanese Dish",
      price: "₹149",
      image: "/img/popular-spring-rols.png",
    },
    {
      id: 3,
      name: "Sushi Rolls",
      description: "Japanese Dish",
      price: "₹269",
      image: "/img/popular-sushi-rolls.png",
    },
  ];

  return (
    <section className="popular section" id="popular">
      <span className="section__subtitle">The Best Food</span>
      <h2 className="section__title">Popular Dishes</h2>

      <div className="popular__container container grid">
        {dishes.map((dish) => (
          <article className="popular__card" key={dish.id}>
            <Image
              src={dish.image}
              alt="popular image"
              width={150}
              height={150}
              className="popular__img"
            />
            <h3 className="popular__name">{dish.name}</h3>
            <span className="popular__description">{dish.description}</span>
            <span className="popular__price">{dish.price}</span>
            <button
              className="popular__button"
              onClick={() => addToCart2(dish)}
            >
              <i className="ri-shopping-bag-line text-1.5xl"></i>
            </button>
          </article>
        ))}
      </div>
    </section>
  );
};

export default PopularSection;
