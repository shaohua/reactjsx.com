/** @jsx React.DOM */
var _ = require('underscore'),
  React = require('react'),
  RB = require('react-bootstrap'),
  Jumbotron = RB.Jumbotron,
  Button = RB.Button,
  Panel = RB.Panel;

function getStoreState() {
  return {
    items: []
  };
}

var AppView = React.createClass({
  getInitialState: function() {
    this.items = [];
    this.firebaseRef = new Firebase("//reactjsx.firebaseio.com/components");

    return getStoreState();
  },

  componentWillMount: function() {
    this.firebaseRef.on("child_added", function(dataSnapshot) {
      // console.log('child_added', arguments);
      this.items.push(dataSnapshot.val());
      this.setState({
        items: this.items
      });
    }.bind(this));
  },

  componentDidMount: function() {
  },

  componentWillUnmount: function() {
    this.firebaseRef.off();
  },


  onClick: function(){
    // console.log('onClick');
    this.save();
  },

  onChange: function(event){
    this.setState({
      currentInput: event.target.value
    });
  },

  onKeyPress: function(event){
    // console.log('onKeyPress');
    if(event.which === 13){
      this.save();
      // console.log('enter', this.state.currentInput);
    }
  },

  save: function(){
    this.firebaseRef.push({
      text: this.state.currentInput
    });
  },


  render: function() {
    return (
      <div>
        <Jumbotron>
          <h1>Hello, world!</h1>
          <p>This is a simple hero unit, a simple jumbotron-style component for calling extra attention to featured content or information.</p>
          <p><Button bsStyle="primary">Learn more</Button></p>
        </Jumbotron>
        <Panel>
          <div className="commentBox">
            Hello, world! I am a CommentBox.
            <input type='text'
              onChange={this.onChange}
              onKeyPress={this.onKeyPress} />
            <input type='button'
              onClick={this.onClick}
              value='Submit'/>
          </div>
        </Panel>
      </div>
    );
  }
});

module.exports = AppView;
