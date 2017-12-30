import React, { Component } from 'react';
import './App.css';

// bookshelf
import Bookshelf from './Bookshelf.jsx'
 
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
    let width = window.innerWidth; // jank: initialize to window width
    super(props);
    this.state = { 
      window_width: '0', 
      window_height: '0', 
      nav_height: '0',
      content_width: width
    };
    this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
    this.getNavHeight = this.getNavHeight.bind(this);
  }

  componentWillMount() {
    this.setState({ 
      window_width: window.innerWidth, 
      window_height: window.innerHeight
    });
    console.log('app will mount', this.state.content_width)
  }

  componentDidMount() {
    this.updateWindowDimensions();
    window.addEventListener('resize', this.updateWindowDimensions);
    console.log('app did mount', this.state.content_width)
  }

  componentDidUpdate() {
    let width = document.getElementById('content').clientWidth;
    if (this.state.content_width !== width) {
      this.setState({ content_width: width });
    }
    console.log('app did update', this.state.content_width)
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateWindowDimensions);
  }

  updateWindowDimensions() {
    let width = document.getElementById('content').clientWidth;
    this.setState({ 
      window_width: window.innerWidth, 
      window_height: window.innerHeight,
      content_width: width 
    });
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
    console.log("window width: ", this.state.content_width)
    return (
      <div>
        <SmartNav sendNavHeight={this.getNavHeight}/>

        {/* div containing everything except for navbar */}
        <div id="content" style={{marginTop: navMargin}}>
          <Bookshelf width={this.state.content_width}/>
        </div>
      </div>
    );
  }
}

export default App;
