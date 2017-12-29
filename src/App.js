import React, { Component } from 'react';
import './App.css';

// loading json book data
import json from './metadata.json'
import {ReactHeight} from 'react-height';
 

// virtual bookshelf
class Bookshelf extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      shelf_width: 0,
      shelf_space: 10, // space between books
      book_width: 150,
      shelf_size: 0, // shelf_size = num books that can fit on a shelf
      shelf_arrays: [] // shelf arrays, array of books to be displayed on a shelf
    };

    this.calculateShelf = this.calculateShelf.bind(this);
    this.books2Shelves = this.books2Shelves.bind(this);
  }

  componentDidMount() {
    console.log("component just mount width: ", this.state.shelf_width);
    var space = this.state.shelf_space;
    var bookWidth = this.state.book_width;

    var temp = space;
    var numBooks = 0;
    while (temp + bookWidth + space <= this.props.width) {
      temp += bookWidth + space;
      numBooks++;
    }
    console.log('numbooks: ', numBooks)
    this.setState({ shelf_size: numBooks}, this.books2Shelves);
    console.log("space calulated ", this.state.shelf_size)
  }

  // update the shelf width when window size changes or whatever
  componentWillReceiveProps(nextProps) {
    this.setState({ shelf_width: nextProps.width });
    this.calculateShelf();
    this.books2Shelves();
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
    
  }

  // split books into shelves
  books2Shelves() {
    var shelves = [];
    var numBooks = this.state.shelf_size;
    var temp = [];
    for (var j = 0; j < json.length; j++) {
      if (j % numBooks === 0) {
        shelves.push(json.slice(j, j+this.state.shelf_size));
      } 
    }
    
    this.setState({ shelf_arrays: shelves});
  }

  // determine how many shelevs we need and how many books on each shelf
  render() {
    // make shelves
    var shelfArrs = this.state.shelf_arrays;
    var shelves = []
    for (var j = 0; j < shelfArrs.length; j++)
    {
        shelves.push(<Shelf key={j} shelfPos={j} bookData={shelfArrs[j]} bookWidth={this.state.book_width} space={this.state.shelf_space}/>);
    }

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
    this.state = { 
      heights: [] // array of book heights on the shelf
    };

    this.findTallestBook = this.findTallestBook.bind(this);
    this.addHeight = this.addHeight.bind(this);
  }

  componentDidMount() {
    this.findTallestBook();
    this.setState({ heights: [] }); // reset height
  }

  componentWillUnmount() {
    this.setState({ heights: [] }); // reset height
  }

  addHeight(height, pos) {
    var temp = this.state.heights;
    if (temp.length > this.props.bookData.length) {
      temp = temp.slice(0, this.props.bookData.length);
    }
    temp[pos] = height;
    //temp.push(height);
    this.setState({ heights: temp });
  }

  // todo: find tallest image and set shelf to that height
  findTallestBook() {
    var bookArr = this.props.bookData;
    var heights = [];
    for (var j = 0; j < bookArr.length; j++) {
      heights.push(bookArr[j].img.naturalHeight);
    }
    heights.sort((a, b) => (-1*(a-b)));
    console.log("arry: ", heights);
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

    // put books on the same line
    var books = bookArray.map((book, index) => (
      <Book key={index} shelfPos={this.props.shelfPos} pos={index} addHeight={this.addHeight} book={book} space={this.props.space} bookWidth={this.props.bookWidth} />
    ))

    return (
      <div className='shelf' style={{top: (1.5*this.props.bookWidth + this.props.space)*(this.props.shelfPos)}}>
        {books}
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

    this.state = { 
      height: 0 // height of book in px
    };
  }

  render() {
    return (
      <div className="book" style={{left: (this.props.space + this.props.bookWidth)*(this.props.pos + 1)}}>
        <ReactHeight onHeightReady={val => this.setState({ height: val }, this.props.addHeight(val, this.props.pos))}>
          <img src={this.props.book.img} alt="cover img"></img>
        </ReactHeight>
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
    this.state = { 
      window_width: '0', 
      window_height: '0', 
      nav_height: '0',
      content_width: '0' 
    };
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
    const width = document.getElementById('content').clientWidth;
    this.setState({ content_width: width})
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
        <div id="content" style={{marginTop: navMargin}}>
          <Bookshelf width={this.state.window_width}/>
        </div>
      </div>
    );
  }
}

export default App;
