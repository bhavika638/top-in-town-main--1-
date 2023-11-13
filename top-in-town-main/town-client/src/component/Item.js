import React, { useEffect, useState } from 'react'
import axios from 'axios'
import {baseUrl} from '../config/config'

export default function Item() {
    const [items, setItems] = useState([]);
    const [category, setCategory] = useState("Burger");
    const [name, setName] = useState("");
    const [price, setPrice] = useState(0);

    
    useEffect(() => {
        axios.get(baseUrl+"/getitem", {
            withCredentials: true,
            headers: {
                cook: document.cookie
            }
        })
            .then(res => {
                setItems(res.data)
                console.log(res.data)
            })

    }, [])



    var display = []
    for (var i = 0; i < items.length; i++) {
        display.push(<div className="flex flex-wrap flex-col"><div className="flex flex-wrap flex-row"><h1 className="text-white mt-5 ml-96">{items[i].name}</h1><h1 className="text-white mt-5 ml-auto mr-96">{items[i].price}</h1></div></div>)
    }

    function handleSubmit(event) {
        event.preventDefault();
        var data = {
            category: category,
            name: name,
            price: price
        }
        axios.post(baseUrl+"/additem", data, {
            withCredentials: true,
            headers: {
                cook: document.cookie
            }
        })
            .then(res => {
                alert(res.data);
                axios.get(baseUrl+"/getitem", {
                    withCredentials: true,
                    headers: {
                        cook: document.cookie
                    }
                })
                    .then(res => {
                        setItems(res.data)
                    })
            })
    }

    return (
        <div className="flex flex-wrap flex-col">
            {display}
            <form action={baseUrl+"/additem"} method="POST" onSubmit={handleSubmit}>
                <div className="flex flex-wrap flex-row justify-center mt-4">
                    <label for="category" className="text-white">Category:</label>
                    <select name="category" onChange={event => {
                        setCategory(event.target.value);
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
                    <label for="name" className="text-white ml-3">Name:</label>
                    <input type="text" placeholder="name" required name="name" className="pl-2 mx-3" onChange={event => {
                        setName(event.target.value);
                    }}></input>
                    <label for="price" className="text-white">Price:</label>
                    <input type="number" placeholder="price" required name="price" className="pl-2 mx-3" onChange={event => {
                        setPrice(event.target.value);
                    }}></input>
                    <button type="submit" className="rounded-lg bg-green-600 text-white p-2">Add Item</button>
                </div>
            </form>
        </div>
    )
}
