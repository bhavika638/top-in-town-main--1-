import React, { useState } from 'react'
import { baseUrl } from '../config/config'
import axios from 'axios'



export default function Login() {
    const [email, setEmail] = useState("")
    const [pass, setPass] = useState("")

    const submitForm = () => {
        axios.post(baseUrl + "/login", {email: email, password: pass}, {headers: {Cook: document.cookie}})
        .then(res => {
            console.log(res.data)
            if(res.data === true) {
                window.location.reload();
            }
        })
    }

    return (
        <div className="flex flex-wrap flex-col justify-center">
            <form className="flex mx-auto text-white flex-wrap flex-col mt-20" action={baseUrl + '/login'} method="POST">
                <div className="flex my-3 flex-wrap flex-row">
                    <label for="email">Email:</label>
                    <input className="text-black ml-2 pl-2" type="email" name="email" placeholder="email" onChange={(event)=>{
                        setEmail(event.target.value)
                    }}></input>
                </div>
                <div className="flex my-3 flex-wrap flex-row">
                    <label for="password">Password:</label>
                    <input className="text-black ml-2 pl-2" type="password" name="password" placeholder="password" onChange={(event)=>{
                        setPass(event.target.value)
                    }}></input>
                </div>



                
            </form>
            <button className="p-2 bg-red-600 rounded-lg mx-auto" tyoe="submit" onClick={submitForm}>Login</button>
        </div>
    )
}
