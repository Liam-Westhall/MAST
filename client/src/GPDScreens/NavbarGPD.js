import React, { Component} from 'react'
import {Navbar, NavItem} from 'react-materialize'
import '../style.css'
import {Link} from 'react-router-dom'

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
                <li className="tab white-text"><a target="_self" href="/manage_students_gpd">Manage Students</a></li>
                <li className="tab white-text"><a target="_self" href="/upload_file_gpd">Upload File</a></li>
                <li className="tab white-text"><a target="_self" href="/enrollment_trends_gpd">View Enrollment Trends</a></li></ul>}
            options={{edge: 'left', preventScrolling: true}}>
            <Link to="/"><NavItem>Logout</NavItem></Link>
            </Navbar>
        )
    }

}

export default NavbarGPD