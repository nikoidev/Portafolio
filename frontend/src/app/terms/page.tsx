import { Navbar } from '@/components/layout/Navbar';
import TermsClient from '@/components/pages/TermsClient';
import { Footer } from '@/components/shared/Footer';

export const metadata = {
    title: 'Términos y Condiciones',
    description: 'Términos y condiciones de uso del portafolio',
};

export default function TermsPage() {
    return (
        <>
            <Navbar />
            <main>
                <TermsClient />
            </main>
            <Footer />
        </>
    );
}

