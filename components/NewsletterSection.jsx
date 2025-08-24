"use client";

import Image from "next/image";
import { useState, useEffect } from "react";

const NewsletterSection = () => {
  const [email, setEmail] = useState("");
  const [otpBox, setOtpBox] = useState(false);
  const [otp, setOtp] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Load subscription from localStorage (if already subscribed)
  useEffect(() => {
    const storedEmail = localStorage.getItem("subscribedEmail");
    if (storedEmail) {
      setIsSubscribed(true);
    }
  }, []);

  // Send OTP
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      alert("Please enter your email");
      return;
    }
    setIsLoading(true); // block button
    try {
      const response = await fetch("/api/sendOtp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      alert(data.message);
      if (data.success) {
        setOtpBox(true);
      }
    } catch (error) {
      console.error("Error sending OTP:", error);
      alert("Error sending OTP. Please try again.");
    } finally {
      setIsLoading(false); // unblock button
    }
  };

  // Verify OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otp) {
      alert("Please enter OTP");
      return;
    }
    setIsLoading(true); // block button
    try {
      const response = await fetch("/api/verifyOtp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });
      const data = await response.json();
      alert(data.message);
      if (data.success) {
        alert("OTP Verified Successfully 🎉");
        localStorage.setItem("subscribedEmail", email);
        setIsSubscribed(true); // mark as subscribed
        setOtpBox(false);
        setOtp("");
        setEmail("");
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      alert("Error verifying OTP. Please try again.");
    } finally {
      setIsLoading(false); // unblock button
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

            {/* Already Subscribed */}
            {isSubscribed ? (
              <button
                className="button newsletter__button"
                style={{ backgroundColor: "green", cursor: "not-allowed" }}
                disabled
              >
                you are already Subscribed
              </button>
            ) : (
              <>
                {/* Email Form */}
                {!otpBox && (
                  <form className="newsletter__form" onSubmit={handleSubmit}>
                    <input
                      type="email"
                      placeholder="Enter email"
                      className="newsletter__input"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      disabled={isLoading}
                    />
                    <button
                      className="button newsletter__button"
                      type="submit"
                      disabled={isLoading}
                    >
                      {isLoading ? "Processing..." : "Subscribe"}
                    </button>
                  </form>
                )}

                {/* OTP Form */}
                {otpBox && (
                  <form className="newsletter__form" onSubmit={handleVerifyOtp}>
                    <input
                      type="text"
                      placeholder="Enter OTP"
                      className="newsletter__input"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      required
                      disabled={isLoading}
                    />
                    <button
                      className="button newsletter__button"
                      type="submit"
                      disabled={isLoading}
                    >
                      {isLoading ? "Verifying..." : "Verify OTP"}
                    </button>
                  </form>
                )}
              </>
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
