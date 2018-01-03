import React, { Component } from 'react';
import './App.css';

// bookshelf
import Bookshelf from './Bookshelf.jsx'

class Carousel extends Component {
	constructor(props) {
		// props include: content, which needs to be iterable
		super(props);
	}

	render() {
		return (
		  <div id="carousel">
		  	<Arrow direction='left' />
		    {this.props.content}
		    <Arrow direction='right' />
		  </div>    
		)
	}
}

// carousel arrows
class Arrow extends Component {
  // props will include direction of the arrow
  constructor(props) {
    super(props);
  }

  render() {
    let arrowIcon = "far fa-caret-square-" + this.props.direction;
    return (
      <div className="backArrow">
        <i className={arrowIcon}></i>
      </div>
    );
  }
}

export default Carousel;
