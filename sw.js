const CACHE_NAME = 'dsi-placement-v1.1.0';
const STATIC_CACHE = 'dsi-static-v1.1.0';
const DYNAMIC_CACHE = 'dsi-dynamic-v1.1.0';
const IMAGE_CACHE = 'dsi-images-v1.1.0';

const urlsToCache = [
  './',
  './index.html',
  './styles.css',
  './script.js',
  './DSi.png',
  './manifest.json',
  'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
  'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js'
];

// Cache strategies
const CACHE_STRATEGIES = {
  CACHE_FIRST: 'cache-first',
  NETWORK_FIRST: 'network-first',
  STALE_WHILE_REVALIDATE: 'stale-while-revalidate',
  NETWORK_ONLY: 'network-only',
  CACHE_ONLY: 'cache-only'
};

// Install event - cache resources
self.addEventListener('install', event => {
  console.log('Service Worker installing...');
  event.waitUntil(
    Promise.all([
      caches.open(STATIC_CACHE).then(cache => {
        console.log('Caching static resources...');
        return cache.addAll(urlsToCache);
      }),
      caches.open(DYNAMIC_CACHE).then(cache => {
        console.log('Dynamic cache ready');
        return cache;
      }),
      caches.open(IMAGE_CACHE).then(cache => {
        console.log('Image cache ready');
        return cache;
      })
    ]).catch(err => {
      console.log('Cache installation failed:', err);
    })
  );
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  console.log('Service Worker activating...');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (![STATIC_CACHE, DYNAMIC_CACHE, IMAGE_CACHE].includes(cacheName)) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      // Clean up old dynamic cache entries (keep only last 50)
      return caches.open(DYNAMIC_CACHE).then(cache => {
        return cache.keys().then(keys => {
          if (keys.length > 50) {
            return cache.delete(keys[0]);
          }
        });
      });
    })
  );
  self.clients.claim();
});

// Helper function to determine cache strategy
function getCacheStrategy(request) {
  const url = new URL(request.url);
  
  // Static assets - cache first
  if (request.destination === 'script' || 
      request.destination === 'style' || 
      request.destination === 'manifest' ||
      url.pathname.endsWith('.js') ||
      url.pathname.endsWith('.css') ||
      url.pathname.endsWith('.json')) {
    return CACHE_STRATEGIES.CACHE_FIRST;
  }
  
  // Images - cache first with fallback
  if (request.destination === 'image' || 
      url.pathname.match(/\.(jpg|jpeg|png|gif|webp|svg)$/)) {
    return CACHE_STRATEGIES.CACHE_FIRST;
  }
  
  // API calls - network first
  if (url.pathname.includes('/api/') || 
      url.hostname.includes('firebase') ||
      url.hostname.includes('googleapis')) {
    return CACHE_STRATEGIES.NETWORK_FIRST;
  }
  
  // HTML pages - stale while revalidate
  if (request.destination === 'document') {
    return CACHE_STRATEGIES.STALE_WHILE_REVALIDATE;
  }
  
  // Default to network first
  return CACHE_STRATEGIES.NETWORK_FIRST;
}

// Cache first strategy
async function cacheFirst(request) {
  const cachedResponse = await caches.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }
  
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    // Return offline page for navigation requests
    if (request.destination === 'document') {
      return caches.match('./index.html');
    }
    throw error;
  }
}

// Network first strategy
async function networkFirst(request) {
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    throw error;
  }
}

// Stale while revalidate strategy
async function staleWhileRevalidate(request) {
  const cachedResponse = await caches.match(request);
  
  const fetchPromise = fetch(request).then(networkResponse => {
    if (networkResponse.ok) {
      const cache = caches.open(DYNAMIC_CACHE);
      cache.then(c => c.put(request, networkResponse.clone()));
    }
    return networkResponse;
  }).catch(() => cachedResponse);
  
  return cachedResponse || fetchPromise;
}

// Fetch event - intelligent caching strategy
self.addEventListener('fetch', event => {
  const request = event.request;
  const strategy = getCacheStrategy(request);
  
  event.respondWith(
    (async () => {
      try {
        switch (strategy) {
          case CACHE_STRATEGIES.CACHE_FIRST:
            return await cacheFirst(request);
          case CACHE_STRATEGIES.NETWORK_FIRST:
            return await networkFirst(request);
          case CACHE_STRATEGIES.STALE_WHILE_REVALIDATE:
            return await staleWhileRevalidate(request);
          default:
            return await networkFirst(request);
        }
      } catch (error) {
        console.log('Fetch failed:', error);
        // Return offline page for navigation requests
        if (request.destination === 'document') {
          return caches.match('./index.html');
        }
        // Return a generic offline response for other requests
        return new Response('Offline', { status: 503, statusText: 'Service Unavailable' });
      }
    })()
  );
});

// Push notification event
self.addEventListener('push', event => {
  console.log('Push notification received:', event);
  
  let notificationData = {
    title: 'DSI Placement Portal',
    body: 'New job opportunity available!',
    icon: './DSi.png',
    badge: './DSi.png',
    tag: 'job-notification',
    requireInteraction: true,
    silent: false,
    vibrate: [200, 100, 200],
    data: {
      url: './',
      timestamp: Date.now(),
      type: 'job_update'
    },
    actions: [
      {
        action: 'view',
        title: 'View Jobs',
        icon: './DSi.png'
      },
      {
        action: 'dismiss',
        title: 'Dismiss'
      }
    ]
  };

  if (event.data) {
    try {
      const data = event.data.json();
      notificationData = { 
        ...notificationData, 
        ...data,
        data: {
          ...notificationData.data,
          ...data.data
        }
      };
    } catch (e) {
      notificationData.body = event.data.text();
    }
  }

  // Show notification with enhanced features
  event.waitUntil(
    self.registration.showNotification(notificationData.title, notificationData)
      .then(() => {
        // Store notification for offline viewing
        return caches.open(DYNAMIC_CACHE).then(cache => {
          const notificationRecord = {
            id: Date.now(),
            title: notificationData.title,
            body: notificationData.body,
            timestamp: Date.now(),
            data: notificationData.data,
            read: false
          };
          return cache.put(
            new Request(`/notification-${notificationRecord.id}`),
            new Response(JSON.stringify(notificationRecord))
          );
        });
      })
      .catch(error => {
        console.error('Failed to show notification:', error);
      })
  );
});

// Handle notification click for iOS
self.addEventListener('notificationclick', event => {
  console.log('Notification clicked:', event);
  
  event.notification.close();

  if (event.action === 'dismiss') {
    return;
  }

  // Default action or 'view' action
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then(clientList => {
      // If app is already open, focus it
      for (const client of clientList) {
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          return client.focus();
        }
      }
      // If app is not open, open it
      if (clients.openWindow) {
        return clients.openWindow('./');
      }
    })
  );
});


// Background sync for offline actions
self.addEventListener('sync', event => {
  console.log('Background sync:', event.tag);
  
  switch (event.tag) {
    case 'background-sync':
      event.waitUntil(doBackgroundSync());
      break;
    case 'job-application-sync':
      event.waitUntil(syncJobApplications());
      break;
    case 'profile-sync':
      event.waitUntil(syncProfileUpdates());
      break;
    case 'notification-sync':
      event.waitUntil(syncNotifications());
      break;
    default:
      console.log('Unknown sync tag:', event.tag);
  }
});

async function doBackgroundSync() {
  console.log('Performing background sync...');
  
  try {
    // Sync all pending actions
    await Promise.all([
      syncJobApplications(),
      syncProfileUpdates(),
      syncNotifications()
    ]);
    
    // Notify main thread that sync is complete
    const clients = await self.clients.matchAll();
    clients.forEach(client => {
      client.postMessage({
        type: 'SYNC_COMPLETE',
        timestamp: Date.now()
      });
    });
  } catch (error) {
    console.error('Background sync failed:', error);
  }
}

async function syncJobApplications() {
  const cache = await caches.open(DYNAMIC_CACHE);
  const keys = await cache.keys();
  const pendingApplications = keys.filter(key => key.url.includes('/pending-application-'));
  
  for (const key of pendingApplications) {
    try {
      const response = await cache.match(key);
      const applicationData = await response.json();
      
      // Attempt to sync with server
      const syncResponse = await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(applicationData)
      });
      
      if (syncResponse.ok) {
        // Remove from pending cache
        await cache.delete(key);
        console.log('Application synced successfully');
      }
    } catch (error) {
      console.error('Failed to sync application:', error);
    }
  }
}

async function syncProfileUpdates() {
  const cache = await caches.open(DYNAMIC_CACHE);
  const keys = await cache.keys();
  const pendingUpdates = keys.filter(key => key.url.includes('/pending-profile-'));
  
  for (const key of pendingUpdates) {
    try {
      const response = await cache.match(key);
      const profileData = await response.json();
      
      // Attempt to sync with server
      const syncResponse = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profileData)
      });
      
      if (syncResponse.ok) {
        // Remove from pending cache
        await cache.delete(key);
        console.log('Profile synced successfully');
      }
    } catch (error) {
      console.error('Failed to sync profile:', error);
    }
  }
}

async function syncNotifications() {
  const cache = await caches.open(DYNAMIC_CACHE);
  const keys = await cache.keys();
  const pendingNotifications = keys.filter(key => key.url.includes('/pending-notification-'));
  
  for (const key of pendingNotifications) {
    try {
      const response = await cache.match(key);
      const notificationData = await response.json();
      
      // Attempt to sync with server
      const syncResponse = await fetch('/api/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(notificationData)
      });
      
      if (syncResponse.ok) {
        // Remove from pending cache
        await cache.delete(key);
        console.log('Notification synced successfully');
      }
    } catch (error) {
      console.error('Failed to sync notification:', error);
    }
  }
}

// Message event for communication with main thread
self.addEventListener('message', event => {
  console.log('Service Worker received message:', event.data);
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'GET_VERSION') {
    event.ports[0].postMessage({ version: CACHE_NAME });
  }
  
  // Handle real-time push notifications
  if (event.data && event.data.type === 'PUSH_NOTIFICATION') {
    const notification = event.data.notification;
    console.log('Showing real-time notification:', notification);
    
    self.registration.showNotification(notification.title, {
      body: notification.body,
      icon: notification.icon,
      badge: notification.badge,
      tag: notification.tag,
      requireInteraction: true,
      silent: false,
      vibrate: [200, 100, 200],
      data: notification.data,
      actions: [
        {
          action: 'view',
          title: 'View Details',
          icon: notification.icon
        },
        {
          action: 'dismiss',
          title: 'Dismiss'
        }
      ]
    });
  }
});
