
import './App.css';
import React, { Component} from 'react'
import {Router, Switch, Route, BrowserRouter} from 'react-router-dom'
import Navbar from './GPDScreens/NavbarGPD';
import NavbarGPD from './GPDScreens/NavbarGPD';
import ManageStudentsGPD from './GPDScreens/ManageStudentsGPD';
import EditStudentGPD from './GPDScreens/EditStudentGPD';
import LoginScreen from './LoginScreens/LoginScreen';
import StudentInfo from './StudentScreens/StudentInfo';
import axios from 'axios'
import UploadFileGPD from './GPDScreens/UploadFileGPD';

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
      <BrowserRouter>
        <Switch>
          <Route exact path="/" component={LoginScreen}>
          </Route>
          <Route exact path="/manage_students_gpd" component={ManageStudentsGPD}>
          </Route>
          <Route exact path="/edit_student_gpd" component={EditStudentGPD}>
          </Route>  
          <Route exact path="/upload_file_gpd" component={UploadFileGPD}>
          </Route>
          <Route exact path="/student_info_stu" component ={StudentInfo}>
          </Route>
        </Switch>
      </BrowserRouter>
    </div>
  ) : (<div>Loading...</div>);
  }
}

export default App;
