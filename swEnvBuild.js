const fs = require('fs')
require('dotenv').config({ path: '.env.production.local' })

fs.writeFileSync('./public/swenv.js',
  `
const swEnv = {
  apiKey: '${process.env.REACT_APP_API_KEY}',
  authDomain: '${process.env.REACT_APP_AUTH_DOMAIN}',
  projectId: '${process.env.REACT_APP_PROJECT_ID}',
  storageBucket: '${process.env.REACT_APP_STORAGE_BUCKET}',
  messagingSenderId: '${process.env.REACT_APP_MESSAGING_SENDER_ID}',
  appId: '${process.env.REACT_APP_APP_ID}',
  measurementId: '${process.env.REACT_APP_MEASUREMENT_ID}',
}
const vapiKeyEnv = { 
  vapidKey: '${process.env.REACT_APP_VAPI_KEY}',
}
`)