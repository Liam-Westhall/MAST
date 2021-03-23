import React, { Component} from 'react'
import NavbarGPD from './NavbarGPD'
import {Navbar, Row, Column, Col, TextInput, Button, Table} from 'react-materialize'
class ManageStudentsGPD extends Component{
    constructor(props){
        super(props)
        this.state = {
        }
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
                        <TextInput
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
                        <tr>
                            <td>
                                John Doe
                            </td>
                            <td>123456789</td>
                            <td>johndoe@email.com</td>
                            <td>Computer Science</td>
                            <td>Security</td>
                            <td>2021</td>
                        </tr>
                    </tbody>
                </Table>
                <br></br>
                <Row>
                    <Col
                    offset="l9"
                    size={1}>
                        <Button>Add Student</Button>
                    </Col>
                    <Col
                    size={1}>
                        <Button>Edit Info</Button>
                    </Col>
                    <Col
                    size={1}>
                        <Button>Delete</Button>
                    </Col>
                </Row>
                </div>
            </div>
            
        )
    }
}

export default ManageStudentsGPD