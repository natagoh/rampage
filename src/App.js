import React, { Component } from 'react';
import './App.css';

// loading json book data
import json from './metadata.json'

//import {Bootstrap, Grid, Row, Col} from 'react-bootstrap';
//import { Navbar, NavItem, NavDropdown, MenuItem, Nav, FormGroup, FormControl, Button } from 'react-bootstrap';
//var Alert = require('react-bootstrap/lib/Alert');

// virtual bookshelf
class Bookshelf extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      shelf_width: 0,
      shelf_space: 10, // space between books
      book_width: 150,
      shelf_size: 1, // shelf_size = num books that can fit on a shelf
      shelf_arrays: [] // shelf arrays, array of books to be displayed on a shelf
    };

    this.calculateShelf = this.calculateShelf.bind(this);
    this.books2Shelves = this.books2Shelves.bind(this);
  }


  // update the shelf width when window size changes or whatever
  componentWillReceiveProps(nextProps) {
    this.setState({ shelf_width: nextProps.width });
    this.calculateShelf();
  }

  // determining how many books can fit in a shelf
  calculateShelf() {
    var space = this.state.shelf_space;
    var bookWidth = this.state.book_width;

    var temp = space;
    var numBooks = 0;
    while (temp + bookWidth + space <= this.props.width) {
      temp += bookWidth + space;
      numBooks++;
    }
    this.setState({ shelf_size: numBooks});
    this.books2Shelves();
  }

  // split books into shelves
  books2Shelves() {
    var numBooks = this.state.shelf_size; // num books per shelf
    var shelves = [];
    for (var j = 0; j < json.length; j += numBooks) {
      var splitBooks = json.slice(j, j+numBooks);
      console.log("slice tets: ", j ," ", splitBooks);
      shelves.push(splitBooks);
    }
    this.setState({ shelf_arrays: shelves});
    console.log("shelf arrs: ", this.state.shelf_arrays);
  }

  // determine how many shelevs we need and how many books on each shelf
  render() {
    //console.log("numbooks: ", numBooks)
    // make shelves
    var shelfArrs = this.state.shelf_arrays;
    var shelves = []
    for (var j = 0; j < shelfArrs.length; j++)
    {
        shelves.push(<Shelf bookData={shelfArrs[j]} />);
    }

    //console.log('window dimensions', window.innerWidth)
    return (
      <div id='bookshelf'>
        {shelves}
      </div>    
    )
  }
}

// a bookshelf consists of shelves
// which consists of books
class Shelf extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    // fit as many books on the shelf as possible
    var bookArray = this.props.bookData;  
   
    // styling to fit the books  
    var shelf_style = {
      position: 'absolute',
      bottom: '10px',
      left: '5px'
    }

    return (
      <div className='shelf'>
        {bookArray.map((book, index) => (
          <div key={index}>
            <p> Hello, {book.title} from {book.author}!</p>
            <img src={book.img} alt="cover img"></img>
          </div>
        ))}
      </div>
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

  // renders the navbar
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

// the main app
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
    //const wellStyles = { maxWidth: 400, margin: '0 auto 10px' };

    /*const buttonsInstance = (
      <div className="well" style={wellStyles}>
        <Button bsStyle="primary" bsSize="large" block>Block level button</Button>
        <Button bsSize="large" block>Block level button</Button>
      </div>
    );
    */
    var navMargin = this.state.nav_height + 'px'

    return (
      <div>
        <SmartNav sendNavHeight={this.getNavHeight}/>

        {/* div containing everything except for navbar */}
        <div style={{marginTop: navMargin}}>
          <Bookshelf width={this.state.window_width}/>
        </div>
      </div>
    );
  }
}

export default App;
