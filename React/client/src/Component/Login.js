import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import '../Css//Login.css';
import { connect } from 'react-redux';
import { email } from '../Action/UserAction';



class Login extends Component{
    constructor(props){
        super(props);
        this.state = {
            email:'',
            key:'',
            channel:''
        };
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(e){
        e.preventDefault();
        fetch('http://127.0.0.1/auth/login', {
            method: 'POST',
            mode: 'cors',
            body: JSON.stringify({email:e.target.email.value, password:e.target.password.value}),
            headers: {"Content-Type": "application/json"}
       }).then(function(response) {
            return response.json();           
       }).then(function(json) {
            if(json.message != null)
            {
                return ;
            } else {
                this.setState({
                    email:json.email,
                    key:json.key,
                    channel:json.channel
                })

                this.props.email;

                this.props.history.push('/main');
            }           
       }.bind(this)).catch(function(error) {
            console.log("err : ", error);
       });
    }

    render(){
      return (
        <div className="container">
            <div className="profile-wrap">
                <div className="profile">
                    <form id="login-form" onSubmit={this.handleSubmit}>                    
                        <div className="input-group">
                            <label htmlFor="email">이메일</label>
                            <input type="text" name="email" required autoFocus/>
                        </div>
                        <div className="input-group">
                            <label htmlFor="password">비밀번호</label>
                            <input type="password" name="password" required autoFocus/>
                        </div><a className="btn" id="join" href="/join">회원가입</a>
                        <button className="btn" id="login" type="submit">로그인</button>
                    </form>
                </div>
                <div>{this.state.email ? this.state.email +"계정으로 로그인에 성공하였습니다.":""}</div>
                <div>{this.state.message ? this.state.message :""}</div>
            </div>
        </div>
      );
    }
}

let mapDispatchToProps = (dispatch) => {
    return {
        email: () => dispatch(email())
    }
}

Login = connect(undefined, mapDispatchToProps)(Login);

export default withRouter(Login);