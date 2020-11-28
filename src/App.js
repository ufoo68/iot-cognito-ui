import React, { Component } from 'react'
import './App.css'
import { withAuthenticator } from 'aws-amplify-react'
import Amplify, { PubSub } from 'aws-amplify'
import { AWSIoTProvider } from '@aws-amplify/pubsub'

Amplify.configure({
    Auth: {
        identityPoolId: 'ap-northeast-1:2045dcde-d565-4ed1-995c-8d43f52b8ab5', 
        region: 'ap-northeast-1', 
        userPoolId: 'ap-northeast-1_vSRFqM3Vd', 
        userPoolWebClientId: '29adpeuu3v2aujm339cvtig436', 
    }
})

Amplify.addPluggable(new AWSIoTProvider({
  aws_pubsub_region: 'ap-northeast-1',
  aws_pubsub_endpoint: 'wss://a1rmwt2be3qlj4-ats.iot.ap-northeast-1.amazonaws.com/mqtt',
  clientId: 'nigiyakashi_iot_thing'
}))

class App extends Component {

  constructor(props) {
    super(props)
    this.state = {
      messages: [],
      topic: ''
    }

    this.handleSubscribe = this.handleSubscribe.bind(this)    
    this.handlePublish = this.handlePublish.bind(this)
    this.handleChangeTopic = this.handleChangeTopic.bind(this)
    this.handleReceive = this.handleReceive.bind(this)
  }
 
  render() {
    return (
      <div className="App">
        <label>TOPIC:
          <input type="text" onChange={this.handleChangeTopic}></input>
        </label><br/>
        <button onClick={this.handlePublish}>publish</button>
        <button onClick={this.handleSubscribe}>subscribe</button>
        <MessageList messages={this.state.messages} />
      </div>
    )
  }

  handlePublish(){
    PubSub.publish(this.state.topic, 'pub message from browser!!')    
  }
  
  handleSubscribe(topic){
    PubSub.subscribe(this.state.topic).subscribe({
      next: this.handleReceive,
      error: error => console.error(error),
      close: () => console.log('Done'),
    })
  }

  handleChangeTopic(event) {
    this.setState({topic: event.target.value})
  }

  handleReceive(msg){
    const messages = this.state.messages
    messages.push(JSON.stringify(msg.value))
    this.setState({messages: messages})
  }
}
 
 
class MessageList extends React.Component {
 
  render() {
    let id = 1
    return (
      <ul>
        {this.props.messages.map(message => {
          id += 1
          return (
           <li key={id}>
             <div>
               {message}
             </div>
           </li>
         )
       })}
     </ul>
    )
  }
}
 
export default withAuthenticator(App)