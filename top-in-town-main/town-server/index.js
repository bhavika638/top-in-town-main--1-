var easyinvoice = require('easyinvoice');
const express = require('express')
const mongoose = require('mongoose')
const { google } = require('googleapis')
const app = express();
var PORT = process.env.PORT || 3005;
const path = require('path')
var fs = require('fs');
const cors = require('cors')
 const { ensureAuthenticated, forwardAuthenticated } = require('./config/auth');
// const session = require('express-session')
const bcrypt = require('bcryptjs')
// const cookieParser = require('cookie-parser')
// const logout = require('express-passport-logout')
// const passport = require('passport')

// require('./config/passport')(passport)

// app.use(
//     session({
//         secret: 'secret',
//         resave: false,
//         saveUninitialized: true
//     })
//);

// app.use(cookieParser('secret'))

// Passport middleware
// app.use(passport.initialize());
// app.use(passport.session());


const CLIENT_ID = <Your Client ID>
const CLIENT_SECRET = <Your Client Secret>
const REDIRECT_URI = 'https://developers.google.com/oauthplayground'

const REFRESH_TOKEN = <Your Refresh Token>

const oauth2Client = new google.auth.OAuth2(
    CLIENT_ID,
    CLIENT_SECRET,
    REDIRECT_URI
)

oauth2Client.setCredentials({ refresh_token: REFRESH_TOKEN })

const drive = google.drive({
    version: 'v3',
    auth: oauth2Client
})

async function uploadFile(fileName, path) {
    try {
        const response = await drive.files.create({
            requestBody: {
                name: fileName,
                mimeType: 'application/pdf'
            },
            media: {
                mimeType: 'application/pdf',
                body: fs.createReadStream(path)
            }
        })
        const fileID = response.data.id;
        await drive.permissions.create({
            fileId: fileID,
            requestBody: {
                role: 'reader',
                type: 'anyone'
            }
        })

        const result = await drive.files.get({
            fileId: fileID,
            fields: 'webViewLink'
        })

        return result.data.webViewLink

    } catch (error) {
        console.log(error.message)
    }
}

const zeroPad = (num, places) => String(num).padStart(places, '0')



app.use(cors({
    origin: "http://top-in-town-billing.herokuapp.com",
    methods: "GET, POST, PUT, HEAD, PATCH, DELETE",
    credentials: true
}));

// app.use(function(req, res, next) {
//     res.header('Access-Control-Allow-Origin', "http://localhost:3000");
//     res.header('Access-Control-Allow-Methods','GET,PUT,POST,DELETE');
//     res.header('Access-Control-Allow-Headers', 'Content-Type');
//     res.header('Access-Control-Allow-Credentials', true);
//     next();
// })

let userModel = require('./models/User')
let itemModel = require('./models/Item')
let Authuser = require('./models/Authuser')
let savedModel = require('./models/Saved')
const db = require('./config/keys').mongoURI;
// const { connected } = require('process');

mongoose
    .connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("db connected"))
    .catch(err => console.log(err))

app.use(
    express.urlencoded({
        extended: true
    })
)

app.use(express.json());

app.post('/login', (req, res) => {
    console.log(req.headers)
    Authuser.findOne({ email: req.body.email })
        .then(user => {
            if(!user)
            res.send(false)
            else {
                bcrypt.compare(req.body.password, user.password, (err, match) => {
                    if (err) throw err
                    if (match) {
                        var saved = new savedModel({
                            id: req.headers.cook
                        })
                        saved.save()
                            .then((doc, err) => {
                                if (err) throw err
                                if (doc) {
                                    console.log("Authenticated")
                                    res.send(true)
                                }
                            })
                    }
    
                })
            }
            
        })
});


app.get('/logout', (req, res) => {
    savedModel.findOneAndDelete({id: req.headers.cook}, (err, docs) => {
        if (err) throw err
        if (docs)
        res.send(true)
    })
});

// app.post('/register', (req, res) => {
//     const { name, email, password, password2 } = req.body;
//     let errors = [];

//     if (!name || !email || !password || !password2) {
//       errors.push({ msg: 'Please enter all fields' });
//     }

//     if (password != password2) {
//       errors.push({ msg: 'Passwords do not match' });
//     }

//     if (password.length < 6) {
//       errors.push({ msg: 'Password must be at least 6 characters' });
//     }

//     if (errors.length > 0) {
//       res.render('register', {
//         errors,
//         name,
//         email,
//         password,
//         password2
//       });
//     } else {
//       Authuser.findOne({ email: email }).then(user => {
//         if (user) {
//           errors.push({ msg: 'Email already exists' });
//           res.render('register', {
//             errors,
//             name,
//             email,
//             password,
//             password2
//           });
//         } else {
//           const newUser = new Authuser({
//             name,
//             email,
//             password
//           });

//           bcrypt.genSalt(10, (err, salt) => {
//             bcrypt.hash(newUser.password, salt, (err, hash) => {
//               if (err) throw err;
//               newUser.password = hash;
//               newUser
//                 .save()
//                 .then(user => {
//                   console.log("USER REgistered")
//                   res.redirect('http://localhost:3000/');
//                 })
//                 .catch(err => console.log(err));
//             });
//           });
//         }
//       });
//     }
//   });

app.get('/getbills', ensureAuthenticated, (req, res) => {
    console.log(req.headers)
    userModel.find({}, (err, docs) => {
        if (err)
            console.log(err)
        if (docs) {
            var resjson = [];
            for (var i = 0; i < docs.length; i++) {
                resjson.push({
                    "invoicenumber": docs[i].invoicenumber,
                    "name": docs[i].name,
                    "number": docs[i].number,
                    "date": docs[i].date,
                    "amount": docs[i].amount
                })
            }
            res.json(resjson)
            console.log(resjson)
        }

    })

})

app.post('/additem', ensureAuthenticated, (req, res) => {
    console.log(req.body)
    let itemdb = new itemModel({
        category: req.body.category,
        name: req.body.name,
        price: req.body.price
    })
    itemdb.save()
        .then((doc, err) => {
            if (doc)
                console.log("added", doc)
            if (err)
                console.log(err)
        })
    res.send("Item Added Successfuly")
})

app.get('/getitem', ensureAuthenticated, (req, res) => {
    itemModel.find({}, (err, docs) => {
        if (err)
            console.log(err)
        if (docs) {
            var resjson = [];
            for (var i = 0; i < docs.length; i++) {
                resjson.push({
                    "name": docs[i].name,
                    "price": docs[i].price
                })
            }
            res.json(resjson)
            console.log(resjson)
        }

    })
})

app.post('/getitem', ensureAuthenticated, (req, res) => {
    console.log(req.body)
    itemModel.find({ category: req.body.category }, (err, docs) => {
        if (err) throw err
        if (docs) {
            var resjson = [];
            for (var i = 0; i < docs.length; i++) {
                resjson.push({
                    "name": docs[i].name,
                    "price": docs[i].price
                })
            }
            res.json(resjson)
        }
    })
})



function calculateTotal(total, prce) {
    var ret = 0
    console.log(total)
    console.log(prce)
    for (var i = 0; i < total.length; i++) {
        ret = ret + parseInt((total[i] === '' ? 1 : total[i])) * parseInt(prce[i])
    }
    return ret;
}





function generatebill(item, total, name, addr, phn, prce) {
    return new Promise(function (resolve, reject) {
        var products = []
        if (typeof (item) == 'string') {
            item = [item]
            total = [total]
            prce = [prce]
        }

        for (var i = 0; i < item.length; i++) {




            products.push({
                "quantity": (total[i] === '' ? 1 : total[i]),
                "description": item[i],
                "tax": 0,
                "price": parseInt(prce[i])
            })
        }
        let ts = Date.now();
        let date_ob = new Date(ts);
        let day = date_ob.getDate();
        let month = date_ob.getMonth();
        let year = date_ob.getFullYear();

        userModel.find({}
            , (err, result) => {
                if (err)
                    console.log(err)
                if (result) {
                    var invoicenumber = zeroPad((result.length === 1 ? 1 : parseInt(result[result.length - 1].invoicenumber) + 1), 6);
                    var data = {
                        "currency": "INR",
                        "taxNotation": "vat",
                        "marginTop": 25,
                        "marginRight": 25,
                        "marginLeft": 25,
                        "marginBottom": 25,
                        "logo": "https://i.imgur.com/GZa4OFh.jpeg",
                        "background": "",
                        "sender": {
                            "company": "Top In Town(Ritik 7027000505)",
                            "address": "Thana Kalan Road, Kharkhoda",
                            "zip": "131402",
                            "city": "Kharkhoda, Sonepat",
                            "country": "Haryana"
                        },
                        "client": {
                            "company": name,
                            "address": addr,
                            "zip": phn,
                            "city": "",
                            "country": ""
                        },
                        "invoiceNumber": invoicenumber,
                        "invoiceDate": day + "-" + month + "-" + year,
                        "products": products,
                        "bottomNotice": "Thanks for Visiting.",
                    };

                    var userdb = new userModel({
                        invoicenumber: invoicenumber,
                        name: name,
                        number: phn,
                        date: day + "-" + month + "-" + year,
                        amount: calculateTotal(total, prce),
                        json: data
                    })
                    userdb.save()
                        .then((doc, err) => {
                            if (err)
                                console.log(err)
                            if (doc)
                                console.log("Bill Added in Database")
                        })





                    //Create your invoice! Easy!
                    easyinvoice.createInvoice(data, async function (generated) {
                        //The response will contain a base64 encoded PDF file
                        await fs.writeFileSync("invoice.pdf", generated.pdf, 'base64');
                        resolve(invoicenumber)
                    });
                }

            })


    })

}

app.post('/bill', (req, res) => {

    generatebill(req.body.item, req.body.total, req.body.name, req.body.address, req.body.phone, req.body.price)
        .then(async (filename) => {
            console.log(filename)
            if (typeof (filename) == 'string') {
                const filePath = path.join(__dirname, 'invoice.pdf')
                const link = await uploadFile(filename, filePath)
                // var data = fs.readFileSync('./invoice.pdf')
                // res.contentType("application/pdf")
                // res.send(data)
                res.redirect("http://wa.me/91" + req.body.phone + "?text=Hey there, this is Top in Town\'s Auto Generated Message. Here is invoice for your products: " + link)
            }
        })



})

app.get('/getpdf/:invoicenumber', (req, res) => {
    userModel.find(req.params, (err, docs) => {
        if (err) throw err
        if (docs) {
            const myPromise = new Promise((resolve, reject) => {
                easyinvoice.createInvoice(docs[0].json, async function (result) {
                    await fs.writeFileSync("invoice.pdf", result.pdf, 'base64');
                    resolve(true)
                });
            })

            myPromise
                .then(re => {
                    if (re) {
                        var data = fs.readFileSync('./invoice.pdf')
                        res.contentType("application/pdf")
                        res.send(data)
                    }
                })

        }
    })
})


app.get('/deletebill/:invoicenumber', (req, res) => {
    userModel.findOneAndDelete(req.params, (err, docs) => {
        if (err)
            console.log(err)
        if (docs) {
            res.status(200).send("Deleted Bill Successfully")
        }
    })
})


app.listen(PORT, (err) => {
    if (err)
        console.log(err)
    console.log("listening on", PORT)
})
