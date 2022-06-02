import React, { Component } from 'react';
import Menubar from './Menubar';

class Main extends Component{
    render(){
      return (
        <div className="Main">
          <div className="ManeBar">
            <Menubar ></Menubar>
          </div>
        </div>
      );
    }
}

export default Main;