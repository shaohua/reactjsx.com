/** @jsx React.DOM */
var _ = require('underscore'),
  React = require('react'),
  AppView = require('./app_view');

var Proto = Object.create(HTMLElement.prototype);

_.extend(Proto, {
  createdCallback: function(){
  },

  attachedCallback: function(){
    this.initialize();
  },

  detachedCallback: function(){
  },

  attributeChangedCallback: function(attrName, oldVal, newVal){
    // console.log('attributeChangedCallback', arguments);
  },

  initialize: function(){
    React.renderComponent(
      <AppView />,
      this
    );
  }
});

document.registerElement('rx-search', {
  prototype: Proto
});