"use client";

const ScrollToTopButton = () => {
    function scrollToTop() {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    return (
        <button
            onClick={scrollToTop}
            aria-label="Back to top"
            className="absolute top-16 xl:top-20 right-10 xl:right-[160px] flex items-center justify-center w-10 h-10"
        >
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 flex items-center justify-center shrink-0 text-black-custom rounded-full cursor-pointer hover:bg-gray-mint transition-colors duration-300">
                <path d="M20.5303 9.46967C20.2374 9.17678 19.7626 9.17678 19.4697 9.46967L14.6967 14.2426C14.4038 14.5355 14.4038 15.0104 14.6967 15.3033C14.9896 15.5962 15.4645 15.5962 15.7574 15.3033L20 11.0607L24.2426 15.3033C24.5355 15.5962 25.0104 15.5962 25.3033 15.3033C25.5962 15.0104 25.5962 14.5355 25.3033 14.2426L20.5303 9.46967ZM20 30L20.75 30L20.75 10L20 10L19.25 10L19.25 30L20 30Z" fill="black"/>
            </svg>
        </button>
    );
};

export default ScrollToTopButton;
