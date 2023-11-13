import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { baseUrl } from '../config/config'


console.log("Alert Rerendering")

export default function Newbill() {
    const [rend, setRend] = useState(1);
    const [rendarr, setRendarr] = useState([<Chooseitem />]);



    function Chooseitem() {
        const selfindex = rend - 1
        const [index, setIndex] = useState(0)
        const [num, setNum] = useState(1)
        const [item, setItem] = useState([])
        const [price, setPrice] = useState([])
        useEffect(() => {
            axios.post(baseUrl + "/getitem", {
                category: "Burger",
                
            }, {
                withCredentials:true,
                headers: {
                    cook: document.cookie
                }
            })
                .then(res => {
                    var itemarray = [];
                    var pricearray = [];
                    for (var i = 0; i < res.data.length; i++) {

                        itemarray.push(res.data[i].name)
                        pricearray.push(res.data[i].price)

                    }
                    setItem(itemarray)
                    setPrice(pricearray)

                })

        }, [])

        return (
            <div className="flex flex-wrap flex-row mt-5 justify-center">
                <select name="category" className="w-40" onChange={(event) => {
                     
                        axios.post(baseUrl + "/getitem", {
                            category: event.target.value,
                            
                        }, {
                            withCredentials:true,
                            headers: {
                                cook: document.cookie
                            }
                        })
                        .then(res => {
                            var itemarray = [];
                            var pricearray = [];
                            for (var i = 0; i < res.data.length; i++) {

                                itemarray.push(res.data[i].name)
                                pricearray.push(res.data[i].price)

                            }
                            setItem(itemarray)
                            setPrice(pricearray)

                        })
                    
                    
                }}>
                    <option value="Burger">Burger</option>
                    <option value="Sandwich">Sandwich</option>
                    <option value="Pizza">Pizza</option>
                    <option value="Chowmein">Chowmein</option>
                    <option value="Main Courses">Main Courses</option>
                    <option value="Dosa">Dosa</option>
                    <option value="Uttapam">Uttapam</option>
                    <option value="Pasta">Pasta</option>
                    <option value="Veg Momos">Veg Momos</option>
                    <option value="Paneer Momos">Paneer Momos</option>
                    <option value="Soyabean Momos">Soyabean Momos</option>
                    <option value="Rice">Rice</option>
                    <option value="Mojito">Mojito</option>
                    <option value="Shakes">Shakes</option>
                    <option value="Soup">Soup</option>
                    <option value="Dessert">Dessert</option>
                </select>
                <select className="w-40" name="item" onChange={(event) => {
                    setIndex(item.indexOf(event.target.value))

                }}>
                    {item.map(x => <option value={x}>{x}</option>)}
                </select>
                <h1 className="ml-2 text-white">INR <input className="w-16 bg-gray-900" name="price" value={price[index]}></input> x </h1>

                <input className="ml-2 w-16" type="number" name="total" placeholder="Total Items" onChange={(event) => {
                    setNum(event.target.value)

                }}></input>
                <h1 className="text-white ml-3">INR <input name="totalprice" value={price[index] * num} className="w-16 bg-gray-900" onChange={() => {

                }}></input> </h1>
            </div >
        )
    }

    function handleSubmit(event) {
        event.preventDefault();
    }


    return (

        <div className="flex flex-wrap flex-col">
            <form name="form" target="_blank" action={baseUrl + "/bill"} method="POST" className="flex flex-wrap flex-col" onSubmit={handleSubmit}>
                <h1 className="text-lg text-white mx-auto mt-10">Create New Bill</h1>
                <div className="flex flex-wrap flex-row mt-10 mx-auto">
                    <label for="name" className="text-white mx-auto">Name:</label>
                    <input type="text" className="ml-5 pl-1" placeholder="Name" name="name" required></input>
                </div>
                <div className="flex flex-wrap flex-row mt-10 mx-auto">
                    <label for="address" className="text-white mx-auto">Address:</label>
                    <input type="text" className="ml-5 pl-1" placeholder="Address" name="address"></input>
                </div>
                <div className="flex flex-wrap flex-row mt-10 mx-auto">
                    <label for="phone" className="text-white mx-auto">Phone:</label>
                    <input type="number" maxLength={10} minLength={10} className="ml-5 pl-1" placeholder="Phone" name="phone"></input>
                </div>
                {rendarr}
                <h1 className="text-white mx-auto mt-5">Total INR </h1>
                <div className="flex flex-wrap flex-row justify-center mt-5">

                    <h1 className="border-2 cursor-pointer mx-2 text-green-600 border-green-600 p-2 rounded-lg" onClick={() => {
                        setRend(rend + 1);
                        setRendarr([...rendarr, <Chooseitem />])
                    }}>+ Add Item</h1>
                    <h1 className={"border-2 cursor-pointer mx-2  p-2 rounded-lg " + (rend > 1 ? "text-red-600 border-red-600" : "text-red-300 border-red-300")} onClick={() => {
                        if (rend != 1) {
                            setRend(rend - 1);
                            setRendarr(rendarr.filter(x => x !== rendarr[rendarr.length - 1]))
                        }
                    }}>- Delete Item</h1>
                </div>
                <button type="submit" className="bg-green-600 mt-2  text-white p-2 mx-auto rounded-lg" onClick={()=>{
                    document.forms.form.submit()
                    alert("Bill has been Added, Message will be sent on Whatsapp in a while")
                }}>Add Bill</button>
            </form>




        </div>

    )
}

