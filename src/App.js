import React, { useState } from 'react'
import { withAuthenticator } from 'aws-amplify-react'
import Amplify, { PubSub } from 'aws-amplify'
import { AWSIoTProvider } from '@aws-amplify/pubsub'
import cryptoRandomString from 'crypto-random-string'
import Button from '@material-ui/core/Button'
import { makeStyles } from '@material-ui/core/styles'
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

const topic = process.env.REACT_APP_TOPIC

const useStyles = makeStyles(() => ({
  App: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    fontSize: '2rem',
  },
}))

const open = () => {
  PubSub.publish(`${topic}/open`, 'open')
}

const close = () => {
  PubSub.publish(`${topic}/close`, 'close')
}

const App = () => {
  const classes = useStyles()

  return (
    <div className={classes.App}>
      <div>KSHIKOIHAKO</div>
      <div>
        <Button variant="contained" color="primary" size="large" onClick={open}>Open</Button>
        <Button variant="contained" color="secondary" size="large" onClick={close}>Close</Button>
      </div>
    </div>
  )
}

export default withAuthenticator(App)