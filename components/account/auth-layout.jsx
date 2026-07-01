// Shell for sign-in / sign-up pages. pt-24 accounts for the fixed navbar (h-24).
const AuthLayout = ({ children }) => {
    return (
        <section className="min-h-screen w-full bg-white-custom flex items-center justify-center px-6 pt-24 pb-16">
            <div className="w-full max-w-md">
                {children}
            </div>
        </section>
    );
};

export default AuthLayout;
