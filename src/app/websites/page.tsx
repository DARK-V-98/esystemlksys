'use client';
import { Suspense } from 'react';
import ComingSoon from '../(main)/coming-soon/page';

function WebsitesContent() {
    return <ComingSoon />;
}

export default function WebsitesPage() {
    return (
        <Suspense>
            <WebsitesContent />
        </Suspense>
    );
}
