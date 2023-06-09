import React from "react";
import './appointments.css';
import {BiEditAlt } from "react-icons/bi";
import { useState,useEffect } from "react";


function Appointments(){
    const [timeSlot,settimeSlot]=useState([])


    const generateTimeSlots = () => {
    const slots = [];
    const startTime = new Date().setHours(0, 0, 0, 0); // Set start time to 12AM
    const endTime = new Date().setHours(23, 59, 59, 999); // Set end time to 11:59PM

    let currentTime = startTime;
    while (currentTime <= endTime) {
        const timeSlot = new Date(currentTime).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        });
        slots.push(timeSlot);
        currentTime += 10 * 60 * 1000; // Add 10 minutes to the current time
    }

    return slots;
    };

    useEffect(()=>{
        var timeSlots = generateTimeSlots();
        settimeSlot(timeSlots)
        
       
    },[])
function scrollToCenter(){

  const container = document.getElementById('timer'); // Replace 'myDiv' with the actual ID of your <div>
if (container) {
  const scrollWidth = container.scrollWidth;
  const clientWidth = container.clientWidth;
  const scrollLeft = (scrollWidth - clientWidth) / 2;
  container.scrollLeft = scrollLeft;}
};





    const [currentdates,setcurrentdates]=useState([])
    const [displayeddates,setdisplayeddates]=useState([])
    const [selected,setselected]=useState({date:'',month:'',year:''})

      const months = [
        { name: "January", days: 31 },
        { name: "February", days: 28 },
        { name: "March", days: 31 },
        { name: "April", days: 30 },
        { name: "May", days: 31 },
        { name: "June", days: 30 },
        { name: "July", days: 31 },
        { name: "August", days: 31 },
        { name: "September", days: 30 },
        { name: "October", days: 31 },
        { name: "November", days: 30 },
        { name: "December", days: 31 }
      ];

function setdatesvalue(){
    // Get today's date
    const today = new Date();
    const threeDaysAfter =new Date(today);
    const twoDaysAfter=new Date(today);
    const oneDayAfter=new Date(today);
    const threeDaysBefore=new Date(today);
    const twoDaysBefore=new Date(today);
    const oneDayBefore = new Date(today);

    threeDaysAfter.setDate(today.getDate() + 3);
    twoDaysAfter.setDate(today.getDate() + 2);
    oneDayAfter.setDate(today.getDate() + 1);
    threeDaysBefore.setDate(today.getDate() - 3);
    twoDaysBefore.setDate(today.getDate() - 2);
    oneDayBefore.setDate(today.getDate() - 1);

    // Get the day information for each date
    const options = { weekday: 'long' };

    setcurrentdates([
        {date:threeDaysBefore.getDate()+' '+months[threeDaysAfter.getMonth()].name   ,day:threeDaysBefore.toLocaleDateString('en-US', options)},
        {date:twoDaysBefore.getDate()+' '+months[twoDaysBefore.getMonth()].name     ,day:twoDaysBefore.toLocaleDateString('en-US', options)},
        {date:oneDayBefore.getDate()+' '+months[oneDayBefore.getMonth()].name        ,day:oneDayBefore.toLocaleDateString('en-US', options)},
        {date:today.getDate()+' '+ months[today.getMonth()].name                     ,day:today.toLocaleDateString('en-US', options)},
        {date:oneDayAfter.getDate()+' '+months[oneDayAfter.getMonth()].name         ,day:oneDayAfter.toLocaleDateString('en-US', options)},
        {date:twoDaysAfter.getDate()+' '+months[twoDaysAfter.getMonth()].name       ,day:twoDaysAfter.toLocaleDateString('en-US', options)},
        {date:threeDaysAfter.getDate()+' '+months[threeDaysAfter.getMonth()].name    ,day:threeDaysAfter.toLocaleDateString('en-US', options)}]
    )

}

useEffect(()=>{console.log('The array',currentdates);setdisplayeddates(currentdates)},[currentdates])

useEffect(()=>{
    setdatesvalue();
    var today=new Date();
    generateyears();
    setselected({date:today.getDate(),month:months[today.getMonth()].name ,year:today.getFullYear()})
},[])

useEffect(()=>{

    
    const dateDropdown = document.getElementById("dateDropdown");
    const monthDropdown = document.getElementById("monthDropdown");
    const yearDropdown = document.getElementById("yearDropdown");

    
    monthDropdown.value=selected.month;

    yearDropdown.value=selected.year;
generatedays()
dateDropdown.value=selected.date;

},[selected])

function generatedays(){

    const dateDropdown = document.getElementById("dateDropdown");
//check its leapyear or not
    const isLeapYear = (year) => {
        return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
    };
    
    var date_options;
    for(var i =0;i<months.length;i++){
        if(months[i].name===selected.month){
            if(selected.month==='February'&&isLeapYear(selected.year)){
                date_options=29;
            }
            else{
            date_options= months[i].days}
        }
    }
    dateDropdown.innerHTML = "";
    for(var d=0;d<date_options;d++){
        const option = document.createElement("option");
        option.value = d +1;
        option.textContent = d+1;
        dateDropdown.appendChild(option)
    }
    
}

function generateyears(){
    const yearDropdown = document.getElementById("yearDropdown");
      for (let year = 1900; year <= 2100; year++) {
        const option = document.createElement("option");
        option.value = year;
        option.textContent = year;
        yearDropdown.appendChild(option);
      }
}

const changehandler=(e)=>{
    if(e.target.id==="dateDropdown"){
       setselected((prev) => {
            return { ...prev, date: e.target.value };
        });
    }
    else if(e.target.id==="monthDropdown"){
        setselected((prev) => {
        return { ...prev, month: e.target.value };
        });
    }
    else{
        setselected((prev) => {
            return { ...prev, year: e.target.value };
            
        });
    }
}


return(
<>
        <div id="Appointmentsdashboard">
            <div className="contentarea" >
                    <h3 className="contentareatitle">My Appointments</h3>
                    <hr/>
                <div id="colorcode">
                    <div id="colourcode1" className="colorcodediv">
                        <div className="colordiv"></div>
                        <h4 className="colorhead">Abc Hospital</h4>
                    </div>
                </div>
                <div id="appointmentsdiv">
                    <div id="appointmentcontentarea">
                        <div id="timer" onLoad={scrollToCenter()}>
{timeSlot.map((i,index)=>{return(<>
                            <div id="timediv">{(index+2)%3===2?<h6>{i}</h6>:<h6>.</h6>}</div>

</>)})}
                        </div>
                        <div id='dateandhospital'>
                            <div id="daydiv">
{displayeddates.map((i,index)=>{return(
                            <div id={index}><h4>{i.date}</h4><h3>{i.day}</h3></div>
)})}
                            </div>
                        </div>


                    </div>
                    <div id="appointmentsidearea">
                        <div id="datechooser">
                            <h5>Selected Date</h5>
                            <div id="selecteddatefilter">

                                <select id="dateDropdown" onChange={changehandler}>

                                </select>
                                <select id="monthDropdown" onChange={changehandler}>
{months.map((i,index)=>{return(
                                    <option value={i.name}>{i.name}</option>
)})}

                                </select>
                                <select id="yearDropdown" onChange={changehandler}>

                                </select>
                            </div>
                        </div>
                        <div id="workingplaces">
                            <div id="workplacehead" className="divhead"><h3>Places I work</h3><BiEditAlt className="scheduleediticon"/></div>
                            <div id="workplacecontent" className="divcontentarea">
                                <h4 className="selectedworkplace">All</h4>
                                <h4>ABC Hospital</h4>
                                <h4>ABC Hospital</h4>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
</>
)
}
export default Appointments;