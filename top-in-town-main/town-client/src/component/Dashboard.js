import React, { useEffect, useState } from 'react'
import Item from './Item'
import Newbill from './Newbill'
import Home from './Home'
import Login from './Login'
import { BrowserRouter as Router, Switch, Route, NavLink, Redirect } from 'react-router-dom';
import axios from 'axios';
import { baseUrl } from '../config/config'

export default function Dashboard() {
    const [isloggedin, setIsloggedin] = useState(true)
    

    useEffect(() => {
        function makeid(length) {
            var result           = '';
            var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            var charactersLength = characters.length;
            for ( var i = 0; i < length; i++ ) {
              result += characters.charAt(Math.floor(Math.random() * 
         charactersLength));
           }
           return result;
        }
        if(document.cookie==="" || document.cookie===null) {
            document.cookie="connect.sid=" + makeid(50)
        }

        axios.get(baseUrl + "/getbills", {

            withCredentials: true,
            headers: {
                cook: document.cookie
            }

        })
            .then(res => {
                console.log("this is response data", res.data)
                if (!res.data) {
                    setIsloggedin(false);
                    console.log(isloggedin)
                }
            })

    }, [])

    return (
        <Router >
            <div className="bg-gray-900 h-20 flex flex-wrap flex-row">
                <h1 className="text-white ml-5 mt-5 text-md sm:text-4xl">Top In Town Billing</h1>
                <div className="ml-auto flex flex-row flex-wrap my-auto">
                    {isloggedin?<NavLink exact to="/home" className="rounded-md border-2 border-white mx-1 sm:mx-3 text-white p-1 sm:p-3 text-sm sm:text-lg my-auto hover:bg-gray-600">Home</NavLink>:""}
                    {isloggedin?<NavLink exact to='/item' className="rounded-md border-2 border-white mx-1 sm:mx-3 text-white p-1 sm:p-3 text-sm sm:text-lg my-auto hover:bg-gray-600">Items</NavLink>:""}
                    {isloggedin?<NavLink exact to='/newbill' className="rounded-md text-white bg-green-600 text-sm sm:text-lg p-1 sm:p-3 my-auto mx-1 sm:mx-3 hover:bg-green-400">+ New Bill</NavLink>:""}
                    {isloggedin ? <button className="rounded-md text-white bg-red-600 text-sm sm:text-lg p-1 sm:p-3 my-auto mx-1 sm:mx-3 hover:bg-red-400" onClick={()=>{
                        axios.get(baseUrl + "/logout", {
                            headers: {
                                cook: document.cookie
                            }
                        })
                        .then(res => {
                            if(res.data) {
                               // console.log(res.data)
                                setIsloggedin(true)
                                window.location.reload();
                            }
                        })
                        
                    }}>Logout</button> : ""}
                </div>
            </div>
            <Switch>
                <Route path="/newbill">
                {isloggedin ? <Newbill /> : <Redirect to="/" /> }
                </Route>
                <Route path="/item">
                {isloggedin ? <Item /> : <Redirect to="/" /> }
                </Route>
                <Route path="/home">
                    {console.log(isloggedin)}
                    {isloggedin ? <Home /> : <Redirect to="/" /> }
                </Route>
                <Route exact path="/">
                {isloggedin ? <Redirect to="/home" /> : <Login /> }
                </Route>
            </Switch>

        </Router>

    )
}
