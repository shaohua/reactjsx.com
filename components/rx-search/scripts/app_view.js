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
      console.log('child_added', arguments);
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
    console.log('onClick');
    this.firebaseRef.push({
      text: 'test'
    });
  },

  render: function() {
    return (
      <div className="commentBox"
        onClick={this.onClick}>
        Hello, world! I am a CommentBox.
      </div>
    );
  }
});

module.exports = AppView;
