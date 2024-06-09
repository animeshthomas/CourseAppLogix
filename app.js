const express = require('express');
var bodyParser = require('body-parser');
const mongoose = require("mongoose");
var x = require('request');

var app = express();
let Schema = mongoose.Schema;
// const studentModel = mongoose.model("students", {

const studentSchema = new Schema({

    firstname: String,
    lastname: String,
    college: String,
    dob: String,
    course: String,
    mobile: String,
    email: String,
    address: String

});
//const markModel = mongoose.model("marks", {

const courseSchema = new Schema({
    studId: { type: mongoose.Types.ObjectId, ref: 'students' },
    courseName: String,
    totalAmount: Number,
    amountPaid: Number
});

const transSchema = new Schema({
    studId: { type: mongoose.Types.ObjectId, ref: 'students' },
    courseId: { type: mongoose.Types.ObjectId, ref: 'course' },
    amount: Number,
    date: String,
    mode: String
});



var studentModel = mongoose.model('students', studentSchema);

var courseModel = mongoose.model('course', courseSchema);

var transModel = mongoose.model('transactions', transSchema);



app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));


app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));

//mongodb+srv://anishsnair:<password>@cluster0-rqfpy.mongodb.net/test?retryWrites=true&w=majority
//mongoose.connect("mongodb://localhost:27017/testdb", { useNewUrlParser: true });
mongoose.connect("mongodb+srv://anishsnair:hello12345@cluster0-rqfpy.mongodb.net/test?retryWrites=true&w=majority");


app.get("/getdata", async(request, response) => {

    try {
        var result = await studentModel.find().exec();
        response.send(result);
    } catch (error) {
        response.status(500).send(error);
    }
});

app.post("/getastudentdata", async(request, response) => {

    try {


        console.log(request.body)
        studentModel.find(request.body, (error, data) => {
            if (error) {
                throw error;
            } else {
                response.send(data)
            }
        })


    } catch (error) {
        response.status(500).send(error);
    }
});


app.post("/addstudents", async(request, response) => {
    try {
        var studentdata = new studentModel(request.body);
        var result = await studentdata.save();
        response.send(result);
    } catch (error) {
        console.log(error)

        response.status(500).send(error);
    }
});

app.post("/addcourse", async(request, response) => {
    try {
        console.log(request.body)

        var courseDetails = new courseModel(request.body);

        var result = await courseDetails.save();

        response.send(result);
    } catch (error) {
        response.status(500).send(error);
    }
});


app.post("/addtrans", async(request, response) => {
    try {
        console.log(request.body)

        var transDetails = new transModel(request.body);

        var result = await transDetails.save();

        response.send(result);
    } catch (error) {
        response.status(500).send(error);
    }
});



app.post("/search", async(request, response) => {
    try {


        studentModel.aggregate([

            {
                $match: {
                    mobile: request.body.mobile, //$region is the column name in collection

                },
            },

            {
                $lookup: {
                    from: 'courses',
                    localField: '_id',
                    foreignField: 'studId',
                    as: 'coursedetails'
                }

            },
            {
                $lookup: {
                    from: 'transactions',
                    localField: '_id',
                    foreignField: 'studId',
                    as: 'transactiondetails'
                }

            },



        ], function(error, data) {
            return response.json(data);
            //handle error case also
        });
        //console.log(resources);

        //  var result = await markModel.find({"studId":"5d5ed2f5c36c3b9e878f1908"}).populate('studId');
        //    response.send(result);
    } catch (error) {
        response.status(500).send(error);
    }
});


app.get("/viewcourses", async(request, response) => {
    try {


        studentModel.aggregate([

            //  {
            // $group: {
            //       _id: '$_id',  //$region is the column name in collection
            //
            //   },
            //   },

            {
                $lookup: {
                    from: 'courses',
                    localField: '_id',
                    foreignField: 'studId',
                    as: 'coursedetails'
                }

            },
            {
                $lookup: {
                    from: 'transactions',
                    localField: '_id',
                    foreignField: 'studId',
                    as: 'transactiondetails'
                }

            },



        ], function(error, data) {
            return response.json(data);
            //handle error case also
        });
        //console.log(resources);

        //  var result = await markModel.find({"studId":"5d5ed2f5c36c3b9e878f1908"}).populate('studId');
        //    response.send(result);
    } catch (error) {
        response.status(500).send(error);
    }
});




app.listen(process.env.PORT || 4000, function() {
    console.log('Your node js server is running at http://localhost:3000');
});