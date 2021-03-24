import axios from 'axios';
import React, {Component} from 'react'
import { Button, Card, Navbar, TextInput } from 'react-materialize'
import { Redirect } from 'react-router';
import ManageStudentsGPD from '../GPDScreens/ManageStudentsGPD';

class LoginScreen extends Component{
    constructor(props){
        super(props);
        this.state = {user_data: this.props.data, email: "", password: "", isLogin: false, loginError: false};
    }

    handleChangeEmail = (event) => {
        this.setState({email: event.target.value});
    }
    handleChangePassword = (event) => {
        this.setState({password: event.target.value});
    }
    loginCallback = () =>{
        let body = {email: this.state.email, password: this.state.password};
        let header = {
            headers: {
              "Content-Type": "application/json",
            },
          };
            
        const res = axios.post("http://localhost:5000/api/auth/", body, header).then(this.setState({isLogin: true, loginError: false})).catch((error) => this.setState({loginError: true}));
    }
    render(){
        return(
            <div align="left">
                {this.state.isLogin ? <Redirect push to="/manage_students_gpd"></Redirect> : 
                <div>
                <Navbar className="blue" brand={<a className="brand-logo" href="/">MAST</a>}>   
                </Navbar>
                <br></br>
                <Card className="blue-grey">
                    <span class="white-text"><b>Username:</b></span>
                    <TextInput class="white" onChange={this.handleChangeEmail} value={this.state.email}></TextInput>
                    <span class="white-text"><b>Password:</b></span>                    
                    <TextInput class="white" onChange={this.handleChangePassword} value={this.state.password} password></TextInput>
                    <Button onClick={this.loginCallback}>Login</Button>
                </Card>
                <br></br>
                <div>
                {this.state.loginError ? 
                (<Card className="red">
                    <span class="black-text">Invalid Credentials.</span>
                </Card>) : <br></br>}
                </div></div>}
            </div>
        );
    }
}

export default LoginScreen;