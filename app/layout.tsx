import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Toaster } from 'sonner';
import Script from 'next/script'
import GoogleMapsLoader from '../components/GoogleMapsLoader'

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Business Search',
  description: 'Search for businesses in Texas',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
        <Script
          id="google-maps"
          src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places&loading=async`}
          strategy="afterInteractive"
        />
        <Script id="google-maps-init">
          {`
            window.initMap = function() {
              console.log("Google Maps initialized");
            }
          `}
        </Script>
        <GoogleMapsLoader />
        <Toaster />
      </body>
    </html>
  );
}