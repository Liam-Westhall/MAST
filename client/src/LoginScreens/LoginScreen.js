import axios from 'axios';
import React, {Component} from 'react'
import { Button, Card, Navbar, TextInput } from 'react-materialize'
import { Redirect } from 'react-router';
import jwt_decode from "jwt-decode";

class LoginScreen extends Component{
    constructor(props){
        super(props);
        this.state = {user_data: this.props.data, email: "", password: "", isLogin: false, loginError: false, redirectStudent: false, redirectURL: "/manage_students_gpd", response: null, second_render: false}
    }

    handleChangeEmail = (event) => {
        this.setState({email: event.target.value});
    }
    handleChangePassword = (event) => {
        this.setState({password: event.target.value});
    }
    loginCallback = async () =>{
        let body = {email: this.state.email, password: this.state.password};
        let header = {
            headers: {
              "Content-Type": "application/json",
            },
          };  
        await axios.post("/api/auth/", body, header).then((res) =>  {
            if(res.data.hasOwnProperty("token")){
                const payload = jwt_decode(res.data.token);
                if(payload.isStudent === true){
                    this.state.redirectStudent = true;
                    this.setState({isLogin: true, loginError: false, redirectURL:"/student_info_stu", email: this.state.email})
                    console.log(this.state.redirectURL)
                }
                else{
                    this.setState({isLogin: true, loginError: false})
                }
            }
            else{
                this.setState({loginError: true})
            }}).catch((error) => this.setState({loginError: true}));
    }
    render(){
        return(
            <div align="left">
                {this.state.isLogin ? <Redirect push to={{pathname: this.state.redirectURL, state: {email: this.state.email}}}></Redirect> : 
                <div>
                <Navbar className="blue" brand={<a className="brand-logo" href="/">MAST</a>}>   
                </Navbar>
                <br></br>
                <Card className="blue-grey">
                    <span className="white-text"><b>Username:</b></span>
                    <TextInput className="white" onChange={this.handleChangeEmail} value={this.state.email}></TextInput>
                    <span className="white-text"><b>Password:</b></span>                    
                    <TextInput className="white" onChange={this.handleChangePassword} value={this.state.password} password></TextInput>
                    <Button onClick={this.loginCallback}>Login</Button>
                </Card>
                <br></br>
                <div>
                {this.state.loginError ? 
                (<Card className="red">
                    <span className="black-text">Invalid Credentials.</span>
                </Card>) : <br></br>}
                </div></div>}
            </div>
        );
    }
}

export default LoginScreen;