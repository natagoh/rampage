import React, { Component } from 'react';
import './App.css';

var Alert = require('react-bootstrap/lib/Alert');

// virtual bookshelf
class Bookshelf extends Component {
  render() {
    return (
      <p>hi</p>
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
      <div class="Book-tile">
        <p> { this.props.title } </p>
        <p>testing</p>
      </div>
    )
  }
}

class App extends Component {
  
  render() {
    return (
      <div>

        <Book title="The Name of the Wind" />

      </div>
    );
  }
}

export default App;
