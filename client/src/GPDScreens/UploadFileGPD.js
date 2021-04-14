import React, { Component} from 'react'
import {Button, Card, Navbar, Tab, Icon, NavItem, Tabs} from 'react-materialize'
import '../style.css'
import {Link} from 'react-router-dom'
import NavbarGPD from './NavbarGPD';
import {DropzoneArea, DropzoneAreaBase} from 'material-ui-dropzone'
import axios from 'axios'
import formData from 'form-data'

class UploadFileGPD extends Component{
    constructor(props){
        super(props);
        this.state = {
            files: [],
            upload_type: ''
        };
    }

    onSubmitCourseOfferings = async () => {

        if (this.state.files.length < 1) return 
        const body = new formData()
        body.append('file', this.state.files[0])

        console.log(body)
        await axios.post("/api/uploadfiles/course", body).catch((error) => console.log(error));
    }

    onSubmitDegreeRequirements = async () => {
        if(this.state.files.length < 1) return
        const body = new formData()
        body.append('file', this.state.files[0])
        
        console.log(body)
        await axios.post("/api/uploadfiles/degree_req", body).catch((error) => console.log(error));
    }

    onSubmitStudentData = async () => {
        if (this.state.files.length < 1) return 
        const body = new formData()
        body.append('studentProfile', this.state.files[0])

        console.log(body)
        await axios.post("/api/uploadfiles/student_data", body).catch((error) => console.log(error));
    }
    
    onSubmit = () => {
        switch (this.state.upload_type) {
            case 'CouseOfferings':
                this.onSubmitCourseOfferings()
                break;
            case 'DegreeRequirements':
                this.onSubmitDegreeRequirements()
                break;
            case 'StudentData':
                this.onSubmitStudentData()
            default:
                break;
        }
    }

    render(){
        return(
            <div>
                <NavbarGPD />
                <div class="input-field col s12">
                    <select className="browser-default" onChange={(e) => this.setState({upload_type: e.target.value})}>
                        <option value="" disabled selected>Choose your option</option>
                        <option value="CouseOfferings">Couse Offerings</option>
                        <option value="DegreeRequirements">Degree Requirements</option>
                        <option value="StudentData">Student Data</option>
                    </select>
                
                </div>
            <DropzoneAreaBase
            onDrop={(files) => {this.setState({files: files})}}
            ></DropzoneAreaBase>
            <br></br>
            <Button onClick={() => this.onSubmit()} >Submit File</Button>
        </div>
        );
    }
}
export default UploadFileGPD