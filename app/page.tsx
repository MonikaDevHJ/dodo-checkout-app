"use client";

import { useState } from "react";

export default function Home() {
  const [email, setEmail] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");

  const [isProcessing, setIsProcessing] = useState(false);

  const [paymentStatus, setPaymentStatus] = useState<
    "idle" | "success" | "error"
  >("idle");

  const [errorMessage, setErrorMessage] = useState("");

  const [paymentAttempt, setPaymentAttempt] = useState(0);

  const sendMessageToParent = (message: object) => {
    console.log("Checkout sending message:", message);

    window.parent.postMessage(message, "http://localhost:3000");
  };

  const handleClose = () => {
    sendMessageToParent({
      type: "CHECKOUT_CLOSE",
    });
  };

  const handlePayment = () => {
    if (isProcessing) {
      return;
    }

    setIsProcessing(true);
    setPaymentStatus("idle");
    setErrorMessage("");

    setTimeout(() => {
      // SUCCESS
      if (cardNumber === "4242 4242 4242 4242") {
        setPaymentStatus("success");

        sendMessageToParent({
          type: "PAYMENT_SUCCESS",
          sessionId: "demo_session_123",
        });
      }

      // DECLINED
      else if (cardNumber === "4000 0000 0000 0002") {
        setPaymentStatus("error");
        setErrorMessage("Your card was declined.");

        sendMessageToParent({
          type: "PAYMENT_ERROR",
          code: "CARD_DECLINED",
          message: "Your card was declined.",
        });
      }

      // FAIL ONCE THEN SUCCESS
      else if (cardNumber === "4000 0000 0000 0341") {
        if (paymentAttempt === 0) {
          setPaymentAttempt(1);
          setPaymentStatus("error");
          setErrorMessage("Payment failed. Please try again.");

          sendMessageToParent({
            type: "PAYMENT_ERROR",
            code: "PAYMENT_FAILED",
            message: "Payment failed. Please try again.",
          });
        } else {
          setPaymentStatus("success");

          sendMessageToParent({
            type: "PAYMENT_SUCCESS",
            sessionId: "demo_session_retry_123",
          });
        }
      }

      // INVALID CARD
      else {
        setPaymentStatus("error");
        setErrorMessage("Invalid test card number.");

        sendMessageToParent({
          type: "PAYMENT_ERROR",
          code: "INVALID_CARD",
          message: "Invalid test card number.",
        });
      }

      setIsProcessing(false);
    }, 1500);
  };

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-10 text-white">
      <div className="mx-auto w-full max-w-md">
        {/* Header */}
        <div className="mb-8 flex items-start justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-widest text-blue-400">
              Dodo Checkout
            </p>

            <h1 className="mt-2 text-2xl font-bold">
              Complete your purchase
            </h1>
          </div>

          <button
            type="button"
            onClick={handleClose}
            aria-label="Close checkout"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-slate-300 transition hover:bg-white/20 hover:text-white"
          >
            ✕
          </button>
        </div>

        {/* Checkout Card */}
        <div className="rounded-3xl border border-white/10 bg-slate-900 p-6 shadow-2xl">
          {/* Product */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">
                  Product
                </p>

                <p className="mt-1 font-semibold">
                  Pro Plan
                </p>
              </div>

              <div className="text-right">
                <p className="text-sm text-slate-400">
                  Price
                </p>

                <p className="mt-1 text-lg font-semibold">
                  ₹999
                </p>
              </div>
            </div>
          </div>

          {/* Email */}
          <div className="mt-6">
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-medium"
            >
              Email
            </label>

            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500 focus:border-blue-500"
            />
          </div>

          {/* Card Number */}
          <div className="mt-5">
            <label
              htmlFor="cardNumber"
              className="mb-2 block text-sm font-medium"
            >
              Card number
            </label>

            <input
              id="cardNumber"
              type="text"
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
              inputMode="numeric"
              placeholder="4242 4242 4242 4242"
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500 focus:border-blue-500"
            />
          </div>

          {/* Expiry + CVV */}
          <div className="mt-5 grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="expiry"
                className="mb-2 block text-sm font-medium"
              >
                Expiry
              </label>

              <input
                id="expiry"
                type="text"
                value={expiry}
                onChange={(e) => setExpiry(e.target.value)}
                placeholder="12/28"
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label
                htmlFor="cvv"
                className="mb-2 block text-sm font-medium"
              >
                CVV
              </label>

              <input
                id="cvv"
                type="password"
                value={cvv}
                onChange={(e) => setCvv(e.target.value)}
                inputMode="numeric"
                placeholder="123"
                maxLength={3}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Pay */}
          <button
            type="button"
            onClick={handlePayment}
            disabled={isProcessing}
            className="mt-6 w-full rounded-xl bg-blue-600 px-5 py-3.5 text-sm font-semibold transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isProcessing ? "Processing..." : "Pay ₹999"}
          </button>

          {/* Success */}
          {paymentStatus === "success" && (
            <div className="mt-4 rounded-xl border border-emerald-400/20 bg-emerald-400/10 p-4 text-center">
              <p className="font-semibold text-emerald-300">
                Payment successful!
              </p>

              <p className="mt-1 text-sm text-emerald-200/70">
                Your Pro Plan purchase is complete.
              </p>
            </div>
          )}

          {/* Error */}
          {paymentStatus === "error" && (
            <div className="mt-4 rounded-xl border border-red-400/20 bg-red-400/10 p-4 text-center">
              <p className="font-semibold text-red-300">
                Payment failed
              </p>

              <p className="mt-1 text-sm text-red-200/70">
                {errorMessage}
              </p>

              <button
                type="button"
                onClick={handlePayment}
                disabled={isProcessing}
                className="mt-4 rounded-lg bg-white/10 px-4 py-2 text-sm font-medium transition hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Try Again
              </button>
            </div>
          )}

          <p className="mt-4 text-center text-xs text-slate-500">
            Demo payment • No real transaction
          </p>
        </div>
      </div>
    </main>
  );
}