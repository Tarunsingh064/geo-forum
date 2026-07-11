self.addEventListener('push', (event) => {
  let data = { title: 'Geo Forum', body: 'You have a new notification.', link: '/app/notifications' };
  try {
    if (event.data) data = { ...data, ...event.data.json() };
  } catch {
    // fall back to defaults if the payload isn't JSON
  }

  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: '/icon.png',
      data: { link: data.link },
    }),
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const link = event.notification.data?.link || '/app/notifications';
  event.waitUntil(
    self.clients.matchAll({ type: 'window' }).then((clientList) => {
      for (const client of clientList) {
        if (client.url.includes(link) && 'focus' in client) return client.focus();
      }
      if (self.clients.openWindow) return self.clients.openWindow(link);
    }),
  );
});
