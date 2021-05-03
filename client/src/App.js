
import './App.css';
import React, { Component} from 'react'
import {Switch, Route, BrowserRouter} from 'react-router-dom'
import ManageStudentsGPD from './GPDScreens/ManageStudentsGPD';
import EditStudentGPD from './GPDScreens/EditStudentGPD';
import LoginScreen from './LoginScreens/LoginScreen';
import EnrollmentTrendsGPD from './GPDScreens/EnrollmentTrendsGPD';
import StudentInfo from './StudentScreens/StudentInfo';
import axios from 'axios'
import UploadFileGPD from './GPDScreens/UploadFileGPD';
import SuggestCoursePlanGPD from './GPDScreens/SuggestCoursePlanGPD';
import CoursePlanScreen from './StudentScreens/CoursePlanScreen';

class App extends Component{
  state = {
    data: null
  };

  componentDidMount = () => {
    this.callBackendAPI();
  }

  callBackendAPI = async () => {
    const response = await axios.get("/api/users").catch((err) => console.log('caught', err));
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
          <Route exact path="/enrollment_trends_gpd" component={EnrollmentTrendsGPD}>
          </Route>
          <Route exact path = "/suggest_course_plan_gpd" component={SuggestCoursePlanGPD}>
          </Route>
          <Route exact path = "/suggest_course_plan_stu" component={CoursePlanScreen}>
          </Route>
        </Switch>
      </BrowserRouter>
    </div>
  ) : (<div>Loading...</div>);
  }
}

export default App;
