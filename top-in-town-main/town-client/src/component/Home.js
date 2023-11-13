import React, {useEffect, useState} from 'react'
import axios from 'axios'
import {baseUrl} from '../config/config'

export default function Home() {
    const [bills, setBills] = useState([])

  

    useEffect(() => {
        axios.get(baseUrl+"/getbills", {
            
            withCredentials: true,
            headers: {
                cook: document.cookie
            }
        })
        .then(res => {
            setBills(res.data)
        })
        
    }, [])

    console.log(bills)

    var display = []

    if(bills!==[]) {
        for(var i=1; i<=bills.length-1; i++) {
            display.push(
                <div className="flex ml-1 sm:ml-10 flex-wrap sm:text-md text-sm flex-row text-white">
                    <div className="w-1/6">
                        <h1>{bills[i].invoicenumber}</h1>
                    </div>
                    <div className="w-1/6">
                        <h1>{bills[i].name}</h1>
                    </div>
                    <div className="w-1/6">
                        <h1>{(bills[i].number===''?"No Number":bills[i].number)}</h1>
                    </div>
                    <div className="w-1/6">
                        <h1>{bills[i].date}</h1>
                    </div>
                    <div className="w-1/6">
                        <h1>INR {bills[i].amount}/-</h1>
                    </div>
                    <div className="w-1/6">
                        <a target="_blank" href={baseUrl+"/getpdf/"+bills[i].invoicenumber} className="underline mx-2 cursor-pointer hover:text-blue-600" >get pdf</a>
                        <a target="_blank" href={baseUrl+"/deletebill/"+bills[i].invoicenumber} className="underline mx-2 cursor-pointer text-red-600 hover:text-red-400" onClick={()=>{
                            axios.get(baseUrl+"/getbills", {headers : {cook: document.cookie}})
                            .then(res => {
                                setBills(res.data)
                            })
                        }}>Delete</a>

                    </div>
                </div>
            )
        }
    }
    

    return (
        <div>
            <div className="flex mb-10 mt-10 ml-1 sm:ml-10 flex-wrap flex-row text-white text-md sm:text-2xl">
                    <div className="w-1/6">
                        <h1>Invoice Number</h1>
                    </div>
                    <div className="w-1/6">
                        <h1>Name</h1>
                    </div>
                    <div className="w-1/6">
                        <h1>Phone Number</h1>
                    </div>
                    <div className="w-1/6">
                        <h1>Date</h1>
                    </div>
                    <div className="w-1/6">
                        <h1>Amount</h1>
                    </div>
                    <div className="w-1/6">
                        <h1>Actions</h1>
                    </div>
                </div>
            {display}
        </div>
    )
}
