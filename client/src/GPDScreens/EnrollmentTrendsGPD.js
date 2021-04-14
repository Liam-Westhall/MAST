import React, { Component} from 'react'
import NavbarGPD from './NavbarGPD'
import {VictoryChart, VictoryGroup, VictoryLabel, VictoryAxis, VictoryLine, VictoryLegend} from 'victory';
import axios from 'axios'
import Select from 'react-select'
import formData from 'form-data'


class EnrollmentTrendsGPD extends Component{
    constructor(props){
        super(props)
        this.state = {
            //selectedDepartment: "CSE",
            selectedDepartment: "",
            selectedCourses: [],
            selectedSemesters: [],

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

            startSem: "",
            endSem: "",

            courseOptions: [],
            selectedSemData: [],
            selectedCourseData: [],

            courseData: [],

            tempCourseHolder: [],

            graphData: [],

            graphLegend: []

        }
    }

    onChangeSemester = (event) => {
        //Update semesters picked
        var tempSem = []
        event.forEach(function(semes) {
            tempSem.push(semes.label)
        });
        this.setState({ selectedSemesters: event, selectedSemData: tempSem}, () => 
            {this.loadOptions()}); 
    }

    onChangeDepartment = (event) => {
        //Update department and reload course options
        this.setState({ selectedDepartment: event.value}, () => 
            {this.loadOptions()}); 
    }

    onChangeCourses = (event) => {
        //Update selected courses
        console.log(event)
        var tempCNs = []
        event.forEach(function(semes) {
            let str = semes.label
            str = str.substring(str.length - 3)

            tempCNs.push(parseInt(str));
        });
        console.log(event)

        this.setState({ selectedCourses: event, tempCourseHolder : tempCNs}, () => 
            {this.loadOptions()}); 
    }


    loadOptions = async () => {
        //Loads the courses from the database based off of the current state options
        //console.log('we loaded/reloaded')
        let dept = this.state.selectedDepartment;
        //Update course list 
        if (this.state.selectedDepartment.length === 0 || this.state.selectedSemesters.length === 0) {
            //Dep or sem has not been chosen, Do Nothing
        } else {
            //Get data from database
            const body = new formData()
            body.append('department', this.state.selectedDepartment)
            body.append('courselist', this.state.selectedCourseData)
            body.append('semesters', this.state.selectedSemData)

            var courses = await axios.post('/api/courses/courselist', body);
            let x = Array.from(courses.data);
            const dataToAdd = x;

            dept = this.state.selectedDepartment;

            //Array that contains the course numbers for all courses that satisfy sem/dept options
            let strArray = []
            var i;
            for (i = 0; i < x.length; i++) {
                let num = x[i].courseNumber
                strArray.push(num)
            }

            //No need for duplicates in select options
            let tempOptionsArray = []
            var alreadySeen = [];
            strArray.forEach(function(str) {
                if (alreadySeen[str]) {
                } else {
                    alreadySeen[str] = true;
                    tempOptionsArray.push({ label: (dept + ' ' + str ), value: 1 })
                    }
            });

            console.log(tempOptionsArray, 'temparray')
            this.setState({courseOptions : tempOptionsArray, courseData : dataToAdd})
        }


        if (this.state.selectedCourses.length === 0) {
            //No courses are selected, Do Nothing
        } else {
            //Numerical values representing the selected courses [num, num, ...]
            let temp = this.state.tempCourseHolder; 
            
            //Data for all courses that satisfy degree and semester options{[courseNum, sem, totaltudents][...]...}
            let allcrsinfo = this.state.courseData;    

            let master = []
            let tempLegend = []
            temp.forEach(function(courseNum) {  //For each selected course
                let tempGraphData = [];
                allcrsinfo.forEach(function(crs) {  //For each course in masterlist that satisfies sem and degree
                    //console.log("doubly inside loop")
                    if (crs.courseNumber === courseNum) {
                        let strtemp = crs.semester;

                        //sem to int conversion
                        let val = 0;
                        let fs = strtemp.substring(0, 1);
                        let yr = strtemp.substring(strtemp.length - 2);
                        val = parseInt(yr) * 10;

                        if (fs === 'F') {
                            val += 1
                        } 

                        let tempnum = crs.totalStudents;
                        tempGraphData.push({ x: val, y: tempnum})
                    }
                });
                console.log(tempGraphData, 'tempgraphdata')
                //let tempdept = this.state.department;
                tempLegend.push({ name: (dept + ' ' + courseNum )})

                master.push(tempGraphData)
            });
            console.log(master)

            this.setState({graphData: master, graphLegend : tempLegend})
        }
    }

    async componentDidMount() {
        this.loadOptions()
    }

    render(){
        //let bars = this.state.graphData;
        const items = this.state.graphData.map(e => <VictoryLine data={e}/>);
        //const legendItems = this.state.graphData.map(e => <VictoryLine data={e}/>);
        return(
            <div>
                <NavbarGPD />
                <div class = "row"></div>
                <div class = "row">
                    <Select
                        //defaultValue={this.state.semesterOptions[this.state.semesterOptions.length]}
                        isMulti
                        placeholder="Select Semester(s)"
                        options={this.state.semesterOptions}
                        className="col s4"
                        onChange={e => this.onChangeSemester(e)}
                    />
                    <Select
                        //defaultValue={this.state.departmentOptions[0]}
                        isMulti={false}
                        placeholder="Select a Department"
                        options={this.state.departmentOptions}
                        className="col s4"
                        onChange={e => this.onChangeDepartment(e)}
                    />
                    <Select
                        isMulti
                        placeholder="Select Courses..."
                        isDisabled={this.state.selectedDepartment.length === 0 || this.state.selectedSemesters.length === 0}
                        options={this.state.courseOptions}
                        className="col s4"
                        onChange={e => this.onChangeCourses(e)}
                    />
                </div>
                <div class = "row">
                </div>
                <VictoryChart>
                    <VictoryLabel text="Enrollment Trends" x={225} y={20} textAnchor="middle"/>
                    <VictoryAxis domain={[0, 20]} dependentAxis label="# of Students"/>
                    <VictoryAxis  
                    />
                    <VictoryLegend x={325} y={20}
                        title="Legend"
                        centerTitle
                        orientation="horizontal"
                        gutter={20}
                        style={{ border: { stroke: "black" }, title: {fontSize: 20 } }}
                        data={this.state.graphLegend}
                    />
                    <VictoryGroup offset={20}
                        colorScale={"qualitative"}
                    >
                        {items}
                    </VictoryGroup>
                </VictoryChart>
            </div>
        );
    }
}

export default EnrollmentTrendsGPD