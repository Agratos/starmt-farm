import React, { Component } from 'react';
import '../Css//MenuBar.css';
import  { connect } from 'react-redux';

class MenuBar extends Component{
  render(){
    return (
      <div className="MenuBar">
        <p> {this.props.email} 환영합니다!
          <button id="first"><a href="/auth/logout">로그아웃</a></button>
        </p>
        <button><a href="chart">그래프</a></button>
        <button><a href="/auth/key">키 확인</a></button>
        <button><a href="/channelkeyView">채널 키 확인</a></button>
        <button><a href="/community">커뮤니티</a></button>
        <button><a href="/softro">아두이노</a></button>
        <button><a href="/teachablem">티처블</a></button>
        <button><a href="/rtsp">카메라</a></button>
      </div>
    );
  }
}

let mapStateToProps = (state) => {
  return {
    email: state.userstate.email
  }
}

Manubar = connect(mapStateToProps)(Manubar);


export default MenuBar;