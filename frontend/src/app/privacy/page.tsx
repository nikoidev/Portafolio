import { Navbar } from '@/components/layout/Navbar';
import PrivacyClient from '@/components/pages/PrivacyClient';
import { Footer } from '@/components/shared/Footer';

export const metadata = {
    title: 'Política de Privacidad',
    description: 'Política de privacidad y protección de datos del portafolio',
};

export default function PrivacyPage() {
    return (
        <>
            <Navbar />
            <main>
                <PrivacyClient />
            </main>
            <Footer />
        </>
    );
}

