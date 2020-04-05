//jshint esversion:6
//ejs is also required
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const md5 = require('md5');
const session = require('express-session');
const request = require('request');

const app = express();

//_____________________________ENV VARS(TO BE REMOVED LATER)__________________________________
const SESSIONSECRET = "refconk963ngRg6PFyovLL";
const MONGONLINE = "mongodb+srv://tchkr:k963ngRg6PFyovLL@cluster0-ge7yf.mongodb.net/refconDB";
const MONGOFFLINE = "mongodb://localhost:27017/refconDB";
//____________________________________________________________________________________________

//Application Configurations
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended:true }));
app.use(session({ secret: SESSIONSECRET, resave: false, saveUninitialized: true }));

app.set('view engine', 'ejs');

//=====================================================================================================================
//DB Connection and Schema Setup
mongoose.connect(MONGOFFLINE, { useNewUrlParser: true, useUnifiedTopology: true} ,(err) => {
    if(err){
        console.log(err);
        }
    else{
        console.log("Connected to database");
    }
});

const refconTeacherSchema = {
  fullName: String,
  phoneNumber: String,
  collegeName: String,
  facultyid: String,
  email: String,
  password: String,
  type: String
};

const refconStudentSchema = {
    fullName: String,
    phoneNumber: String,
    collegeName: String,
    rollNumber: String,
    department: String,
    email: String,
    password: String,
    type: String,
    year: String,
};

const refconMessageSchema = {
    question: String,
    questionTitle: String,
    date: String,
    repliedDate: String,
    to: String,
    fromID: String,
    answer: String
};

const refconInternalMarkSchema = {
    internalNumber: String,
    department: String,
    subjectName: String,
    subjectCode: String,
    year: String,
    semester: String,
    facultyid: String,
    rollNumbers:[String],
    marks:[String]
};

const refconEventSchema = {
    eventName: String,
    eventDescription: String,
    participantType: String,
    yearType: String,
    venue: String,
    date: String,
    time: String,
    prizes: String,
    fee: String,
    registered: String,
    rollNumbers:[String],
    tokenId:[String]
};

const refconExamFeeSchema = {
    rollNumbers: [String],
    arrearCount: [String],
    isPaid: [String],
    phoneNumbers: [String],
    semesterNumber: String,
    currentSemesterSubjectCount: String,
    year: String,
    department: String,
    facultyid: String
};

const refconReportSchema = {
    report: String,
    reportType: String,
    reportTitle: String,
    date: String,
    fromId: String,
    fromType: String,
    answer: String
};

const studentQueueSchema = {
    department: String,
    year: String,
    unalloc: [String],
    alloc: [String]
};

const checkBooleanSchema = {
    start: Boolean,
    allAllocated: Boolean
};

const seatingOrderSchema = {
    //block: contains ( department floor hallno )
    block: String,
    rollNumbers: [String],
    seatTypes:[String],
    seatNumbers: [Number],
    department1: String,
    department2: String,
    year1: String,
    year2: String,
    rows: String,
    columns: String,
    department1rollNumbers:[String],
    department2rollNumbers:[String]

};

const RefconStudent = mongoose.model("RefconStudent", refconStudentSchema);
const RefconTeacher = mongoose.model("RefconTeacher", refconTeacherSchema);
const RefconMessage = mongoose.model("RefconMessage", refconMessageSchema);
const RefconInternalMark = mongoose.model('RefconInternalMark', refconInternalMarkSchema);
const RefconEvent = mongoose.model('RefconEvent', refconEventSchema);
const RefconExamFee = mongoose.model('RefconExamFee', refconExamFeeSchema);
const RefconReport = mongoose.model('RefconReport', refconReportSchema);
const StudentQueue = mongoose.model('StudentQueue', studentQueueSchema);
const CheckBoolean = mongoose.model('CheckBoolean', checkBooleanSchema);
const SeatingOrder = mongoose.model('SeatingOrder', seatingOrderSchema);

//Following is created internally in the database:
// var department = ['CSE', 'EEE', 'ECE', 'MECH', 'CIVIL', 'IT'];
// var year = ['1', '2', '3', '4'];
// for(var i=0; i<department.length; i++){
//     for(var j=0; j<year.length; j++){
//         console.log(department[i] + " " + year[j]);
//         const dept_year = new StudentQueue({
//             department: department[i],
//             year: year[j],
//         });
//         dept_year.save();
//     }
// }
// 
// const checkboolean = new CheckBoolean({
//     start: false,
//     allAllocated: false
// });
// checkboolean.save();

//User-defined functions:
var sendDateTime = () => {
    const today = new Date();
    const noToWord = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
    const month = noToWord[today.getMonth()];
    const date = today.getDate() + '/' + month + '/' + today.getFullYear();
    const time = today.getHours() + ":" + today.getMinutes();
    return (date + ' ' + time);
};
//=====================================================================================================================

//Requiring User-defined Routes
const login = require('./routes/login');
const register = require('./routes/register');
const overview = require('./routes/overview');
const internalmark = require('./routes/internalmark');
const studenteacherdiscussion = require('./routes/studenteacherdiscussion');
const event = require('./routes/event');
const message = require('./routes/message');
const newmessage = require('./routes/newmessage');
const accountsettings = require('./routes/accountsettings');
const logout = require('./routes/logout');
const eventpayment = require('./routes/eventpayment');
const examfee = require('./routes/examfee');
const examfeepayment = require('./routes/examfeepayment');
const report = require('./routes/report');
const admin = require('./routes/admin');
const seatingorder = require('./routes/seatingorder');

//Passing params to specific routes
login(app, md5, RefconStudent, RefconTeacher);
register(app, md5, RefconStudent, RefconTeacher);
overview(app);
internalmark(app, RefconStudent, RefconInternalMark);
studenteacherdiscussion(app, RefconMessage);
event(app, RefconStudent, RefconEvent);
message(app, RefconMessage, sendDateTime);
newmessage(app, RefconMessage, RefconTeacher, sendDateTime);
accountsettings(app, md5, RefconStudent, RefconTeacher);
logout(app);
eventpayment(app, request, RefconEvent);
examfee(app, RefconStudent,RefconExamFee);
examfeepayment(app, request, RefconExamFee);
report(app, RefconReport, sendDateTime);
admin(app, md5, RefconTeacher, RefconReport);
seatingorder(app, RefconStudent, StudentQueue, CheckBoolean, SeatingOrder);

//=====================================================================================================================

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => { console.log(`Server started running on port ${PORT}`); });