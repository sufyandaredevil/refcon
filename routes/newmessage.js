//jshint esversion:10

module.exports = (app, RefconMessage, RefconTeacher, sentDateTime) => {

    app.get('/newmessage', (req, res) => {
        if(req.session.user){
            var availableTeachers = [];
            var availableFacultyIDs = [];
    
            RefconTeacher.find({type: 'teacher'}, (err, data) => {
                for(var i = 0; i < data.length; i++){
                    availableTeachers.push(data[i].fullName);
                    availableFacultyIDs.push(data[i].facultyid);
                }
                res.render('newmessage', {typerror:"", success: "", availableTeachers: availableTeachers, availableFacultyIDs: availableFacultyIDs});
            });
        }
        else{
            res.render('login', {typerror: "You haven't logged in or your're session might have ended", success: ""});
        }
    });
    
    app.post('/newmessage', (req, res) => {
        if(req.session.user){
            var availableTeachers = [];
            var availableFacultyIDs = [];
    
            if(req.body.teacherFacultyID != "none"){
                const newRefconMessage = new RefconMessage({
                    questionTitle: req.body.questionTitle,
                    question: req.body.question,
                    date: sentDateTime(),
                    to: req.body.teacherFacultyID,
                    fromID: req.session.user.rollNumber
                });
                newRefconMessage.save();
            }
            else{
                RefconTeacher.find({type: 'teacher'}, (err, data) => {
                    for(var i=0; i<data.length; i++){
                        availableTeachers.push(data[i].fullName);
                        availableFacultyIDs.push(data[i].facultyid);
                    }
                    res.render('newmessage', {typerror:"Select a teacher!", success: "", availableTeachers: availableTeachers, availableFacultyIDs: availableFacultyIDs});
                });
            }
            RefconTeacher.find({type: 'teacher'}, (err, data) => {
                for(var i=0; i<data.length; i++){
                    availableTeachers.push(data[i].fullName);
                    availableFacultyIDs.push(data[i].facultyid);
                }
                res.redirect('/studenteacherdiscussion');
            });
        }
        else{
            res.render('login', {typerror: "You haven't logged in or your're session might have ended", success: ""});
        }
    });
    
};