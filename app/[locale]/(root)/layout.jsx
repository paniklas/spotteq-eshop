import Footer from '@/components/common/footer';

export default async function RootLayout({ children, params }) {
    const { locale } = await params;

    return (
        <>
            {children}
            <Footer locale={locale} />
        </>
    )
}
