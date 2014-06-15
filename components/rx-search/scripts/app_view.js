/** @jsx React.DOM */
var _ = require('underscore'),
  $ = require('jquery'),
  React = require('react'),
  RB = require('react-bootstrap'),
  Jumbotron = RB.Jumbotron,
  Button = RB.Button,
  Panel = RB.Panel,
  Well = RB.Well,
  Navbar = RB.Navbar,
  Nav = RB.Nav,
  Grid = RB.Grid,
  Row = RB.Row,
  Col = RB.Col;

function getStoreState() {
  return {
    items: []
  };
}


var AppView = React.createClass({
  getInitialState: function() {
    this.items = [];

    this.peopleRef = new Firebase("//reactjsx.firebaseio.com/people");
    this.firebaseRef = new Firebase("//reactjsx.firebaseio.com/components");

    return getStoreState();
  },

  componentWillMount: function() {
    this.auth = new FirebaseSimpleLogin(this.firebaseRef, function(error, user) {
      if (error) {
        this.user = null;
        return;
      }

      this.user = user; //expose for other functions

      var currentPeopleRef = this.peopleRef.child( user.id );
      currentPeopleRef.once("value", function(peopleSnap) {
        var info = {};
        var val = peopleSnap.val();
        if (!val) {
          // If this is a first time login, upload user details.
          info = {
            id: user.id,
            uid: user.uid,
            provider: user.provider,
            username: user.username
          };
          currentPeopleRef.set(info);
        }
        currentPeopleRef.child("presence").set("online");
      });

    }.bind(this));

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

  onLogin: function(){
    console.log('onLogin');
    this.auth.login('github', {
      rememberMe: true
    });
  },

  parseUrl: function(githubUrl){
    var results = githubUrl.match(/github.com\/([^\/]+)\/([^\/]+)/i);
    //not global, needs to stop at the first match
    //case insenstive

    //have default values in case of no match
    return {
      userName: results[1] || 'facebook',
      repoName: results[2] || 'react'
    };
  },

  onClick: function(){
    console.log('onClick', this.state);
    var urlObj = this.parseUrl(this.state.currentInput);
    var githubUrl = 'https://api.github.com/repos/' +
                    urlObj.userName + '/' +
                    urlObj.repoName;
    // this.save();
    $.ajax({
      url: githubUrl,
      type: 'GET'
    }).then(function(data){
      var repoInfo = {
        description: data.description,
        watchers_count: data.watchers_count,
        forks_count: data.forks_count,
        userid: this.user.id
      };

      this.firebaseRef.push(repoInfo);
    }.bind(this));
  },

  onRemove: function(){
    //remove all data
    var localRef = this.firebaseRef.transaction(function(data){
      _.chain(data)
        .keys()
        .each(function(key){
          delete data[key];
        });
      return data;
    });
    console.log('remove');
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

  onSearchChange: function(event){
    this.setState({
      query: event.target.value
    }, function(){
      // console.log('query', this.state.query);
    }.bind(this));
  },

  save: function(){
    this.firebaseRef.push({
      text: this.state.currentInput
    });
  },

  containsQuery: function (item, query){
    query = query || '';  //guard gainst undefined
    var descLower = item.description.toLowerCase();
    var queryLower = query.toLowerCase();
    return (descLower.indexOf(queryLower) > -1);
  },

  render: function() {
    var brand = <a href="/" className="navbar-brand">Reactjsx.com</a>;

    var filteredItems = _.filter(this.state.items, function(item){
      return this.containsQuery(item, this.state.query);
    }, this);

    var results = _.map(filteredItems, function(item){
      return (
        <li>
          <ul>
            <li>{item.description}</li>
            <li>{item.forks_count}</li>
            <li>{item.watchers_count}</li>
          </ul>
        </li>
      );
    });

    return (
      <div>
        <Navbar componentClass={React.DOM.header} brand={brand} staticTop className="bs-docs-nav" role="banner" toggleNavKey={0}>
          <Nav className="bs-navbar-collapse" role="navigation" key={0} id="top">
            <li>
              <a href="#" onClick={this.onLogin}>Login with Github</a>
            </li>
          </Nav>
        </Navbar>

        <Grid>
          <Row className="show-grid">
            <Col xs={18} md={12}>
              <Jumbotron>
                <h2 className="center">Search reusable React components</h2>
                <input type='text'
                  placeholder='react component'
                  className='search-input'
                  onChange={this.onSearchChange}
                />
              </Jumbotron>
            </Col>
          </Row>
          <Row className="show-grid">
            <Col xs={18} md={12}>

            </Col>
          </Row>

          <Row className="show-grid">
            <Col xs={18} md={12}>
              <Panel header='Search results' bsStyle="primary">
                <ul>
                  {results}
                </ul>
              </Panel>
            </Col>
          </Row>

          <Row className="show-grid">
            <Col xs={18} md={12}>
              <Panel header='Submit your component'>
              <Button
                bsStyle="success"
                className='oneline-button'
                onClick={this.onClick}>
                Submit
              </Button>
              <div className='oneline-input-container'>
                <input type='text'
                  className='oneline-input'
                  placeholder='github.com/facebook/react/'
                  onChange={this.onChange}
                  onKeyPress={this.onKeyPress} />
              </div>
              </Panel>
            </Col>
          </Row>
        </Grid>

      </div>
    );
  }
});

module.exports = AppView;
