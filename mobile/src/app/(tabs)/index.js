import React from 'react';
import { useRouter } from 'expo-router';
import PictureWiseScreen from '../../../App';

const ROUTES = { create: '/', insights: '/insights', history: '/history', settings: '/settings' };

export default function CreateRoute() {
  const router = useRouter();
  return <PictureWiseScreen screen="create" onNavigate={(key) => router.navigate(ROUTES[key] || '/')} />;
}
