/** @jsx React.DOM */
var _ = require('underscore'),
  $ = require('jquery'),
  React = require('react'),
  RB = require('react-bootstrap'),
  Jumbotron = RB.Jumbotron,
  Button = RB.Button,
  Panel = RB.Panel,
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

var NAV_LINKS = {
  'getting-started': {
    link: '/getting-started.html',
    title: 'Getting started'
  },
  'components': {
    link: '/components.html',
    title: 'Components'
  }
};

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
    // this.save();
    $.ajax({
      url: 'https://api.github.com/repos/facebook/react',
      type: 'GET'
    }).then(function(data){
      var repoInfo = {
        description: data.description,
        watchers_count: data.watchers_count,
        forks_count: data.forks_count
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

  renderNavItem: function (linkName) {
    var link = NAV_LINKS[linkName];

    return (
        <li className={this.props.activePage === linkName ? 'active' : null} key={linkName}>
          <a href={link.link}>{link.title}</a>
        </li>
      );
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
            {Object.keys(NAV_LINKS).map(this.renderNavItem)}
          </Nav>
        </Navbar>

        <Grid>
          <Row className="show-grid">
            <Col xs={18} md={12}>
              <Jumbotron>
                <h1>Hello, world!</h1>
                <p>This is a simple hero unit, a simple jumbotron-style component for calling extra attention to featured content or information.</p>
                <p><Button bsStyle="primary">Learn more</Button></p>
              </Jumbotron>
            </Col>
          </Row>
          <Row className="show-grid">
            <Col xs={6} md={4}><Panel>test 1</Panel></Col>
            <Col xs={6} md={4}><Panel>test 2</Panel></Col>
            <Col xs={6} md={4}><Panel>test 3</Panel></Col>
          </Row>
          <Row className="show-grid">
            <Col xs={18} md={12}><Panel>
              <input type='text'
                class='search'
                onChange={this.onSearchChange}
                />
            </Panel></Col>
          </Row>

          <Row className="show-grid">
            <Col xs={18} md={12}><Panel>
              <ul>
                {results}
              </ul>
            </Panel></Col>
          </Row>

          <Row className="show-grid">
            <Col xs={18} md={12}>
              <Panel>
                <div className="commentBox">
                  Hello, world! I am a CommentBox.
                  <input type='text'
                    onChange={this.onChange}
                    onKeyPress={this.onKeyPress} />
                  <input type='button'
                    onClick={this.onClick}
                    value='Submit'/>
                  <input type='button'
                    onClick={this.onRemove}
                    value='Remove'/>
                </div>
              </Panel>
            </Col>
          </Row>
          <Row className="show-grid">
            <Col xs={18} md={12}><Panel>test 4</Panel></Col>
          </Row>
        </Grid>

      </div>
    );
  }
});

module.exports = AppView;
