"use client";

import { useState } from "react";


const FooterNewsletter = () => {
  const [email, setEmail] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    // For demo purposes, we'll just alert the email. In a real app, you'd send this to your backend.
    alert(`Subscribed with email: ${email}`);
    setEmail("");
  }

  return (
    <div className="xl:w-1/2 pb-20">
      <h2 className="font-aeonik text-black text-[28px] xl:text-[35px] leading-[1.45] mb-6 leading-none">
        Stay in the loop
      </h2>
      <p className="font-aeonik text-black text-[14px] xl:text-[16px] leading-[1.45] mb-8 max-w-[332px]">
        Sign up for SPOTTEQ updates and be the first to know about our
        promotions and news
      </p>

      <form onSubmit={handleSubmit} className="relative w-full max-w-[406px]">
        <label
          htmlFor="footer-newsletter-email"
          className="block font-aeonik text-black text-[14px] mb-1 pl-3"
        >
          Your email
        </label>
        <div className="relative">
          <input
            id="footer-newsletter-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder=""
            required
            className="w-full h-[37px] border border-black/20 rounded-[20px] px-4 font-aeonik text-[14px] text-black bg-white focus:outline-none focus:border-black/40"
          />
          <button
            type="submit"
            className="absolute right-0 top-0 h-[37px] w-[140px] bg-black rounded-[20px] font-aeonik text-white text-[12px] hover:bg-white-custom cursor-pointer hover:text-black-custom hover:border hover:border-black-custom transition-colors duration-500 ease-in-out"
          >
            SUBSCRIBE
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