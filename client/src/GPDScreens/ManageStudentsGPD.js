import React, { Component} from 'react'
import NavbarGPD from './NavbarGPD'
import {Navbar, Row, Column, Col, TextInput, Button, Table, Modal} from 'react-materialize'
import axios from 'axios'
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
            query: ""
            
        }
    }

    onClickSearchCallback = () => {

    }

    onChangeSearch = (event) => {

        this.setState({query: event.target.value})

    }

    onChange = (event) => {
        this.setState({[event.target.id]: event.target.value});
    }

    addStudentCallback = () => {
        let body = {firstName: this.state.firstName, lastName: this.state.lastName, email: this.state.email, password: this.state.password, department: this.state.department, entrySemester: this.state.entrySemester, track: this.state.track};
        let header = {
            headers: {
              "Content-Type": "application/json",
            },
          };    
        axios.post("http://localhost:5000/api/add_student/", body, header).catch((error) => console.log(error));
        this.forceUpdate();
    }

    deleteStudentCallback = () => {
        let body = []
        let header = {
            headers: {
              "Content-Type": "application/json",
            },
          }; 
        axios.post("https://localhost:5000/api/students/delete_all", body, header);
        this.setState({students: []});
    }

    async componentDidMount() {
        var students = await axios.get('/api/students')
        console.log(students.data)
        this.setState({students: students.data})
    }

    render(){
        return(
            <div>
                <NavbarGPD />
                <div className="body">
                <Row>
                    <Col
                    offset="l10"
                    l={3}>
                        <TextInput onChange={this.onChangeSearch}
                        icon="search"
                        label="Search">
                        </TextInput>
                    </Col>
                </Row>
                <Row>
                    <Col
                    offset="l10"
                    l={2}>
                        <Button node="button" waves="light">
                            Advanced Search
                        </Button>
                    </Col>
                </Row>
                <Table>
                    <thead>
                        <tr>
                            <th data-field="Name">Name                                
                            </th>
                            <th data-field="Id">ID</th>
                            <th data-field="Email">Email</th>
                            <th data-field="Department">Department</th>
                            <th data-field="Track">Track</th>
                            <th data-field="Entry Semester">Entry Semester</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.students.map((student) => (
                                <tr>
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
                            <TextInput className="white" id="track" onChange={this.handleChange}></TextInput>
                            <Button type="submit" onClick={this.addStudentCallback}>Submit</Button>
                        </Modal>
                    </Col>
                    <Col
                    size={1}>
                        <Button>Edit Info</Button>
                    </Col>
                    <Col
                    size={1}>
                        <Button onClick={this.deleteStudentCallback}>Delete All</Button>
                    </Col>
                </Row>
                </div>
            </div>
            
        )
    }
}

export default ManageStudentsGPD