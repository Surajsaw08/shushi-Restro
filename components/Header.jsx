"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useCart } from "@/components/CartProvider";
import useThemeToggle from "@/hooks/useThemeToggle";
import { useRouter } from "next/navigation";

export default function Header() {
  const { cart, onCartClick } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const handleTheme = useThemeToggle();
  const [subscribedEmail, setSubscribedEmail] = useState(null);

  useEffect(() => {
    setSubscribedEmail(localStorage.getItem("subscribedEmail"));
  }, []);
  const router = useRouter();

  return (
    <header className="header" id="header">
      <nav className="nav container">
        <Link href="/" className="nav__logo">
          <img src="../assets/logo.png" alt="logo image" />
          Sushi
        </Link>
        <div
          className={`nav__menu ${isMenuOpen ? "show-menu" : ""}`}
          id="nav-menu"
        >
          <ul className="nav__list">
            <li className="nav__item">
              <Link href="/" className="nav__link active-link">
                Home
              </Link>
            </li>
            <li className="nav__item">
              <a href="#about" className="nav__link">
                About us
              </a>
            </li>
            {/* <li className="nav__item">
              <a href="#popular" className="nav__link">
                Popular
              </a>
            </li> */}
            <li className="nav__item">
              <a href="#recently" className="nav__link">
                Recently
              </a>
            </li>
            <li className="nav__item">
              <a href="#subscription" className="nav__link font-bold ">
                Subscription
              </a>
            </li>
          </ul>
          <div
            className="nav__close"
            id="nav-close"
            onClick={() => setIsMenuOpen(false)}
          >
            <i className="ri-close-line"></i>
          </div>
          <img
            src="/img/leaf-branch-4.png"
            alt="nav image"
            className="nav__img-1"
          />
          <img
            src="/img/leaf-branch-3.png"
            alt="nav image"
            className="nav__img-2"
          />
        </div>
        <div className="nav__buttons">
          <div onClick={handleTheme}>
            <i className="ri-moon-line change-theme" id="theme-button"></i>
          </div>
          <div></div>
          <div className="relative cursor-pointer" onClick={onCartClick}>
            <i className="ri-shopping-cart-line text-xl"></i>
            {cart.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-1">
                {cart.length}
              </span>
            )}
          </div>
          <div></div>
          {subscribedEmail && (
            <div
              className="w-7 h-7 outline rounded-full flex items-center justify-center cursor-pointer font-bold "
              onClick={() => {
                router.push("/profile");
              }}
            >
              <Link href="/profile" className="nav__link ">
                {subscribedEmail[0]}
              </Link>
            </div>
          )}
          <div
            className="nav__toggle block md:hidden"
            id="nav-toggle"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <i className="ri-apps-2-line mr-8"></i>
          </div>
        </div>
      </nav>
    </header>
  );
}
