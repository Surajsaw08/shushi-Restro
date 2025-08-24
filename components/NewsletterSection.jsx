"use client";

import Image from "next/image";
import { useState, useEffect } from "react";

const NewsletterSection = () => {
  const [email, setEmail] = useState("");
  const [otpBox, setOtpBox] = useState(false);
  const [otp, setOtp] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);

  // Load subscription from localStorage (if already subscribed)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedEmail = localStorage.getItem("subscribedEmail");
      if (storedEmail) {
        setIsSubscribed(true);
      }
    }
  }, []);

  // Resend timer countdown
  useEffect(() => {
    let interval = null;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((timer) => timer - 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [resendTimer]);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Send OTP
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      alert("Please enter your email address");
      return;
    }

    if (!validateEmail(email)) {
      alert("Please enter a valid email address");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/sendOtp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      });
      const data = await response.json();

      if (data.success) {
        alert("OTP sent to your email! Please check your inbox.");
        setOtpBox(true);
        setResendTimer(60);
      } else {
        alert(data.message || "Failed to send OTP. Please try again.");
      }
    } catch (error) {
      console.error("Error sending OTP:", error);
      alert("Network error. Please check your connection and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Resend OTP
  const handleResendOtp = async () => {
    if (resendTimer > 0) return;

    setIsLoading(true);
    try {
      const response = await fetch("/api/sendOtp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      });
      const data = await response.json();

      if (data.success) {
        alert("New OTP sent to your email!");
        setResendTimer(60);
      } else {
        alert(data.message || "Failed to resend OTP");
      }
    } catch (error) {
      alert("Failed to resend OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Verify OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault();

    if (!otp.trim()) {
      alert("Please enter the OTP");
      return;
    }

    if (otp.trim().length < 4) {
      alert("Please enter a valid OTP");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/verifyOtp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          otp: otp.trim(),
        }),
      });
      const data = await response.json();

      if (data.success) {
        alert("Successfully subscribed! Welcome aboard! 🎉");
        if (typeof window !== "undefined") {
          localStorage.setItem("subscribedEmail", email.trim().toLowerCase());
        }
        setIsSubscribed(true);
        setOtpBox(false);
        setOtp("");
        setEmail("");
      } else {
        alert(data.message || "Invalid OTP. Please try again.");
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      alert("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToEmail = () => {
    setOtpBox(false);
    setOtp("");
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
            priority
          />

          <div className="newsletter__data">
            <h2 className="section__title">
              Subscribe For Offers, Updates & More
            </h2>
            {/* Already Subscribed */}
            {isSubscribed ? (
              <div style={{ textAlign: "center" }}>
                <button
                  className="button newsletter__button"
                  style={{
                    backgroundColor: "#28a745",
                    cursor: "default",
                    color: "white",
                    borderRadius: "10px",
                    width: "100%",
                    marginBottom: "10px",
                    border: "none",
                    padding: "12px",
                  }}
                  disabled
                >
                  ✅ You're subscribed! Welcome to our community!
                </button>
              </div>
            ) : (
              <>
                {/* Email Form */}
                {!otpBox && (
                  <form className="newsletter__form" onSubmit={handleSubmit}>
                    <input
                      type="email"
                      placeholder="Enter your email address"
                      className="newsletter__input"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      disabled={isLoading}
                      style={{
                        transition: "all 0.3s ease",
                        opacity: isLoading ? 0.7 : 1,
                      }}
                    />
                    <button
                      className="button newsletter__button"
                      type="submit"
                      disabled={isLoading || !email.trim()}
                      style={{
                        transition: "all 0.3s ease",
                        opacity: isLoading || !email.trim() ? 0.6 : 1,
                        cursor:
                          isLoading || !email.trim()
                            ? "not-allowed"
                            : "pointer",
                      }}
                    >
                      {isLoading ? (
                        <>
                          <span
                            style={{
                              display: "inline-block",
                              width: "16px",
                              height: "16px",
                              border: "2px solid rgba(255, 255, 255, 0.3)",
                              borderRadius: "50%",
                              borderTopColor: "white",
                              animation: "spin 1s linear infinite",
                              marginRight: "8px",
                            }}
                          ></span>
                          Sending...
                        </>
                      ) : (
                        "Subscribe"
                      )}
                    </button>
                  </form>
                )}

                {/* OTP Form */}
                {otpBox && (
                  <div>
                    <div
                      style={{
                        textAlign: "center",
                        marginTop: "-18px",
                        marginBottom: "10px",
                        padding: "8px 12px",
                        backgroundColor: "#f8f9fa",
                        borderRadius: "15px",
                        fontSize: "13px",
                        color: "#495057",
                        border: "1px solid #e9ecef",
                      }}
                    >
                      OTP sent to:{" "}
                      <span style={{ color: "#007bff", fontWeight: "500" }}>
                        {email}
                      </span>
                    </div>

                    <form
                      className="newsletter__form"
                      onSubmit={handleVerifyOtp}
                    >
                      <input
                        type="text"
                        placeholder="Enter 6-digit OTP"
                        className="newsletter__input"
                        value={otp}
                        onChange={(e) =>
                          setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                        }
                        required
                        disabled={isLoading}
                        maxLength={6}
                        style={{
                          textAlign: "center",
                          letterSpacing: "4px",
                          fontSize: "18px",
                          fontWeight: "600",
                          transition: "all 0.3s ease",
                          opacity: isLoading ? 0.7 : 1,
                        }}
                      />
                      <button
                        className="button newsletter__button"
                        type="submit"
                        disabled={isLoading || otp.length < 4}
                        style={{
                          transition: "all 0.3s ease",
                          opacity: isLoading || otp.length < 4 ? 0.6 : 1,
                          cursor:
                            isLoading || otp.length < 4
                              ? "not-allowed"
                              : "pointer",
                        }}
                      >
                        {isLoading ? (
                          <>
                            <span
                              style={{
                                display: "inline-block",
                                width: "16px",
                                height: "16px",
                                border: "2px solid rgba(255, 255, 255, 0.3)",
                                borderRadius: "50%",
                                borderTopColor: "white",
                                animation: "spin 1s linear infinite",
                                marginRight: "8px",
                              }}
                            ></span>
                            Verifying...
                          </>
                        ) : (
                          "Verify"
                        )}
                      </button>
                    </form>

                    <div
                      style={{
                        textAlign: "center",
                        marginTop: "12px",
                        fontSize: "13px",
                        display: "flex",
                        justifyContent: "center",
                        gap: "12px",
                        flexWrap: "wrap",
                      }}
                    >
                      <button
                        onClick={handleResendOtp}
                        disabled={resendTimer > 0 || isLoading}
                        style={{
                          background: "none",
                          border: "none",
                          color: resendTimer > 0 ? "#999" : "#007bff",
                          textDecoration:
                            resendTimer > 0 ? "none" : "underline",
                          cursor: resendTimer > 0 ? "not-allowed" : "pointer",
                          fontSize: "13px",
                          transition: "color 0.3s ease",
                        }}
                        onMouseOver={(e) => {
                          if (resendTimer === 0 && !isLoading) {
                            e.target.style.color = "#0056b3";
                          }
                        }}
                        onMouseOut={(e) => {
                          if (resendTimer === 0 && !isLoading) {
                            e.target.style.color = "#007bff";
                          }
                        }}
                      >
                        {resendTimer > 0
                          ? `Resend in ${resendTimer}s`
                          : "Resend OTP"}
                      </button>

                      <button
                        onClick={handleBackToEmail}
                        disabled={isLoading}
                        style={{
                          background: "none",
                          border: "none",
                          color: isLoading ? "#999" : "#6c757d",
                          textDecoration: "underline",
                          cursor: isLoading ? "not-allowed" : "pointer",
                          fontSize: "13px",
                          transition: "color 0.3s ease",
                        }}
                        onMouseOver={(e) => {
                          if (!isLoading) {
                            e.target.style.color = "#495057";
                          }
                        }}
                        onMouseOut={(e) => {
                          if (!isLoading) {
                            e.target.style.color = "#6c757d";
                          }
                        }}
                      >
                        Change Email
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}

            {/* Trust indicators */}
            {!isSubscribed && (
              <div
                style={{
                  fontSize: "12px",
                  color: "#888",
                  textAlign: "center",
                  marginTop: "16px",
                  lineHeight: "1.4",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                }}
              >
                🔒 Your email is safe with us • No spam • Unsubscribe anytime
              </div>
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

      <style jsx>{`
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </section>
  );
};

export default NewsletterSection;
