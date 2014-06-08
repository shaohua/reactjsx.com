/** @jsx React.DOM */
var _ = require('underscore'),
  React = require('react');

var AppView = React.createClass({
  onClick: function(){
    console.log('onClick');
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
