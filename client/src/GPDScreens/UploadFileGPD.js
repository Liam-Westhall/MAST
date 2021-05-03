import React, { Component, Fragment} from 'react'
import {Button} from 'react-materialize'
import '../style.css'
import NavbarGPD from './NavbarGPD';
import {DropzoneAreaBase} from 'material-ui-dropzone'
import axios from 'axios'
import formData from 'form-data'
import Select from 'react-select'

class UploadFileGPD extends Component{
    constructor(props){
        super(props);
        this.state = {
            files: [],
            studentCoursePlan: [],
            upload_type: '',

            departmentOptions: [
                { label: 'CSE', value: 'CSE' },
                { label: 'AMS', value: 'AMS' },
                { label: 'CE', value: 'CE' },
                { label: 'BMI', value: 'BMI' },
            ],

            semesterOptions: [ 
                //the value is the (year * 10) + (1 if Fall) (0 if spring)
                //only works for years 2000+, the higher the val the more recent the sem
                { label: 'F15', value: 151 },
                { label: 'S16', value: 160 },
                { label: 'F16', value: 161 },
                { label: 'S17', value: 170 },
                { label: 'F17', value: 171 },
                { label: 'S18', value: 180 },
                { label: 'F18', value: 181 },
                { label: 'S19', value: 190 },
                { label: 'F19', value: 191 },
                { label: 'S20', value: 200 },
                { label: 'F20', value: 201 },
                { label: 'S21', value: 211 }
            ],

            selectedSemester: "",
            selectedDepartment: "",
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
        console.log(this.state.files[0])
        await axios.post("/api/uploadfiles/degree_req", body).catch((error) => console.log(error));
    }

    onSubmitCourseInformation = async () => {
        if (this.state.files.length < 1) return 
        const body = new formData()
        body.append('file', this.state.files[0])   
        body.append('sem', this.state.selectedSemester)   
        body.append('dept', this.state.selectedDepartment)   
                  
        await axios.post("/api/uploadfiles/course_info", body).catch((error) => console.log(error));
    }

    onSubmitStudentData = async () => {
        if (this.state.files.length < 1 || this.state.studentCoursePlan.length < 1) return 
        const body = new formData()
        body.append('studentProfile', this.state.files[0])
        // body.append("studentCoursePlan", this.state.studentCoursePlan[0])

        console.log(body)
        await axios.post("/api/uploadfiles/student_data", body).catch((error) => console.log(error));

        const course_data_body = new formData()
        course_data_body.append("studentCoursePlan", this.state.studentCoursePlan[0])
        await axios.post("/api/uploadfiles/student_course_data", course_data_body).catch((error) => console.log(error));
    }
    
    onSubmitStudentGrades = async () => {
        if(this.state.files.length < 1) return
        const body = new formData()
        body.append('gradesObj', this.state.files[0])

        console.log(body)
        await axios.post("/api/uploadfiles/student_grades", body).catch((error) => console.log(error));
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
                break;
            case 'CourseInformation':
                this.onSubmitCourseInformation() 
                break;
            case 'StudentGrades':
                this.onSubmitStudentGrades()
                break;
            default:
                break;
        }
    }

    render(){
        return(
            <div>
                <NavbarGPD />
                <div className="input-field col s4">
                    <select className="browser-default" defaultValue="" onChange={(e) => this.setState({upload_type: e.target.value})}>
                        <option value="" disabled >Choose your option</option>
                        <option value="CouseOfferings">Couse Offerings</option>
                        <option value="DegreeRequirements">Degree Requirements</option>
                        <option value="StudentData">Student Data</option>
                        <option value="CourseInformation">Course Information</option>
                        <option value="StudentGrades">Student Grades</option>
                    </select>
                </div>

            {this.state.upload_type === "StudentData" ? 
            
            <Fragment> 
                 <h1>Student Data: </h1>
                <DropzoneAreaBase
                onDrop={(files) => {this.setState({files: files})}}
                maxFileSize={7000000}            
            > </DropzoneAreaBase>
                <h1>Course Data: </h1>
                <DropzoneAreaBase
                onDrop={(files) => {this.setState({studentCoursePlan: files})}}
                maxFileSize={7000000}            
            > </DropzoneAreaBase>
            </Fragment> : 
            
            <DropzoneAreaBase
                onDrop={(files) => {this.setState({files: files})}}
                maxFileSize={7000000}            
            ></DropzoneAreaBase>}
            <br></br>
            <Button onClick={() => this.onSubmit()} 
            disabled={this.state.upload_type === "CourseInformation" && (this.state.selectedDepartment.length === 0 || this.state.selectedSemester.length === 0)} >Submit File</Button>
            <div className = "row"></div>
            <div className = "row">
                    <Select
                        isDisabled={this.state.upload_type !== "CourseInformation"}
                        placeholder="Select a Semester/Year"
                        options={this.state.semesterOptions}
                        className="col s6"
                        onChange={e => this.setState({selectedSemester: e.value})}
                    />
                    <Select
                        isDisabled={this.state.upload_type !== 'CourseInformation'}
                        placeholder="Select a Department"
                        options={this.state.departmentOptions}
                        className="col s6"
                        onChange={e => this.setState({selectedDepartment: e.value})}
                    />
                </div>
                </div>
        );
    }
}
export default UploadFileGPD