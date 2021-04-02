import React, { Component} from 'react'
import {Button, Card, Navbar, Tab, Icon, NavItem, Tabs} from 'react-materialize'
import '../style.css'
import {Link} from 'react-router-dom'
import NavbarGPD from './NavbarGPD';
import {DropzoneArea, DropzoneAreaBase} from 'material-ui-dropzone'

class UploadFileGPD extends Component{
    constructor(props){
        super(props);
        this.state = {};
    }

    render(){
        return(
            <div>
            <NavbarGPD />
            <DropzoneAreaBase></DropzoneAreaBase>
        </div>
        );
    }
}
export default UploadFileGPD