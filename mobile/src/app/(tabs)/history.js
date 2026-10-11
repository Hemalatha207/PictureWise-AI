import React from 'react';
import { useRouter } from 'expo-router';
import PictureWiseScreen from '../../../App';

const ROUTES = { create: '/', insights: '/insights', history: '/history', settings: '/settings' };

export default function HistoryRoute() {
  const router = useRouter();
  return <PictureWiseScreen screen="history" onNavigate={(key) => router.navigate(ROUTES[key] || '/')} />;
}
