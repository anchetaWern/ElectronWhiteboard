import React, { Component } from "react";
import { Container, Row, Col, Button, Input } from 'reactstrap';
import { SketchField, Tools } from 'react-sketch';

import { FaMousePointer, FaPen, FaCircle, FaSquare, FaTrash } from 'react-icons/fa';

import shortid from 'shortid';

class WhiteboardScreen extends Component {
 
  state = {
    text: '',
    myUsername: '',
    tool: Tools.Pencil
  }

  constructor(props) {
    super(props);

    this.tools = [
      {
        name: 'select',
        icon: <FaMousePointer />,
        tool: Tools.Select
      },
      {
        name: 'pencil', 
        icon: <FaPen />,
        tool: Tools.Pencil
      },
      {
        name: 'rect',
        icon: <FaSquare />,
        tool: Tools.Rectangle
      },
      {
        name: 'circle',
        icon: <FaCircle />,
        tool: Tools.Circle
      }
    ];

    this.auto_create_tools = ['circle', 'rect'];

    this.initial_objects = {
      'circle': { radius: 75, fill: 'transparent', stroke: '#000', strokeWidth: 3, top: 60, left: 500 },
      'rect': { width: 100, height: 50, fill: 'transparent', stroke: '#000', strokeWidth: 3, top: 100, left: 330 },
    }
  }


  componentDidMount() {

    const { navigation } = this.props;
    this.myUsername = navigation.getParam("myUsername");
    this.pusher = navigation.getParam("pusher");
    this.group_channel = navigation.getParam("group_channel");

    this.setState({
      myUsername: this.myUsername
    });
    
    let textGatherer = this._gatherText();

    this.group_channel.bind('client-whiteboard-updated', (payload) => {
  
      textGatherer(payload.data);

      if (payload.is_final) {
        const full_payload = textGatherer(); 
        let obj = '';
        if (full_payload) {
          obj = JSON.parse(full_payload);

          if(payload.id){
            Object.assign(obj, { id: payload.id, sender: payload.sender });
          }else{
            Object.assign(obj, { sender: payload.sender });
          }
        }
        
        if (payload.action === 'add') {
          this._sketch.addObject(JSON.stringify(obj));
        } else if(payload.action === 'update') {
          this._sketch.modifyObject(JSON.stringify(obj));
        } else if(payload.action === 'remove') {
          this._sketch.setSelected(payload.id);
          this._sketch.removeSelected();
        }

        textGatherer = this._gatherText();
        
      }
    
    });

  }


  render() {
    return (
      <Container fluid>
        <Row>
          <Col lg={9}>
            {
              this.state.myUsername &&
              <SketchField
                className="canvas"
                ref={c => (this._sketch = c)}
                width='1024px'
                height='768px'
                tool={this.state.tool}
                lineColor='black'
                lineWidth={3}
                onUpdate={this.sketchUpdated}
                username={this.state.myUsername}
                shortid={shortid} />
            }
          </Col>

          <Col lg={3} className="Sidebar">
            <div className="tools">

              {this.renderTools()}

              <div className="tool">
                <Button 
                  color="danger" 
                  size="lg" 
                  onClick={this.removeSelected} 
                >
                  <FaTrash />
                </Button>
              </div>
            </div>
            
            <div>
              <div className="textInputContainer">
                <Input 
                  type="textarea" 
                  name="text_to_add" 
                  id="text_to_add" 
                  placeholder="Enter text here" 
                  value={this.state.text}
                  onChange={this.onUpdateText} />
                <div className="buttonContainer">
                  <Button type="button" color="primary" onClick={this.addText} block>Add Text</Button>
                </div>
              </div>
            </div>

          </Col>  
        </Row>
      </Container>
    );
  }

  //

  _gatherText = () => {
    let sentence = '';
    return (txt = '') => {
     return sentence += txt;
    }
  }

  onUpdateText = (event) => {
    this.setState({
      text: event.target.value
    });
  }
  
  // 

  addText = () => {
    if(this.state.text){
      const id = shortid.generate();
      this._sketch.addText(this.state.text, { id }); 
    
      this.setState({
        text: ''
      });
    }
  }

  //

  pickTool = (event) => {
    const button = event.target.closest('button');
    const tool = button.getAttribute('data-tool');
    const tool_name = button.getAttribute('data-name');

    this.setState({
      tool
    }, () => {
      if(this.auto_create_tools.indexOf(tool_name) !== -1){
       
        const obj = this.initial_objects[tool_name];
        const id = shortid.generate();
        Object.assign(obj, { id: id, type: tool_name });
        
        this._sketch.addObject(JSON.stringify(obj)); 
      
        setTimeout(() => {
          this.setState({
            tool: Tools.Select 
          });
        }, 500);

      }

    });
  }


  renderTools = () => {
    return this.tools.map((tool) => {
      return (
        <div className="tool" key={tool.name}>
          <Button 
            color="secondary" 
            size="lg" 
            onClick={this.pickTool} 
            data-name={tool.name}
            data-tool={tool.tool}
          >
            {tool.icon}
          </Button>
        </div>
      );
    });
  }

  sketchUpdated = (obj, action, sender, id = null) => {
    
    if (this.state.myUsername) {
      let length_per_part = 8000;
      let loop_count = Math.ceil(obj.length / length_per_part);

      let from_str_index = 0;
      for (let x = 0; x < loop_count; x++) {
        const str_part = obj.substr(from_str_index, length_per_part);

        const payload = {
          action: action,
          id: id,
          data: str_part,
          sender: this.state.myUsername
        };

        if (x + 1 === loop_count) {
          Object.assign(payload, { is_final: true });
        }
        
        this.updateOtherUsers(payload);
        from_str_index += length_per_part;
      }
    }
  }


  updateOtherUsers = (payload) => {
    
    this.group_channel.trigger('client-whiteboard-updated', payload);
  }


  removeSelected = () => {
    const activeObj = this._sketch.getSelected();
    
    const payload = {
      action: 'remove',
      is_final: true,
      id: activeObj.id,
      sender: this.state.myUsername
    };

    this.updateOtherUsers(payload);
    this._sketch.removeSelected();
  }

}

export default WhiteboardScreen;