import React, { useState } from 'react'
import { withAuthenticator } from 'aws-amplify-react'
import Amplify, { PubSub } from 'aws-amplify'
import { AWSIoTProvider } from '@aws-amplify/pubsub'
import cryptoRandomString from 'crypto-random-string'
import Button from '@material-ui/core/Button'
import { makeStyles } from '@material-ui/core/styles'
import closeImg from './close.png'
import openImg from './open.png'
import '@aws-amplify/ui/dist/style.css'

Amplify.configure({
  Auth: {
    identityPoolId: process.env.REACT_APP_IDENTITY_POOL_ID,
    region: process.env.REACT_APP_REGION,
    userPoolId: process.env.REACT_APP_USER_POOL_ID,
    userPoolWebClientId: process.env.REACT_APP_USER_CLIENT_ID,
  }
})

Amplify.addPluggable(new AWSIoTProvider({
  aws_pubsub_region: process.env.REACT_APP_REGION,
  aws_pubsub_endpoint: `wss://${process.env.REACT_APP_PUBSUB_ENDPOINT}/mqtt`,
  clientId: cryptoRandomString({ length: 10 }),
}))

const useStyles = makeStyles(() => ({
  App: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    fontSize: '2rem',
  },
  Button: {
    display: 'flex',
    flexDirection: 'column',
  }
}))

const App = () => {
  const classes = useStyles()
  const [boxStatus, setBoxStatus] = useState('close')
  const updateBoxStatus = (status) => {
    PubSub.publish(`$aws/things/${process.env.REACT_APP_DEVICE_NAME}/shadow/update`, {
      state: { desired: { boxStatus: status } }
    })
  }
  PubSub.publish(`$aws/things/${process.env.REACT_APP_DEVICE_NAME}/shadow/get`, '')
  PubSub.subscribe([
    `$aws/things/${process.env.REACT_APP_DEVICE_NAME}/shadow/update/accepted`,
    `$aws/things/${process.env.REACT_APP_DEVICE_NAME}/shadow/get/accepted`
  ]).subscribe({
    next: data => {
      console.log('recieved: ', data)
      const rBoxStatus = data.value.state?.reported?.boxStatus
      if (rBoxStatus && rBoxStatus != boxStatus) {
        setBoxStatus(rBoxStatus)
      }
    },
    error: error => console.error(error),
    close: () => console.log('Done'),
  })

  return (
    <div className={classes.App}>
      <div>KSHIKOIHAKO</div>
      {
        boxStatus === 'open' ?
          <div className={classes.Button}>
            <img src={openImg} />
            <Button variant="contained" color="secondary" size="large" onClick={() => updateBoxStatus('close')}>Close</Button>
          </div> :
          <div className={classes.Button}>
            <img src={closeImg} />
            <Button variant="contained" color="primary" size="large" onClick={() => updateBoxStatus('open')}>Open</Button>
          </div>
      }
    </div>
  )
}

export default withAuthenticator(App)