import { api } from '@/lib/api';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        // Obtener la URL del CV desde el backend
        const result = await api.getCVDownloadURL();
        
        // Construir la URL completa
        const fullURL = `${process.env.NEXT_PUBLIC_API_URL}${result.download_url}`;
        
        // Redirigir al PDF
        return NextResponse.redirect(fullURL);
    } catch (error: any) {
        console.error('Error getting CV download URL:', error);
        
        // Si no hay CV disponible, retornar 404
        return NextResponse.json(
            { error: 'CV no disponible' },
            { status: 404 }
        );
    }
}

