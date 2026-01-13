'use client';

import dynamic from 'next/dynamic';

// Dynamic import with ssr: false must be in a client component
const LoadingScreen = dynamic(
  () => import('./ui/LoadingScreen'),
  { ssr: false }
);

interface ClientLoadingWrapperProps {
  minDuration?: number;
}

const ClientLoadingWrapper: React.FC<ClientLoadingWrapperProps> = ({ minDuration = 1500 }) => {
  return <LoadingScreen minDuration={minDuration} />;
};

export default ClientLoadingWrapper;
