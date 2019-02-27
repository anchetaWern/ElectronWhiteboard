import React, { Component } from 'react';
import { Button, Input } from 'reactstrap';
import { Scrollbars } from 'react-custom-scrollbars';
import MessageBox from './MessageBox';

class ChatBox extends Component {
  
  state = {
    is_sending: false,
    message: ''
  }

  render() {
    return (
      <div className="ChatBox">
        <Scrollbars
          style={{ height: 250, width: 300 }}
          autoHide={true}
        >
          <div className="MessageBoxes">{this._renderMessages()}</div>
        </Scrollbars>

        <div className="textInputContainer">
          <Input 
            type="textarea" 
            name="message" 
            id="message" 
            placeholder="Enter message here" 
            value={this.state.message}
            onChange={this.onUpdateMessage} />
        </div>
        
        <div className="buttonContainer">
          <Button
            variant="primary"
            onClick={this.sendMessage}
            disabled={this.state.is_sending}
            block
          >
            {this.state.is_sending ? "Sending…" : "Send"}
          </Button>
        </div>

      </div>
    );
  }


  _renderMessages = () => {
    return this.props.messages.map(msg => {
      return <MessageBox msg={msg} userID={this.props.userID} />
    });
  };
  
  //

  onUpdateMessage = evt => {
    this.setState({
      message: evt.target.value
    });
  };
  
  //

  sendMessage = async () => {
    let msg = {
      text: this.state.message,
      roomId: this.props.roomID
    };

    this.setState({
      is_sending: true
    });

    try {
      await this.props.currentUser.sendMessage(msg);
      this.setState({
        is_sending: false,
        message: ""
      });
    } catch (err) {
      console.log("error sending message: ", err);
    }
  };
  
  //



}

export default ChatBox;