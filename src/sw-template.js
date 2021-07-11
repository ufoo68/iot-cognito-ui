if (typeof importScripts === 'function') {
  importScripts('https://storage.googleapis.com/workbox-cdn/releases/5.0.0/workbox-sw.js')
  importScripts('https://www.gstatic.com/firebasejs/8.2.0/firebase-app.js')
  importScripts('https://www.gstatic.com/firebasejs/8.2.0/firebase-messaging.js')
  importScripts('/swenv.js')

  firebase.initializeApp(swEnv)

  const messaging = firebase.messaging()

  messaging.onBackgroundMessage((payload) => {
    console.log('Received background message ', payload)

    const notificationTitle = payload.notification.title
    const notificationOptions = {
      body: payload.notification.body,
    }

    self.registration.showNotification(notificationTitle, notificationOptions)
  })
  messaging.getToken(vapiKeyEnv).then((currentToken) => {
    if (currentToken) {
      console.log('current token for client: ', currentToken)
    } else {
      console.log('No registration token available. Request permission to generate one.')
    }
  }).catch((err) => {
    console.log('An error occurred while retrieving token. ', err)
  })

  if (workbox) {
    console.log('Workbox is loaded')
    workbox.core.skipWaiting()

    workbox.precaching.precacheAndRoute(self.__WB_MANIFEST)

    workbox.routing.registerRoute(
      new workbox.routing.NavigationRoute(
        new workbox.strategies.NetworkFirst({
          cacheName: 'PRODUCTION',
        })
      )
    )
  } else {
    console.log('Workbox could not be loaded. No Offline support')
  }
}