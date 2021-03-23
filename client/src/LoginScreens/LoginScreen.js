import React, {Component} from 'react'
import { Button, Card, Navbar, TextInput } from 'react-materialize'

class LoginScreen extends Component{
    constructor(props){
        super(props);
        this.state = {};
    }

    render(){
        return(
            <div align="left">
                <Navbar className="blue" brand={<a className="brand-logo" href="/">MAST</a>}>   
                </Navbar>
                <br></br>
                <Card className="blue-grey">
                    <span class="white-text"><b>Username:</b></span>
                    <TextInput class="white"></TextInput>
                    <span class="white-text"><b>Password:</b></span>                    
                    <TextInput class="white"></TextInput>
                    <Button>Login</Button>
                </Card>
            </div>
        );
    }
}

export default LoginScreen;