import Image from "next/image";

// Shell for sign-in / sign-up pages. pt-24 accounts for the fixed navbar (h-24).
// From lg up the shell splits in two: the form on the left, the product image
// flush to the right and bottom edges of the viewport. Below lg the image is
// dropped and the form stays centered on white.
const AuthLayout = ({ children }) => {
    return (
        <section className="min-h-screen w-full bg-white-custom flex flex-col lg:flex-row pt-24">

            {/* Form column */}
            <div className="flex-1 flex items-center justify-center px-6 pb-16">
                <div className="w-full max-w-md">
                    {children}
                </div>
            </div>

            {/* Decorative image column — desktop only */}
            <div className="hidden lg:block relative flex-1" aria-hidden="true">
                <Image
                    src="/images/login.webp"
                    alt=""
                    unoptimized={true}
                    fill
                    sizes="50vw"
                    className="object-cover"
                />
            </div>
        </section>
    );
};

export default AuthLayout;
