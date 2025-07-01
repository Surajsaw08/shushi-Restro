"use client";
import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/components/CartProvider";
import useThemeToggle from "@/hooks/useThemeToggle";

export default function Header() {
  const { cart, onCartClick } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const handleTheme = useThemeToggle();

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
              <Link href="/about" className="nav__link">
                About us
              </Link>
            </li>
            <li className="nav__item">
              <Link href="/popular" className="nav__link">
                Popular
              </Link>
            </li>
            <li className="nav__item">
              <Link href="/recently" className="nav__link">
                Recently
              </Link>
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
          <div className="relative cursor-pointer" onClick={onCartClick}>
            <i className="ri-shopping-cart-line text-xl"></i>
            {cart.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-1">
                {cart.length}
              </span>
            )}
          </div>
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
