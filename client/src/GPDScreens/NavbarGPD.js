import React, { Component} from 'react'
import {Button, Card, Navbar, Tab, Icon, NavItem, Tabs} from 'react-materialize'
import '../style.css'
import {Link, Redirect} from 'react-router-dom'
class NavbarGPD extends Component{
    constructor(props){
        super(props);
        this.state = {
            currentClicked: null
        };
    }

    render(){
        return(
            <Navbar
            alignLinks="right"
            brand={<a className="brand-logo" href="/">MAST</a>}
            className = "blue"
            extendWith={<ul className="tabs tabs-transparent">
                <li class="tab white-text"><a target="_self" href="/manage_students_gpd">Manage Students</a></li>
                <li class="tab white-text"><a target="_self" href="/upload_file_gpd">Upload File</a></li>
                <li class="tab white-text"><a target="_self" href="/manage_students_gpd">View Enrollment Trends</a></li>
                <li class="tab white-text"><a target="_self" href="/manage_students_gpd">Sugggest Course Plan</a></li></ul>}
            options={{edge: 'left', preventScrolling: true}}>
            <NavItem>Profile</NavItem>
            <Link to="/"><NavItem>Logout</NavItem></Link>
            </Navbar>
        )
    }

}

export default NavbarGPD