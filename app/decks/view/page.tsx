import { Suspense } from 'react';
import DeckViewClient from './DeckViewClient';

export default function DeckViewPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <DeckViewClient />
    </Suspense>
  );
}
