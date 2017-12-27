import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

// virtual bookshelf
class Bookshelf extends Component {
  render() {
    return (
      <p>hi</p>
    )
  }
}

// book to be displayed on our virtual bookshelf
// book has:
// title, author, rating, description, review
// description and review only appear upon clicking on the book tile
// uniform size: ratio = 1.6:1 height:width
class Book extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <h1> { this.props.title } </h1>
        <p>testing</p>
      </div>
    )
  }
}

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>

        <Book title="The Name of the Wind" />
      </div>
    );
  }
}

export default App;
