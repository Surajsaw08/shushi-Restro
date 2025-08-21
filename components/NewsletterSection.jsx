"use client";

import Image from "next/image";
import { useState } from "react";

const NewsletterSection = () => {
  const [email, setEmail] = useState("");
  const [otpBox, setOtpBox] = useState(false);
  const [otp, setOtp] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      alert("Please enter your email");
      return;
    }
    try {
      const response = await fetch("/api/sendOtp", {
        method: "POST",
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      alert(data.message);
      if (data.success) {
        setOtpBox(true);
      }
      setEmail("");
    } catch (error) {
      console.error("Error sending OTP:", error);
      alert("Error sending OTP. Please try again.");
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otp) {
      alert("Please enter OTP");
      return;
    }
    try {
      const response = await fetch("/api/verifyOtp", {
        method: "POST",
        body: JSON.stringify({ email, otp }),
      });
      const data = await response.json();
      alert(data.message);
      if (data.success) {
        alert("OTP Verified Successfully 🎉");
      }
      setOtpBox(false);
      setOtp("");
      setEmail("");
    } catch (error) {
      console.error("Error verifying OTP:", error);
      alert("Error verifying OTP. Please try again.");
    }
  };

  return (
    <section className="newsletter section">
      <div className="newsletter__container container">
        <div className="newsletter__content grid">
          <Image
            src="/img/newsletter-sushi.png"
            alt="newsletter image"
            width={300}
            height={300}
            className="newsletter__img"
          />

          <div className="newsletter__data">
            <span className="section__subtitle">Newsletter</span>
            <h2 className="section__title">
              Subscribe For <br />
              Offer Updates
            </h2>

            {/* Email Form */}
            {!otpBox && (
              <form className="newsletter__form">
                <input
                  type="email"
                  placeholder="Enter email"
                  className="newsletter__input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <button
                  className="button newsletter__button"
                  type="submit"
                  onClick={handleSubmit}
                >
                  Subscribe
                </button>
              </form>
            )}

            {/* OTP Form */}
            {otpBox && (
              <form className="newsletter__form">
                <input
                  type="text"
                  placeholder="Enter OTP"
                  className="newsletter__input"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                />
                <button
                  className="button newsletter__button"
                  type="submit"
                  onClick={handleVerifyOtp}
                >
                  Verify OTP
                </button>
              </form>
            )}
          </div>
        </div>

        <Image
          src="/img/spinach-leaf.png"
          alt="newsletter leaf"
          width={100}
          height={100}
          className="newsletter__spinach"
        />
      </div>
    </section>
  );
};

export default NewsletterSection;
