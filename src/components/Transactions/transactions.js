import React from "react";
import './transactions.css';

import { useState,useEffect } from "react";


function Transactions(props){

    const [transactioninfo,settransactioninfo]=useState({buyer_name:'',date:'',discount:'',amount:0,items:[]})
    const [displayed_list,setdisplayed_list]=useState([])

useEffect(()=>{
    let currentdate=new Date()
    currentdate=currentdate.getDate()+'/'+currentdate.getMonth()+'/'+currentdate.getFullYear()
    settransactioninfo({buyer_name:'',date:currentdate,discount:'',amount:0,items:[]})
    if(props.class==='blood'){ fetchblood()}
    else if(props.class==='pharmacy'){
        fetchmeds()
}

},[])

//fetch medicines from the database
function fetchmeds(){
    try{
        const params=sessionStorage.getItem('org_name')+'/'+sessionStorage.getItem('org_address')
        const api='http://localhost:5000/api/pharmacy/detailmed/'+params;
        fetch(api, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        }).then((response) => response.json()) // get response, convert to json
        .then((json) => {
        if(json.medicines){
          
          setdisplayed_list(json.medicines);
        }else{setdisplayed_list([])}
        if(json.error){console.log(json.error)}
      });
    }catch(err){
      console.log(err)
    }
}

//fetch medicines from the database
function fetchblood(){
    try{
        const params=sessionStorage.getItem('org_name')+'/'+sessionStorage.getItem('org_address')
        const api='http://localhost:5000/api/bloodbank/getblood/'+params;
        fetch(api, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        }).then((response) => response.json()) // get response, convert to json
        .then((json) => {
        if(json.bloodgroups){
          
          setdisplayed_list(json.bloodgroups);
        }else{setdisplayed_list([])}
        if(json.error){console.log(json.error)}
      });
    }catch(err){
      console.log(err)
    }
}
const handleinput=(e)=>{
    e.preventDefault()
    if(e.target.name==='buyer_name'){
        settransactioninfo((previnfo)=>{return({...previnfo,[e.target.name]:e.target.value})})
    }
    if(e.target.className==='quantityinput'){
        if(e.target.value<0){
            e.target.value=0
        }
        
            var index=parseInt(e.target.id);
            let itemlist=transactioninfo.items;
            
            itemlist[index].quantity=e.target.value;
            var amount=0
            for(var i=0;i<itemlist.length;i++){
                amount+=parseInt(itemlist[i].quantity)*parseInt(itemlist[i].price);
            }
            settransactioninfo((previnfo)=>{return({...previnfo,['items']:itemlist,['amount']:amount})})

            

    }
}

useEffect(()=>{
    console.log(transactioninfo )

},[transactioninfo])


const handlechecks=(e)=>{
            if(e.target.checked){
        var itemlist = transactioninfo.items;
        var itemid=parseInt(e.target.id)
        itemlist.push({ name: e.target.name, price:displayed_list[itemid].price, quantity: 1 });
        var amount = 0;
        for (var i = 0; i < itemlist.length; i++) {
        amount = amount + parseInt(itemlist[i].quantity) * parseInt(itemlist[i].price);
        }

        settransactioninfo((previnfo) => {
        return { ...previnfo, items: itemlist, amount: amount };
        });

        

    }
    else{
        var itemlist=[];
        for (var i=0;i<transactioninfo.items.length;i++){
            if(transactioninfo.items[i].name!=e.target.name){
                itemlist.push(transactioninfo.items[i])
            }
        } 
        var amount = 0;
        for (var i = 0; i < itemlist.length; i++) {
        amount = amount + parseInt(itemlist[i].quantity) * parseInt(itemlist[i].price);
        }
        settransactioninfo((previnfo) => {
        return { ...previnfo, items: itemlist, amount: amount };
        });
        
    }
}

useEffect(()=>{
    if(transactioninfo.buyer_name===''||transactioninfo.items.length<1){
        document.getElementsByClassName('save-btn')[0].classList.add('idlebtn');
    }
    else{
        document.getElementsByClassName('save-btn')[0].classList.remove('idlebtn');
    }
})
return(
<>
        <div id="Transactionsdashboard">
            <div className="contentarea" >
                    <h3 className="contentareatitle">Transactions</h3>
                    <hr/>

                <div id="transactionsdiv">
                    <div id={"transact-div"+props.class}>
                        <div id='date'>
                            <h2 >Date:</h2>
                            <h3>{transactioninfo.date}</h3>
                        </div>
                        <div id='buyername'>
                            <label htmlFor='buyer_name'>Customer Name:</label>
                            <input type="text" value={transactioninfo.buyer_name} name="buyer_name" id='buyer_name' onChange={handleinput}/>
                        </div>
                        <div id='transactionitemcontainer'>
                            <table>
                                <tr className="itemhead">
                                    <th className="quantity">Quantity</th>
                                    <th className="itemname">Name</th>
                                    <th>Price (Rs)</th>
                                </tr>
{transactioninfo.items.map((i,index)=>{return(
                                <tr >
                                    <td className="quantity"><input type="number" id={index+'quantity'} className="quantityinput" min={1} value={i.quantity} onChange={handleinput}/></td>
                                    <td className="itemname">{i.name}</td>
                                    <td>{parseInt(i.quantity)*parseInt(i.price)}</td>
                                </tr>
)})}
                                
                            </table>
                            <div>

                                <div id='itemtotalamount'>
                                    <h3>Total Amount:</h3>
                                    <h4>{transactioninfo.amount}</h4>
                                </div>
                            </div>
                        </div>
                        <div id={"transact-divbottom"+props.class}>
                            <button id={'savetransact'+props.class} className="save-btn">Save And Proceed</button>
                        </div>
                    </div>
                    <div id={"side-transact-div"+props.class}>
                        <div id={"header-side-transact-div"+props.class}>
                            <h1>{props.stock} in stock</h1>
                        </div>
                        <div id="container-side-transact-div">
                            <table>
                                <tr className={"entryhead"+props.class}>
                                    <th></th>                        
                                    <th>Name</th>
                                    <th>Price (Rs)</th>
                                    <th>Quantity</th>
                                </tr>
{displayed_list.map((i,index)=>{return(
                                <tr className={"entrydetail"+props.class}>
                                    <td><input type="checkbox" id={index+"-cb"} onChange={handlechecks} name={props.class==='blood'?i.AvailableBloodGroup:i.name} ></input></td>                        
                                    <td ><label htmlFor={index+"-cb"}>{props.class==='blood'?i.AvailableBloodGroup:i.name}</label></td>
                                    <td><label htmlFor={index+"-cb"}>{i.price}</label></td>
                                    <td><label htmlFor={index+"-cb"}>{i.quantity}</label></td>
                                </tr>

)})}



                            </table>
                        </div>
                    </div>
                </div>
            </div>  
        </div>
</>
)
}
export default Transactions;