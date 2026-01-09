'use client';
import { Suspense } from 'react';
import ComingSoon from '../(main)/coming-soon/page';

function ManagementContent() {
    return <ComingSoon />;
}

export default function ManagementPage() {
    return (
        <Suspense>
            <ManagementContent />
        </Suspense>
    );
}
