import axios from 'axios'

export const sendFcm = async (body, to) =>
  await axios.post('https://fcm.googleapis.com/fcm/send', {
    to,
    notification: {
      body,
      title: 'KASHIKOIHAKO',
    },
  }, {
    headers: {
      Authorization: `key=${process.env.REACT_APP_SERVER_KEY}`,
    },
  })