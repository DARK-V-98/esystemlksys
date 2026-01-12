'use client';

import { useEffect } from 'react';

export default function PosPage() {
  useEffect(() => {
    const handler = (event: MessageEvent) => {
      if (event.data?.type === 'GO_BACK_SYSTEMS') {
        window.location.href = '/systems';
      }
    };

    window.addEventListener('message', handler);
    return () => window.removeEventListener('message', handler);
  }, []);

  return (
    <div className="h-full w-full">
      <iframe
        src="https://eposv1-2.vercel.app"
        className="w-full h-full border-none"
        title="Point of Sale System"
      ></iframe>
    </div>
  );
}
