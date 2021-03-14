import React, { useState } from 'react'
import './App.css'
import { withAuthenticator } from 'aws-amplify-react'
import Amplify, { PubSub } from 'aws-amplify'
import { AWSIoTProvider } from '@aws-amplify/pubsub'
import cryptoRandomString from 'crypto-random-string'
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
  clientId: cryptoRandomString({length: 10}),
}))

const topic = process.env.REACT_APP_TOPIC

const App = () => {
  const [message, setMessage] = useState('')

  const handleChangeMessage = (event) => {
    setMessage(event.target.value)
  }

  const handlePublish = () => {
    PubSub.publish(topic, message)
    console.log('send')
  }

  return (
    <div className="App">
      <div>AWS IoT test UI</div>
      <div>
        <label>MESSAGE:
          <input type="text" onChange={handleChangeMessage}></input>
        </label>
      </div>
      <button onClick={handlePublish}>publish</button>
    </div>
  )
}

export default withAuthenticator(App)