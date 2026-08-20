import type { Metadata, Viewport } from 'next';
import '@/styles/index.css';

export const metadata: Metadata = {
  title: 'Sami Prototype',
  description:
    'This baby monitor application offers real-time audio and video monitoring for parents, ensuring peace of mind while keeping an eye on their little ones.',
  robots: {
    index: false,
    follow: false,
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <div id="root">{children}</div>
      </body>
    </html>
  );
}
