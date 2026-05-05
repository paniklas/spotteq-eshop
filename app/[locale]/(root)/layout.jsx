import Footer from '@/components/common/footer';

export default function RootLayout({ children }) {
    return (
        <>
            {children}
            <Footer />
        </>
    )
}
