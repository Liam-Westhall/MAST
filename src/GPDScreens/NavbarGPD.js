import React, { Component} from 'react'
import {Button, Card, Navbar, Tab, Icon, NavItem, Tabs} from 'react-materialize'
import '../style.css'
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
            extendWith={<Tabs className="tabs-transparent"><Tab className="white-text" options={{duration: 300, onShow: null, responsiveThreshold: Infinity, swipeable: false}} title="manage students"></Tab><Tab className="white-text" options={{duration: 300, onShow: null, responsiveThreshold: Infinity, swipeable: false}} title="import data"></Tab><Tab className="white-text" options={{duration: 300, onShow: null, responsiveThreshold: Infinity, swipeable: false}} title="view enrollment trends"></Tab><Tab className="white-text" options={{duration: 300, onShow: null, responsiveThreshold: Infinity, swipeable: false}} title="suggest course plan"></Tab></Tabs>}
            options={{edge: 'left', preventScrolling: true}}>
            <NavItem>Profile</NavItem>
            <NavItem>Logout</NavItem>
            </Navbar>
        )
    }

}

export default NavbarGPD