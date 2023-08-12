import React from "react";
import './orders.css';
import {FiPackage} from "react-icons/fi";
import { useState,useEffect } from "react";
import {AiFillCaretDown} from "react-icons/ai";
import {GrTransaction} from "react-icons/gr";
import {BsCalendar2Date} from "react-icons/bs";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import OrdersI from '../../images/order (1).png'
import OrdersP from '../../images/box.png'
import MedP from '../../images/medicine.png';
import socketIOClient from 'socket.io-client';

function Orders(){
    const [searchcustomer,setsearchcustomer]=useState('')
    const [selectedstatus,setselectedstatus]=useState('')
    const [selectedDate, setSelectedDate] = useState('');
    const [filters,setfilters]=useState({time:''});
    const [order_list,setorder_list]=useState([]);
    const [displayed_list,setdisplayed_list]=useState([])
    const [statistics,setstatistics]=useState({todaymed:'',weeksale:'',todaysale:'',totalorder:'',orderpend:'',popmed:''})
    const serverUrl = 'http://localhost:5000'; // Your server URL

//fetch orders from the database
function fetchorders(){
    try{
        const params=sessionStorage.getItem('org_name')+'/'+sessionStorage.getItem('org_address')
        const api='http://localhost:5000/api/transactionandorder/getorders/'+params;
        fetch(api, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        }).then((response) => response.json()) // get response, convert to json
        .then((json) => {
        if(json.order){
          setorder_list(json.order);
          
          
        }else{setorder_list([]);setdisplayed_list([])}
        if(json.error){console.log(json.error)}
      });
    }catch(err){
      console.log(err)
    }
}

useEffect(()=>{
    
})

useEffect(()=>{
    // Connect to the server's socket.io
    const socket = socketIOClient(serverUrl)
    // Listen for order updates
    socket.on('orderUpdate', data => {
        // Handle the updated order data received from the server
        console.log('Received updated order data:', data.order);
        // Update the order list with the new data
        setorder_list(data.order);
        setdisplayed_list(order_list)
        });
    fetchorders()
    fetchstats()
    fetchorders()
    setdisplayed_list(order_list)

    // Cleanup: Disconnect the socket when the component unmounts
    return () => socket.disconnect();
},[])


//data filter toggle on/off
const handledatefilter = (e) => {
  var currentDate = new Date(); // Get the current date
alert('djn')
  if (selectedDate==='') {
    e.target.classList.add('activetogglebtn');
    e.target.classList.remove('idletogglebtn');
    document.getElementById('togglebtndiv').style.justifyContent = 'flex-end';
    setSelectedDate(currentDate.toISOString().split('T')[0]); // Set selectedDate to current date
    

  } else {
    e.target.classList.add('idletogglebtn');
    e.target.classList.remove('activetogglebtn');
    document.getElementById('togglebtndiv').style.justifyContent = 'flex-start';
    setSelectedDate('');
    
    
  }
};
//show or hide the order detail
const orderdetailhandler=(e)=>{
    var parentnode=e.target.parentNode;
    var id=parseInt(parentnode.id);

    if(document.getElementsByClassName('orderdetail')[id].style.display==='none'){
        document.getElementsByClassName('expand_icon')[id].style.transform='rotate(180deg)';
        document.getElementsByClassName('orderdetail')[id].style.display='flex';
    }
    else{
        document.getElementsByClassName('expand_icon')[id].style.transform='rotate(0deg)';
        document.getElementsByClassName('orderdetail')[id].style.display='none';
    }
}

const filterorders = (e) => {

  if (e.target.id === 'all') {
    
    document.getElementsByClassName('selectedstatus')[0].classList.remove('selectedstatus');
    e.target.classList.add('selectedstatus');
    setselectedstatus('')
  } else {

    document.getElementsByClassName('selectedstatus')[0].classList.remove('selectedstatus');
    e.target.classList.add('selectedstatus');
    setselectedstatus(e.target.id)
  }
};

const movetotransact=(e)=>{

}

function fetchstats(){
try{
        const params=sessionStorage.getItem('org_name')+'/'+sessionStorage.getItem('org_address')
        const api='http://localhost:5000/api/pharmacy/stats/'+params;
        fetch(api, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        }).then((response) => response.json()) // get response, convert to json
        .then((json) => {

            setstatistics({todaymed:json.item_sold_today,weeksale:json.transac_amount_week,todaysale:json.transac_amount_today,totalorder:json.total_orders_today,orderpend:json.pending_orders_today,popmed:json.popular_med})
      });
    }catch(err){
      console.log(err)
    }
}

function format_date(d){
    d=parseInt(d.split('-')[2])+'/'+parseInt(d.split('-')[1])+'/'+d.split('-')[0]
    d=d.toString();
    return d;
}

const handleSearchCustomer=(e)=>{

    setsearchcustomer(e.target.value)
}

function filteringorders() {

    
    var filteredOrders = order_list.filter((o) => o.status === selectedstatus && o.buyer_name.toLowerCase().includes(searchcustomer.toLowerCase()));
    setdisplayed_list(filteredOrders);
}


useEffect(()=>{
    filteringorders()

},[displayed_list])

useEffect(()=>{
    filteringorders()
},[selectedstatus])

useEffect(()=>{
    filteringorders()
},[searchcustomer])
return(
<>
        <div id="Ordersdashboard">
            <div className="contentarea" >
                    <h3 className="contentareatitle">Our Orders</h3>
                    <hr/>
                            <div id="statisticsdiv">
                                <div className="summarytilesbloodbank">
                                    <img src={OrdersI}></img>
                                    <div>
                                        <h3 className="tilename">Total <br/>Orders</h3>
                                        <h2 className="tilevalue">{statistics.totalorder}</h2>
                                    </div>
                                </div>
                                <div className="summarytilesbloodbank">
                                    <img src={OrdersP}></img>
                                    <div>
                                        <h3 className="tilename">Orders <br/>Pending </h3>
                                        <h2 className="tilevalue">{statistics.orderpend}</h2>
                                    </div>
                                </div> 
                                <div className="summarytilesbloodbank">
                                    <img src={MedP}></img>
                                    <div>
                                        <h3 className="tilename">Popular<br/> Medicine</h3>
                                        <h2 className="tilevalue">{statistics.popmed}</h2>
                                    </div>
                                </div>
                                      
                                
                            </div>
                <div id="mainorderdiv">
                    <div id="ordersdiv">
    {
                            !order_list.length&&
                            <h2 className="no_med">No orders yet</h2>
    }
    {

                            displayed_list.map((i,index)=>{
                            return(

                        <div className="orderbox" id={index}>
                            <div className={"order_container"+i.status} id={index}>
                                <FiPackage className="tabsicon Order_symbol" id={index}/>
                                <h2 className="order_title" id={index}>{i.buyer_name}</h2>

                                <h2 className="order_date" id={index}>{format_date(i.date)}</h2>
                                <h2 className="status" id={index}>{i.status}</h2>
                                <GrTransaction  className="tabsicon transact_icon" id={index} onClick={movetotransact}/>
                                <div className="expand_icon" onClick={orderdetailhandler} id={index}>
                                    <AiFillCaretDown className="tabsicon " id={index}/>
                                </div>
                            </div>
                            <div className="orderdetail" id={index}>
                                <table className="detail_table" id={index}>
                                    <tr className="headings" id={index}>
                                        <th id={index}>Medicine Name</th>
                                        <th id={index}>Quantity</th>
                                        <th id={index}>Price</th>
                                    </tr>
    {i.items.map((j,jindex)=>{
        return(
                                    <tr id={index}>
                                        <td id={index}>{j.name}</td>
                                        <td id={index}>{j.quantity}</td>
                                        <td id={index}>{j.price}</td>
                                    </tr >
    )})}
                                    <tr className="totaldiv" id={index}>
                                        <td colspan="2" className="total">Discount</td>
                                        <td className="totalamount">{i.discount}</td>
                                    </tr>
                                    <tr className="totaldiv" id={index}>
                                        <td colspan="2" className="total">Total Price</td>
                                        <td className="totalamount">{i.amount}</td>
                                    </tr>

                                </table>
                            </div>
                        </div>
    )})}                  

                    </div>
                    <div id="sidebarorder">
                    <div id="summarybardiv">

                    </div>
                    <div className="filterbar">
                        
                            <h6>Customer Name:</h6>
                                <input
                                type="text"
                                placeholder="Search orders by name"
                                value={searchcustomer}
                                onChange={handleSearchCustomer}
                                className='searchorder'
                                />
                            <div id="datesearch">
                                <h6>Search by Date: </h6>
                                <div id="togglebtndiv"><div id="togglebtncircle" className="idletogglebtn" onClick={handledatefilter}></div></div>
                            </div>

                            
                            <input type="date" id="datepicker" className="calendar-containerfilter" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)}></input>                                

                            <h6>Order Status:</h6>
                                <h5 id="all" className="selectedstatus" onClick={filterorders} >All</h5>
                                <h5 id="pending" onClick={filterorders}>Pending</h5>
                                <h5 id="delivered" onClick={filterorders}>Delivered</h5>
                        </div>
                    </div>
                </div>
            </div>

        </div>
</>
)
}
export default Orders;