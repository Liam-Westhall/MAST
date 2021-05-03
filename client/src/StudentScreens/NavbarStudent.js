import React, { Component} from 'react'
import { Navbar, NavItem} from 'react-materialize'
import '../style.css'
import {Link} from 'react-router-dom'
class NavbarStudent extends Component{
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
                <li class="tab white-text"><a target="_self" href="/student_info_stu">My Info</a></li>
                </ul>}
            options={{edge: 'left', preventScrolling: true}}>
            <Link to="/"><NavItem>Logout</NavItem></Link>
            </Navbar>
        )
    }

}

export default NavbarStudent