
import './App.css';
import React, { Component} from 'react'
import Navbar from './GPDScreens/NavbarGPD';
import NavbarGPD from './GPDScreens/NavbarGPD';
import ManageStudentsGPD from './GPDScreens/ManageStudentsGPD';
import EditStudentGPD from './GPDScreens/EditStudentGPD';
import LoginScreen from './LoginScreens/LoginScreen';
import axios from 'axios'

class App extends Component{
  state = {
    data: null
  };

  componentDidMount = () => {
    this.callBackendAPI();
  }

  callBackendAPI = async () => {
    const response = await axios.get("/api/users");
    this.setState({data: response.data});
    console.log(this.state.data)

    return response;
  }


  render(){
  return this.state.data ? (
    <div className="App">
      <LoginScreen data={this.state.data}/>
    </div>
  ) : (<div>Loading...</div>);
  }
}

export default App;
