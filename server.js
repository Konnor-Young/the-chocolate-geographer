const express = require('express');
const cors = require('cors');
const http = require('http');
const app = express();
const server = http.createServer(app);
const Coco = require('./data/model');
const helper = require('./data/helper');
const email = require('./data/email');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(`${__dirname}/public/`));

app.get('/users', (req, res)=>{
    Coco.Users.find()
    .then((user)=>{
        res.json(user);
        res.status(200);
    });
});
app.get('/dates', (req, res)=>{
    Coco.Dates.find()
    .then((dates)=>{
        res.json(dates);
        res.status(200);
    });
});
app.get('/dates/:id', (req, res)=>{
    let date = req.params.id;
    console.log(date);
    Coco.Dates.findOne({date: date}).then((date)=>{
        if(date == null){
            res.status(404).json({Message: "Not Found"});
            return;
        }else{
            res.json(date);
            res.status(200);
        };
    });
});
app.post('/dates', (req, res)=>{
    let newDay = helper.DateHelper(req.body);
    Coco.Dates.create(newDay).then((newDay)=>{
        res.status(201);
        res.json(newDay);
    });
});
app.delete('/dates/:id', (req, res)=>{
    let id = req.params.id;
    console.log(id);
    Coco.Dates.findOneAndDelete({date: id}).then((date) => {
        if(date == null){
            res.status(404).json({Message: "Not Found"});
            return;
        }
        res.status(204).end();
    });
});
app.put('/dates/:id', (req, res)=>{
    let date = req.params.id;
    console.log(date);
    let seats = updateHelper(req.body);
    Coco.Dates.findOneAndUpdate({date: date}, {seats: seats}, {new: true}).then((date)=>{
        if(date == null){
            res.status(404).json({Message: "Not Found"});
            return;
        }
        // res.json(date);
        res.status(204).end();
    });
});

app.get('/seats/:id', (req, res) => {
    let date = req.params.id;
    console.log(date);
    Coco.Seats.find({date: date}).then((seats)=>{
        if(seats == []){
            res.status(404).json({Message: "Not Found"});
        }else{
            res.json(seats);
            res.status(200);
        }
    });
});
app.post('/seats', async (req, res) => {
    try {
      // Create the new seat document
      let newSeat = await helper.SeatsHelper(req.body);
      let createdSeat = await Coco.Seats.create(newSeat);
  
      // Update the Coco.Dates document with the new seat count
      let updatedDate = await Coco.Dates.findOneAndUpdate(
        { date: req.body.date },
        { $inc: { seats: -req.body.party } },
        { new: true }
      );
  
      res.status(201);
      res.json(createdSeat);
    } catch (err) {
      console.error(err);
      res.status(500);
      res.send('Error creating seat');
    }
  });
// app.post('/seats', (req, res)=>{
//     let newSeat = helper.SeatHelper(req.body);
//     Coco.Seats.create(newSeat).then((newSeat)=>{
//         res.status(201);
//         res.json(newSeat);
//     });
// });

app.post('/send-email', (req, res) => {
    console.log('requested email');
    try {
      email.sendEmail(req.body).then(()=>{
        res.status(200).send("Email sent successfully");
      })
    } catch (error) {
      res.status(500).send("Error sending email");
    }
  });

app.get('/chocolates', (req, res)=>{
    Coco.Chocolates.find()
    .then((inventoryList)=>{
    res.json(inventoryList);
    res.status(200);
    })
});
app.get('/chocolates/:coco_id', (req, res)=>{
    let id = req.params.coco_id;
    Coco.Chocolates.findOne({_id: id}).then(chocolate => {
        if(chocolate == null){
            res.json("Not Found");
            res.status(404);
        }else{
            res.json(chocolate);
            res.status(200);
        }
    }).catch((err)=>{
        res.status(400).json("bad request")
    })
});
app.post('/chocolates', (req, res)=>{
    let chocolate = helper.POSThelper(req.body);
    Coco.Chocolates.create(chocolate)
    .then((chocolate)=>{
        res.status(201);
        res.json(chocolate);
    });
});


module.exports = {
    server: server,
}