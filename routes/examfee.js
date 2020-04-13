//jshint esversion:10
const Nexmo = require('nexmo');

const nexmo = new Nexmo({
    apiKey: "a199a5be",
    apiSecret: "IlCWTjUhr4FnG3jI",
});


module.exports = (app, RefconStudent, RefconExamFee) => {

    app.get('/examfee', (req, res) => {
        if(!req.session.user){
            res.render('login', {typerror: "You haven't logged in or your're session might have ended", success: ""});
        }
        else if(req.session.user.type === 'teacher'){

            RefconExamFee.find({facultyid: req.session.user.facultyid}, (err, data) => {
                if(data){
                    res.render('examfee', {type: req.session.user.type, data: data});
                }
            });
        }
        else if(req.session.user.type === 'student'){
            RefconExamFee.findOne({$and: [{department: req.session.user.department}, {year: req.session.user.year}]}, (err, data) => {
                if(data){
                    const arrearCount = data.arrearCount[data.rollNumbers.indexOf(req.session.user.rollNumber)];
                    const isPaid = data.isPaid[data.rollNumbers.indexOf(req.session.user.rollNumber)];
                    res.render('examfee', { fee: (parseInt(arrearCount)+parseInt(data.currentSemesterSubjectCount))*150 , arrearCount: arrearCount, isPaid: isPaid, type: req.session.user.type, data: data });
                }
                else{
                    res.render('examfee', { fee: "", arrearCount: "", isPaid: "", type: req.session.user.type, data: data });
                }
            });
        }
    });

    app.get('/examfeespace', (req, res) => {
        if(!req.session.user){
            res.render('login', {typerror: "You haven't logged in or your're session might have ended", success: ""});
        }
        else if(req.session.user.type === 'teacher'){
            res.render('examfeespace', {typerror: ""});
        }
    });


    app.post('/examfeespace', (req, res) => {
        if(req.session.user.type === 'teacher'){
            const semesterNumber = req.body.semesterNumber;
            const department = req.body.department;
            const currentSemesterSubjectCount = req.body.currentSemesterSubjectCount;
            const year = req.body.year;
            const facultyid = req.session.user.facultyid;

            var rollNumbers = [];
            var phoneNumbers = [];

            RefconExamFee.findOne({$and: [{department: department}, {year: year}]}, (err, d) => {
                
                if(d){
                    res.render('examfeespace',{ typerror: `${department}, ${year} year Payment Space already exists!` });
                }
                else{

                    RefconStudent.find({$and: [{department: department}, {year: year}]}).sort('rollNumber').exec((err, data) => {
                        if(data.length != 0){
                            for(var i=0; i<data.length; i++){
                                rollNumbers.push(data[i].rollNumber);
                                phoneNumbers.push(data[i].phoneNumber);
                            }
        
                            var isPaid = new Array(rollNumbers.length);
                            isPaid.fill("");
        
                            const newRefconExamFee = new RefconExamFee({
                                semesterNumber: semesterNumber,
                                department: department,
                                year: year,
                                isPaid: isPaid,
                                currentSemesterSubjectCount: currentSemesterSubjectCount,
                                facultyid: facultyid,
                                rollNumbers: rollNumbers,
                                phoneNumbers: phoneNumbers,
                            });
                            newRefconExamFee.save((err, data) => {
                                res.render('examfeetable', {semesterNumber: semesterNumber, currentSemesterSubjectCount: currentSemesterSubjectCount,id: data._id, department: department, year: year, rollNumbers: rollNumbers});                    
                            });
                        }
                        else{
                            res.render('examfeespace',{ typerror: "No students found for the given Department and Year" });
                        }
                    });

                }

            });

        }
    });


    app.post('/examfeetable', (req, res) => {
        if(req.session.user.type === 'teacher'){
            RefconExamFee.findOne({_id: req.body.id}, (err, data) => {
                data.arrearCount = req.body.arrearCount;
                data.save((err, data) => {
                    if(data){
                        res.render('sent', {message: 'Payment Space Created', goback: "examfee"});
                    }
                });
            });
        }
    });

    app.get('/examfeedelete/:examId', (req, res) => {
        if(req.session.user.type === 'teacher'){
            RefconExamFee.deleteOne({_id: req.params.examId}, (err, data) => {
                if(data.deletedCount === 1){
                    res.render('sent', {message: "Payment Space Deleted", goback: "examfee"});
                }else{
                    res.render('oops');
                }
            });
        }
    });

    app.get('/notify/:examId', (req, res) => {
        if(req.session.user.type === 'teacher'){
            RefconExamFee.findOne({_id: req.params.examId}, (err, data) => {
                for( var i=0; i<data.rollNumbers.length; i++){
                    if(data.isPaid[i] === ""){
//to change implementation style
                        nexmo.message.sendSms(from='REFCON', "91"+data.phoneNumbers[i], "REFCON: info. to pay exam fee. Details: ("+ data.currentSemesterSubjectCount+ "+" +data.arrearCount[i] +") Subjects = "+String((parseInt(data.arrearCount[i])+parseInt(data.currentSemesterSubjectCount))*150)+ " Rupees", (err, responseData) => {
                            // if (err) {
                            //     console.log(err);
                            // } else {
                            //     if(responseData.messages[0].status === "0") {
                            //         console.log("Message sent successfully.");
                            //     } else {
                            //         console.log(`Message failed with error: ${responseData.messages[0]['error-text']}`);
                            //     }
                            // }
                        });
                    }
                }
                res.render('sent',{ message: "Message sent successfully",  goback: "examfee"});
            });
        }
    });

};