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
  Col = RB.Col,
  Table = RB.Table;

var AppView = React.createClass({
  getInitialState: function() {
    this.firebaseRef = new Firebase("//reactjsx.firebaseio.com");
    this.peopleRef = this.firebaseRef.child("people");
    this.compRef = this.firebaseRef.child("components");
    return {
      items: [],
      user: null
    };
  },

  componentWillMount: function() {
    //auth callback will be invoked any time that
    //the user's authentication state changed
    this.auth = new FirebaseSimpleLogin(this.firebaseRef, function(error, user) {
      if (error) return;

      this.setState({
        user: user
      });

      if(user && user.id) {
        this.saveUser(user);
      }
    }.bind(this));

    //get all the data initially and after every change
    //from /facebook/react/obj1 and /react-bootstrap/react-bootstrap/obj2
    //to [obj1, obj2]
    var data, allItems;
    this.compRef.on("value", function(dataSnapshot) {
      data = dataSnapshot.val();
      allItems = _.chain(data)
        .values()
        .map(function(item){ return _.values(item); })
        .flatten()
        .value();

      this.setState({
        items: allItems
      });
    }.bind(this));
  },

  componentDidMount: function() {
    //empty for now
  },

  //unbind events
  componentWillUnmount: function() {
    this.peopleRef.off();
    this.compRef.off();
    this.firebaseRef.off();
  },

  saveUser: function(user){
    var currentPeopleRef = this.peopleRef.child( user.id );
    currentPeopleRef.once("value", function(peopleSnap) {
      var val = peopleSnap.val();
      if (!val) {
        // If this is a first time login, upload user details.
        currentPeopleRef.set({
          id: user.id,
          uid: user.uid,
          provider: user.provider,
          username: user.username
        });
      }
      currentPeopleRef.child("presence").set("online");
    });
  },

  onLogin: function(){
    // console.log('onLogin');
    this.auth.login('github', {
      rememberMe: true
    });
  },

  onLogout: function(){
    // console.log('onLogout');
    this.auth.logout();
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

  /**
   * replace . in url with _
   * coz firebase doesn't allow . in path
   */
  _normalize: function(input){
    return input.replace(/\./ig,'_');
  },

  onSubmit: function(){
    // console.log('onSubmit', this.state);
    if(!this.state.user) {
      alert('Could you please login with Github? Thanks.');
      return;
    }

    var urlObj = this.parseUrl(this.state.currentInput);
    var githubUrl = 'https://api.github.com/repos/' +
                    urlObj.userName + '/' +
                    urlObj.repoName;
    var repoUrl = '//github.com/' +
                    urlObj.userName + '/' +
                    urlObj.repoName;
    $.ajax({
      url: githubUrl,
      type: 'GET'
    }).then(function(data){
      var repoInfo = _.extend({
        userid: this.state.user.id,
        reactjsx: {
          userName: urlObj.userName,
          repoName: urlObj.repoName,
          repoUrl: repoUrl
        }
      }, data);

      //repoName can contain '.' but firebase can NOT
      this.compRef
        .child(urlObj.userName)
        .child( this._normalize(urlObj.repoName) )
        .set(repoInfo);
    }.bind(this));
  },

  onChange: function(event){
    this.setState({
      currentInput: event.target.value
    });
  },

  //submit on enter
  onKeyPress: function(event){
    // console.log('onKeyPress');
    if(event.which === 13){
      this.onSubmit();
    }
  },

  onSearchChange: function(event){
    this.setState({
      query: event.target.value
    });
  },

  containsQuery: function(item, query){
    query = query || '';  //guard gainst undefined
    var nameLower = item.name.toLowerCase();
    var descLower = item.description.toLowerCase();
    var queryLower = query.toLowerCase();
    return (nameLower.indexOf(queryLower) > -1 ||
            descLower.indexOf(queryLower) > -1);
  },

  render: function() {
    var brand = <a href="/" className="navbar-brand">Reactjsx.com</a>;

    var filteredItems = _.filter(this.state.items, function(item){
      return this.containsQuery(item, this.state.query);
    }, this);

    var sortedItems = _.sortBy(filteredItems, function(item){
      return -1 * item.watchers_count;
    });

    var tableResults = _.map(sortedItems, function(item){
      return (
        <tr>
          <td>
            <a target='_blank' href={item.reactjsx && item.reactjsx.repoUrl}>
              {item.reactjsx && item.reactjsx.repoName}
            </a>
          </td>
          <td>{item.description}</td>
          <td>{item.watchers_count}</td>
          <td>{item.reactjsx && item.reactjsx.userName}</td>
          <td>{item.updated_at}</td>
        </tr>
      );
    });

    var loginClassName = this.state.user ? 'hide' : 'show',
      logoutClassName = this.state.user ? 'show' : 'hide';

    return (
      <div>
        <Navbar componentClass={React.DOM.header} brand={brand} staticTop className="bs-docs-nav" role="banner" toggleNavKey={0}>
          <Nav className="bs-navbar-collapse" role="navigation" key={0} id="top">
            <li>
              <a href="#" className={loginClassName}
                onClick={this.onLogin}>Login with Github</a>
            </li>
            <li>
              <a href="#" className={logoutClassName}
                onClick={this.onLogout}>Logout</a>
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
              <Panel header='Search results' bsStyle="primary">
                <Table striped condensed hover>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Description</th>
                      <th>Stars</th>
                      <th>Author</th>
                      <th>Updated</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tableResults}
                  </tbody>
                </Table>
              </Panel>
            </Col>
          </Row>

          <Row className="show-grid">
            <Col xs={18} md={12}>
              <Panel header='Submit your component'>
              <Button
                bsStyle="success"
                className='oneline-button'
                onClick={this.onSubmit}>
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
