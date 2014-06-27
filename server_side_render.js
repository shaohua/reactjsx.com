require('node-jsx').install();

var React = require('react'),
  _ = require('underscore'),
  Firebase = require('firebase'),
  AppView = require('./rx-search/scripts/app_view');

var firebaseRef = new Firebase("//reactjsx.firebaseio.com/components");
firebaseRef.on("value", function(dataSnapshot) {
  data = dataSnapshot.val();
  allItems = _.chain(data)
    .values()
    .map(function(item){ return _.values(item); })
    .flatten()
    .value();

  var props = {items: allItems};
  var innerHTML = React.renderComponentToString(AppView(props));
  console.log(innerHTML);
}.bind(this));
