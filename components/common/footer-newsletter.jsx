"use client";

import { useState, useTransition } from "react";
import { useLocale } from "next-intl";
import { toast } from "sonner";
import { subscribeToNewsletter } from "@/app/actions/newsletter";

const FooterNewsletter = () => {
  const [email, setEmail] = useState("");
  const [isPending, startTransition] = useTransition();
  const locale = useLocale();

  function handleSubmit(e) {
    e.preventDefault();
    startTransition(async () => {
      try {
        const res = await subscribeToNewsletter({ email, locale });
        if (!res.ok) {
          toast.error(
            res.error === "invalid"
              ? "Please enter a valid email address."
              : "Could not subscribe right now. Please try again."
          );
          return;
        }
        toast.success(
          res.alreadySubscribed ? "You're already subscribed." : "Thanks for subscribing!"
        );
        setEmail("");
      } catch {
        toast.error("Could not subscribe right now. Please try again.");
      }
    });
  }

  return (
    <div className="xl:w-1/2 xl:pb-20">
      <h2 className="font-aeonik text-black text-[28px] xl:text-[35px] mb-6 leading-none">
        Stay in the loop
      </h2>
      <p className="font-aeonik text-black text-[14px] xl:text-[16px] leading-[1.45] mb-8 max-w-83">
        Sign up for SPOTTEQ updates and be the first to know about our
        promotions and news
      </p>

      <form onSubmit={handleSubmit} className="relative w-full max-w-101.5">
        <label
          htmlFor="footer-newsletter-email"
          className="hidden md:block font-aeonik text-black text-[14px] mb-1 pl-3"
        >
          Your email
        </label>
        <div className="relative">
          <input
            id="footer-newsletter-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your email"
            required
            className="w-full h-[37px] border border-black/20 rounded-[20px] px-4 pr-12 md:pr-4 font-aeonik text-[14px] text-black bg-white focus:outline-none focus:border-black/40"
          />
          {/* Desktop — SUBSCRIBE pill */}
          <button
            type="submit"
            disabled={isPending}
            className="hidden md:block disabled:opacity-60 disabled:cursor-wait absolute right-0 top-0 h-[37px] w-[140px] bg-black rounded-[20px] font-aeonik text-white text-[12px] hover:bg-white-custom cursor-pointer hover:text-black-custom hover:border hover:border-black-custom transition-colors duration-500 ease-in-out"
          >
            {isPending ? "SUBSCRIBING…" : "SUBSCRIBE"}
          </button>
          {/* Mobile — circular arrow */}
          <button
            type="submit"
            aria-label="Subscribe"
            disabled={isPending}
            className="md:hidden disabled:opacity-60 disabled:cursor-wait absolute right-0 top-0 h-[37px] w-[37px] rounded-full bg-black flex items-center justify-center cursor-pointer"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </button>
        </div>
      </form>

      <p className="font-aeonik text-black text-[11px] leading-[1.45] mt-4 max-w-[450px]">
        By subscribing you agree to receive email marketing communications
        from SPOTTEQ
      </p>
    </div>
  );
}

export default FooterNewsletter;