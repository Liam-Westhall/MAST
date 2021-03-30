import React, { Component} from 'react'
import NavbarGPD from './NavbarGPD'
import {Navbar, Row, Column, Col, TextInput, Button, Table, Modal} from 'react-materialize'
import axios from 'axios'
import EditStudentGPD from './EditStudentGPD'
import { Link, Redirect, useHistory } from 'react-router-dom'
class ManageStudentsGPD extends Component{
    constructor(props){
        super(props)
        this.state = {
            firstName: "",
            lastName: "",
            email: "",
            password: "",
            department: "",
            entrySemester: "",
            track: "",
            students: [],
            query: "",
            editStudent: false,
            currentEditStudent: null,
            refresh: false,
            searchByFirsName: false,
            searchByLastName: false,
            searchByStudentID: false,
            searchByDepartment: false,
            searchByEmail: false,
            searchByTrack: false,
            searchByStudentID_input: "",
            searchByFirstName_input: "",
            searchByLastName_input: "",
            searchByDepartment_input: "",
            searchByEmail_input: "",
            searchByTrack_input: ""
        
        }
    }

    onClickSearchCallback = async () => {

        let values = this.state.query.split(" ")

        if (this.state.query.length == 0) return 

        if(values.length > 2) {
            values = values.filter((item) => item.length > 0)
        }

        if(values.length > 2) return
        

        let path = values.length == 1 ?  "/api/students/search?firstName=" + values[0] : "/api/students/search?firstName=" + values[0] + "&lastName=" + values[1]
        console.log("path is:::", path)
        let res = await axios.get(path)
        
        this.setState({students: res.data})
    }

    onClickAdvanceSearch = async () => {
        
        let path = "/api/students/search?"
        let firstFilter = true

        if (this.state.searchByFirsName) {
            path = path + "firstName=" + this.state.searchByFirstName_input.trim()
            firstFilter = false
        }

        if (this.state.searchByLastName) {
            path =  firstFilter ? (path + "lastName=" + this.state.searchByLastName_input.trim()) : (path + "&lastName=" + this.state.searchByLastName_input.trim())
            firstFilter = false
        }

        if (this.state.searchByDepartment) {
            path =  firstFilter ? (path + "department=" + this.state.searchByDepartment_input.trim()) : (path + "&department=" + this.state.searchByDepartment_input.trim())
            firstFilter = false
        }

        if (this.state.searchByEmail) {
            path =  firstFilter ? (path + "email=" + this.state.searchByEmail_input.trim()) : (path + "&email=" + this.state.searchByEmail_input.trim())
            firstFilter = false
        }

        if (this.state.searchByTrack) {
            path =  firstFilter ? (path + "track=" + this.state.searchByTrack_input.trim()) : (path + "&track=" + this.state.searchByTrack_input.trim())
            firstFilter = false
        }

        if (this.state.searchByStudentID) {
            path =  firstFilter ? (path + "sbuID=" + this.state.searchByStudentID_input.trim()) : (path + "&sbuID=" + this.state.searchByStudentID_input.trim())
            firstFilter = false
        }


        let res = await axios.get(path)
        this.setState({students: res.data})

    }

    onChangeSearchQuery = (event) => {

        this.setState({query: event.target.value})

    }

    onChange = (event) => {
        this.setState({[event.target.id]: event.target.value});
    }

    addStudentCallback = async () => {
        let body = {firstName: this.state.firstName, lastName: this.state.lastName, email: this.state.email, password: this.state.password, department: this.state.department, entrySemester: this.state.entrySemester, track: this.state.track};
        let header = {
            headers: {
              "Content-Type": "application/json",
            },
          };    
        await axios.post("http://localhost:5000/api/add_student/", body, header).catch((error) => console.log(error));
        this.loadStudents()
    }

    deleteStudentCallback = () => {
        let body = []
        axios.post("http://localhost:5000/api/students/delete_all", body).catch((error) => console.log(error));
        this.setState({students: []});
    }

    editStudent = (student) => {
        this.setState({currentEditStudent: student});
        console.log(student);
        this.setState({editStudent: true});
    }

    loadStudents = async () => {
        var students = await axios.get('/api/students')
        console.log(students.data)
        this.setState({students: students.data})
    }

    async componentDidMount() {
        this.loadStudents()
    }

    render(){
        return(
            this.state.editStudent ? <Redirect to={{pathname: "edit_student_gpd", state: {currentEditStudent: this.state.currentEditStudent}}}></Redirect> : 
            <div>
                <NavbarGPD />
                <div className="body">
                <Row>
                    <Col
                    offset="l10"
                    l={3}>
                        <TextInput onChange={this.onChangeSearchQuery}
                        icon="search"
                        label="Search">
                        </TextInput>
                    </Col>
                </Row>
                <Row>
                <Col offset="l10"
                    l={2}
                    >
                        <Button label="Search" onClick={this.onClickSearchCallback}>Search</Button>
                    </Col>
                </Row>
                <Row>
                    <Col
                    offset="l10"
                    l={2}>
                        <Modal
                        actions={[<Button flat modal="close" node="button">Close</Button>]}
                        header="Advance Search"
                        trigger={<Button node="button" waves="light"> Advanced Search </Button>}>
                            <br></br>
                            <label>
                                <input type="checkbox" class="filled-in" checked={this.state.searchByFirsName} onChange={() => this.setState({searchByFirsName: !this.state.searchByFirsName})}/>
                                <span>First-name</span>
                            </label>
                            <TextInput className="white" id="search_firstName_input" onChange={(e) => this.setState({searchByFirstName_input: e.target.value})}></TextInput>

                            <label>
                                <input type="checkbox" class="filled-in" checked={this.state.searchByLastName} onChange={() => this.setState({searchByLastName: !this.state.searchByLastName})}/>
                                <span>Last name</span>
                            </label>
                            <TextInput className="white" id="search_lastName_input" onChange={(e) => this.setState({searchByLastName_input: e.target.value})}></TextInput>

                            <label>
                                <input type="checkbox" class="filled-in" checked={this.state.searchByStudentID} onChange={() => this.setState({searchByStudentID: !this.state.searchByStudentID})}/>
                                <span>Student ID</span>
                            </label>
                            <TextInput className="white" id="search_studentID_input" onChange={(e) => this.setState({searchByStudentID_input: e.target.value})}></TextInput>


                            <label>
                                <input type="checkbox" class="filled-in" checked={this.state.searchByDepartment} onChange={() => this.setState({searchByDepartment: !this.state.searchByDepartment})}/>
                                <span>Department</span>
                            </label>
                            <TextInput className="white" id="search_department_input" onChange={(e) => this.setState({searchByDepartment_input: e.target.value})} ></TextInput>

                            <label>
                                <input type="checkbox" class="filled-in" checked={this.state.searchByEmail} onChange={() => this.setState({searchByEmail: !this.state.searchByEmail})}/>
                                <span>Email</span>
                            </label>
                            <TextInput className="white" id="search_email_input" onChange={(e) => this.setState({searchByEmail_input: e.target.value})}></TextInput>

                            <label>
                                <input type="checkbox" class="filled-in" checked={this.state.searchByTrack} onChange={() => this.setState({searchByTrack: !this.state.searchByTrack})}/>
                                <span>Track</span>
                            </label>
                            <TextInput className="white" id="search_track_input" onChange={(e) => this.setState({searchByTrack_input: e.target.value})}></TextInput>

                            <Button type="search" modal="close" onClick={this.onClickAdvanceSearch}>Submit</Button>
                        </Modal>
                        
                    </Col>
                </Row>
                <Table>
                    <thead>
                        <tr>
                            <th data-field="Name">Name</th>
                            <th data-field="Id">ID</th>
                            <th data-field="Email">Email</th>
                            <th data-field="Department">Department</th>
                            <th data-field="Track">Track</th>
                            <th data-field="Entry Semester">Entry Semester</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.students.map((student) => (
                                <tr onClick={this.editStudent.bind(this, student)}>
                                    <th data-field="Name">{student.User.firstName + " " + student.User.lastName}</th>
                                    <th data-field="Id">{student.sbuID}</th>
                                    <th data-field="Email">{student.User.email}</th>
                                    <th data-field="Department">{student.department}</th>
                                    <th data-field="Track">{student.track}</th>
                                    <th data-field="Entry Semester">{student.entrySemester}</th>
                                </tr>
                            ))
                        }
                    </tbody>
                </Table>
                <br></br>
                <Row>
                    <Col
                    offset="l9"
                    size={1}>
                        <Modal
                        actions={[<Button flat modal="close" node="button">Close</Button>]}
                        header="Add Student"
                        trigger={<Button>Add Student</Button>}>
                            <br></br>
                            <span>First Name:</span>
                            <TextInput className="white" id="firstName" onChange={this.onChange}></TextInput>
                            <span>Last Name:</span>
                            <TextInput className="white" id="lastName" onChange={this.onChange}></TextInput>
                            <span>Email:</span>
                            <TextInput className="white" id="email" onChange={this.onChange}></TextInput>
                            <span>Password:</span>
                            <TextInput className="white" id="password" onChange={this.onChange}></TextInput>
                            <span>Department:</span>
                            <TextInput className="white" id="department" onChange={this.onChange}></TextInput>
                            <span>Entry Semester:</span>
                            <TextInput className="white" id="entrySemester" onChange={this.onChange}></TextInput>
                            <span>Track:</span>
                            <TextInput className="white" id="track" onChange={this.onChange}></TextInput>
                            <Button type="submit" modal="close" onClick={this.addStudentCallback}>Submit</Button>
                        </Modal>
                    </Col>
                    <Col
                    size={1}>
                        <Button onClick={this.deleteStudentCallback}>Delete All</Button>
                    </Col>
                </Row>
                </div>
            </div>
            
        );
    }
}

export default ManageStudentsGPD