export const dynamic = 'force-dynamic';

import BusinessDetails from '@/components/BusinessDetails';

export async function generateStaticParams() {
  return [
    { id: 'default' }
  ];
}

export default function BusinessPage({ params }: { params: { id: string } }) {
  return <BusinessDetails id={params.id} />;
} 