import React, { Component } from 'react';
import './App.css';
import {Bootstrap, Grid, Row, Col} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.css';
import { Navbar, NavItem, NavDropdown, MenuItem, Nav, FormGroup, FormControl, Button } from 'react-bootstrap';
var Alert = require('react-bootstrap/lib/Alert');

// virtual bookshelf
class Bookshelf extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    //console.log('window dimensions', window.innerWidth)
    return (
      <p>hi this is a bookshelf</p>
    )
  }
}

{/* 
  * Class: Book
  * Props: title, author, rating, description, review, cover img
  * description and review only appear upon clicking on the book tile
  * uniform size: ratio = 1.5:1 height:width
  *
  */}  
class Book extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="Book-tile">
        <p> { this.props.title } </p>
        <p>testing</p>
      </div>
    )
  }
}

// keeps track of navbar height
class SmartNav extends Component {
  constructor(props) {
    super(props);
    this.state = { nav_height: '0' };
    this.updateNavDimensions = this.updateNavDimensions.bind(this);
  }

  componentDidMount() {
    this.updateNavDimensions();
    window.addEventListener('resize', this.updateNavDimensions);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateNavDimensions);
  }


  updateNavDimensions() {
    const height = document.getElementById('smart-nav').clientHeight;
    this.setState({ nav_height: height });
    this.props.sendNavHeight(height);
  }

  render() {
    return (
      <nav className="navbar navbar-expand-md navbar-dark bg-dark fixed-top" id="smart-nav">
        <a className="navbar-brand" href="#">Navbar</a>
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarsExampleDefault" aria-controls="navbarsExampleDefault" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarsExampleDefault">
          <ul className="navbar-nav mr-auto">
            <li className="nav-item active">
              <a className="nav-link" href="#">Home <span className="sr-only">(current)</span></a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">Link</a>
            </li>
            <li className="nav-item">
              <a className="nav-link disabled" href="#">Disabled</a>
            </li>
            <li className="nav-item dropdown">
              <a className="nav-link dropdown-toggle" href="http://example.com" id="dropdown01" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Dropdown</a>
              <div className="dropdown-menu" aria-labelledby="dropdown01">
                <a className="dropdown-item" href="#">Action</a>
                <a className="dropdown-item" href="#">Another action</a>
                <a className="dropdown-item" href="#">Something else here</a>
              </div>
            </li>
          </ul>
          <form className="form-inline my-2 my-lg-0">
            <input className="form-control mr-sm-2" type="text" placeholder="Search" aria-label="Search" />
            <button className="btn btn-outline-success my-2 my-sm-0" type="submit">Search</button>
          </form>
        </div>
      </nav>
    )
  }
}

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { window_width: '0', window_height: '0', nav_height: '0' };
    this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
    this.getNavHeight = this.getNavHeight.bind(this);
  }

  componentDidMount() {
    this.updateWindowDimensions();
    window.addEventListener('resize', this.updateWindowDimensions);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateWindowDimensions);
  }

  updateWindowDimensions() {
    this.setState({ window_width: window.innerWidth, window_height: window.innerHeight });
  }

  getNavHeight(height) {
    this.setState({nav_height: height});
  }

  render() {
  

    const wellStyles = { maxWidth: 400, margin: '0 auto 10px' };

const buttonsInstance = (
  <div className="well" style={wellStyles}>
    <Button bsStyle="primary" bsSize="large" block>Block level button</Button>
    <Button bsSize="large" block>Block level button</Button>
  </div>
);


    return (
      <div>
       

        <SmartNav sendNavHeight={this.getNavHeight}/>
        <Book title="The Name of the Wind" />
        <Bookshelf />
        {buttonsInstance}
      </div>
    );
  }
}

export default App;
