import React, { Component } from 'react';
import './App.css';

// loading json book data
import json from './metadata.json'
import {ReactHeight} from 'react-height';

// flicking thing
import Flickity from 'react-flickity-component/src/index'
import HorizontalScroll from 'react-scroll-horizontal'

class ScrollingHorizontally extends Component {
  render() {
    const child = { width: `300em`, height: `100%`}
    return (
      <body>
        <HorizontalScroll>
          <div style={child} />
        </HorizontalScroll>
      </body>
 
    )
  }
}

/* ----------
 * | Props: |
 * ----------
 * width: width of the window
 *
 * ----------
 * | States |
 * ----------
 * book_width: // max width of a book
 * shelf_arrays: // 
 * shelf_size:
 * shelf_space:
 * shelf_width:
 */
class Bookshelf extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      shelf_width: 0,
      shelf_space: 10, // space between books
      book_width: 200,
      shelf_size: 0, // shelf_size = num books that can fit on a shelf
      shelf_arrays: [], // shelf arrays, array of books to be displayed on a shelf
      shelf_groups: [], // array of shelves to be displayed in groups of 2
      num_shelves: 2 // max number of shelves on one page
    };

    this.calculateShelf = this.calculateShelf.bind(this);
    this.books2Shelves = this.books2Shelves.bind(this);
  }

  componentWillMount() {
    this.setState({ shelf_width: this.props.width });
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
    this.setState({ shelf_size: numBooks}, this.books2Shelves);
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
/*
  groupShelves() {
    // make shelves
    let shelfArrs = this.state.shelf_arrays;
    let shelves = []
    let shelfGroups = [];
    let id = 'shelf-';
    for (var j = 0; j < shelfArrs.length; j++)
    {  
      if ((j-1) % this.state.num_shelves === 0) {
        shelfGroups.push(shelves);
        shelves = [];
      }
    }
    this.setState({ shelf_groups: shelfGroups });
  }
*/

  // determine how many shelevs we need and how many books on each shelf
  render() {
    // make shelves
    var shelfArrs = this.state.shelf_arrays;
    var shelves = []
    var id = 'shelf-';
    for (var j = 0; j < shelfArrs.length; j++)
    {  
      shelves.push(<Shelf key={j} id={id+j} shelfPos={j} shelfWidth={this.state.shelf_width} shelfSize={this.state.shelf_size} bookData={shelfArrs[j]} bookWidth={this.state.book_width} space={this.state.shelf_space}/>);
    }

    var shelfGroups = [];
    for (var j = 0; j < json.length; j++) {
      if (j % this.state.num_shelves === 0) {
        shelfGroups.push(shelves.slice(j, j+this.state.num_shelves));
      } 
    }

    const flickityOptions = {
      initialIndex: 2
    }
    return (
      <div id='bookshelf'>
        {shelfGroups[0]}
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
      // jank fix put default value until I figure out whats happening LOL
      heights: [325], // array of book heights on the shelf
      shelf_height: 0, // height of the shelf
      shelf_width: 0, // how wide the shelf is
      size: 0 // number of books that can fit on the shelf
    };

    this.findTallestBook = this.findTallestBook.bind(this);
    this.addHeight = this.addHeight.bind(this);
  }

  componentWillMount() {
    this.setState({ 
      size: this.props.shelfSize,
      heights: [], // reset height
      shelf_width: this.props.shelfWidth
    })
    this.findTallestBook();
  }

  componentWillUpdate() {
    let heights = this.state.heights;
    heights.sort((a, b) => (a - b)*-1);
    if (heights[0] > this.state.shelf_height) {
      this.setState({ shelf_height: heights[0] });
    }
  }

  // update shel size state
  componentWillReceiveProps(nextProps) {
    this.setState({ 
      size: nextProps.shelfSize,
      shelf_width: nextProps.shelfWidth
    });

    // resize heights array
    var temp = this.state.heights;
    this.setState({ size: this.props.bookData.length })
    if (temp.length > this.props.bookData.length) {
      temp = temp.slice(0, this.props.bookData.length);
    }
    this.setState({ heights: temp });
    this.findTallestBook();
  }

  // get height of shelf
  componentDidMount() {
    const height = document.getElementById(this.props.id).clientHeight;
  }

  componentWillUnmount() {
    this.setState({ heights: [] }); // reset height
  }

  addHeight(height, pos) {
    var temp = this.state.heights;
    this.setState({ size: this.props.bookData.length })
    if (temp.length > this.props.bookData.length) {
      temp = temp.slice(0, this.props.bookData.length);
    }
    temp[pos] = height;
    //temp.push(height);
    this.setState({ heights: temp });
  }

  // todo: find tallest image and set shelf to that height
  findTallestBook() {
    var heights = this.state.heights;
    heights.sort((a, b) => (a - b)*-1);
    this.setState({ shelf_height: heights[0] });
    console.log("shelf height: ", heights[0], " ", this.state.shelf_height)
  }
  
  render() {
    console.log("heights: ", this.state.heights)
    // fit as many books on the shelf as possible
    var bookArray = this.props.bookData;  

    // styling to fit the books  
    // top: (this.state.shelf_height + this.props.space)*(this.props.shelfPos)
    var shelfStyle = {
      //top: this.state.shelf_height*this.props.shelfPos,
      height: this.state.shelf_height,
      width: this.state.shelf_width,
      overflow: 'hidden'
    }


    // put books on the same line
    var books = bookArray.map((book, index) => (
      <Book key={index} shelfPos={this.props.shelfPos} shelfSize={this.state.size} shelfWidth={this.state.shelf_width} pos={index} addHeight={this.addHeight} book={book} space={this.props.space} bookWidth={this.props.bookWidth} />
    ))

    return (
      <div className='shelf' id={this.props.id} style={shelfStyle}>
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
      height: 0, // height of book in px
      shelf_width: 0, // the width of the shelf, used for calculating offset
      shelf_size: 0 // the nubmer of books that can fit on the shelf
    };
  }

  // update shelf height
  componentWillReceiveProps(newProps) {
    this.setState({ 
      shelf_width: newProps.shelfWidth,
      shelf_size: newProps.shelfSize 
    });
  }

  render() {
    let totalBookLength = (this.props.space + this.props.bookWidth)*this.state.shelf_size;
    let offset = (this.state.shelf_width - totalBookLength) / 2;

    let bookStyle = {
      left: (this.props.space + this.props.bookWidth)*this.props.pos + offset,
      bottom: 0
    }

    let imgStyle = {
      width: this.props.bookWidth+'px'
    }
    return (
      <div className="book" style={bookStyle}>
        <ReactHeight onHeightReady={val => this.setState({ height: val }, this.props.addHeight(val, this.props.pos))}>
          <img src={this.props.book.img} style={imgStyle} alt="cover img"></img>
        </ReactHeight>
      </div>
    )
  }
}

// Must export!
export default Bookshelf;