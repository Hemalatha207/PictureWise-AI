import React from 'react';
import { useRouter } from 'expo-router';
import PictureWiseScreen from '../../../App';

const ROUTES = { create: '/', insights: '/insights', history: '/history', settings: '/settings' };

export default function SettingsRoute() {
  const router = useRouter();
  return <PictureWiseScreen screen="settings" onNavigate={(key) => router.navigate(ROUTES[key] || '/')} />;
}
