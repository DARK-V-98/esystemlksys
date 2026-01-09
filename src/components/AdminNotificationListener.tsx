'use client';

import { useEffect } from 'react';
import { getFirestore, collection, query, onSnapshot, orderBy, limit } from 'firebase/firestore';
import { app } from '@/firebase/config';
import { toast } from 'sonner';

const AdminNotificationListener = () => {
  useEffect(() => {
    const db = getFirestore(app);
    const notificationsRef = collection(db, 'notifications');
    const q = query(notificationsRef, orderBy('timestamp', 'desc'), limit(1));

    let lastNotificationTime: number | null = null;

    const unsubscribe = onSnapshot(q, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === 'added') {
          const notificationData = change.doc.data();
          const message = notificationData.message;
          const timestamp = notificationData.timestamp.toMillis();
          
          if (lastNotificationTime === null) {
            // On first load, set the time but don't show a toast
            lastNotificationTime = timestamp;
            return;
          }

          if (timestamp > lastNotificationTime) {
            toast.info('Admin Notification', {
              description: message,
              duration: 10000,
            });
            lastNotificationTime = timestamp;
          }
        }
      });
    });

    return () => unsubscribe();
  }, []);

  return null;
};

export default AdminNotificationListener;
