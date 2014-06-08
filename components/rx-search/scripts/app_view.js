/** @jsx React.DOM */
var _ = require('underscore'),
  React = require('react');

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
      <div className="commentBox">
        Hello, world! I am a CommentBox.
        <input type='text'
          onChange={this.onChange}
          onKeyPress={this.onKeyPress} />
        <input type='button'
          onClick={this.onClick}
          value='Submit'/>
      </div>
    );
  }
});

module.exports = AppView;
