//jshint esversion:10

module.exports = (app, RefconStudent, RefconInternalMark) => {

    app.get("/internalmark", (req, res) => {
        if(!req.session.user){
            res.render('login', {typerror: "You haven't logged in or your're session might have ended", success: ""});
        }
        else if(req.session.user.type === 'teacher'){
            RefconInternalMark.find({facultyid: req.session.user.facultyid}, (err, data) => {
                res.render('internalmark', { type: req.session.user.type, data: data, internalNumbers: "" });
            });
        }
        else if(req.session.user.type === 'student'){
            var internalNumbers = [];
            var marks = [];

            RefconInternalMark.find({$and: [{department: req.session.user.department}, {year: req.session.user.year}]}, (err, data) =>{
                if(data){
                    for(var i=0; i<data.length; i++){
                        if(!(internalNumbers.includes(data[i].internalNumber))){
                            internalNumbers.push(data[i].internalNumber);
                        }
                        for(var j=0; j<data[i].rollNumbers.length; j++){
                            if(data[i].rollNumbers[j] === req.session.user.rollNumber){
                                data[i].marks = data[i].marks[j];
                                break;
                            }
                        }
                        marks.push({mark: data[i].marks[0], subjectName: data[i].subjectName, subjectCode: data[i].subjectCode, internalNumber: data[i].internalNumber});
                    }
                    res.render('internalmark', { type: req.session.user.type, data: marks, internalNumbers: internalNumbers });
                }
                else{
                    res.render('internalmark', { type: req.session.user.type, data: "", internalNumbers: "" });
                }
            });
        }
    });

    app.get('/internaldelete/:internalId', (req, res) => {
        RefconInternalMark.deleteOne({_id: req.params.internalId}, (err, data) => {
            if(data.deletedCount === 1){
                res.render('sent', {message: "Internal Mark Space Deleted", goback: "internalmark"});
            }
        });
    });

    app.get('/internalmarkspace', (req, res) => {
        if(!req.session.user){
            res.render('login', {typerror: "You haven't logged in or your're session might have ended", success: ""});
        }
        else if(req.session.user.type === 'teacher'){
            res.render('internalmarkspace', {typerror: ""});
        }
    });

    app.post('/internalmarkspace', (req, res) => {
        if(req.session.user.type === 'teacher'){
            const internalNumber = req.body.internalNumber;
            const department = (req.body.department).toUpperCase();
            const subjectName = req.body.subjectName;
            const subjectCode = (req.body.subjectCode).toUpperCase();
            const year = req.body.year;
            const semester = req.body.semester;
            const facultyid = req.session.user.facultyid;
            
            const rollNumbers = [];

            RefconInternalMark.findOne({$and: [{department: department}, {year: year}, {internalNumber: internalNumber}, {subjectName: subjectName}, {subjectCode: subjectCode}, {semester: semester}, {facultyid: facultyid} ]}, (err, d) => {

                if(d){

                    res.render('internalmarkspace',{ typerror: `${subjectName}(${subjectCode}) Mark Space already exists!` });

                }
                else{

                    RefconStudent.find({$and: [{department: department}, {year: year}]}).sort('rollNumber').exec((err, data) => {
                        if(data.length != 0){
                            for(var i=0; i<data.length; i++){
                                rollNumbers.push(data[i].rollNumber);
                            }
        
                            const newRefconInternalMark = new RefconInternalMark({
                                internalNumber: internalNumber,
                                department: department,
                                subjectName: subjectName,
                                subjectCode: subjectCode,
                                year: year,
                                semester: semester,
                                facultyid: facultyid,
                            });
                            newRefconInternalMark.save((err, data) => {
                                res.render('internalmarktable', {semester: semester, id: data._id, subjectName: subjectName, department: department.toUpperCase(), year: year, internalNumber: internalNumber, rollNumbers: rollNumbers});                    
                            });
                        }
                        else{
                            res.render('internalmarkspace',{ typerror: "No students found for the given Department and Year" });
                        }
                    });

                }

            });

        }
    });

    app.post('/internalmarktable', (req, res) => {
        RefconInternalMark.findOne({_id: req.body.id}, (err, data) => {
            for(var i=0; i<(req.body.rollNumbers).length; i++){
                data.rollNumbers.push(req.body.rollNumbers[i]);
                data.marks.push(req.body.marks[i]);
            }
            data.save();
            res.render('sent', {message: "Mark Space submitted successfully!", goback: "internalmark"});
        });
    });
};