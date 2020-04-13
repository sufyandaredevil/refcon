//jshint esversion:10

module.exports = (app, md5, RefconStudent, RefconTeacher) => {

    app.get('/register', (req, res) => {
        if(!req.session.user){
            res.render("register",{ typerror: "" });
        }
        else{
            res.render('overview', {name: req.session.user.fullName});
        }
    });

    app.post('/register', (req, res) => {
        if(!req.session.user){console.log(req.body);
            
            if(req.body.type ===  undefined){
                res.render("register", { typerror: "Select which type you belong to" });
            }
            else if(req.body.type === 'student' && req.body.department === undefined){
                res.render("register", { typerror: "Select your department" });
            }
            else if(req.body.type === 'student'){

                const depCodes = {
                    CIVIL: "103",
                    CSE: "104",
                    ECE: "106",
                    EEE: "105",
                    IT: "205",
                    MECH: "114"
                };

                const genRollNumber = "1101"+req.body.yearOfJoining.substring(2)+depCodes[req.body.department]+req.body.rollNumber;

                RefconStudent.findOne({$or: [{email: (req.body.email)}, {rollNumber: (req.body.rollNumber)}]}, (err, data) => {
                    if(err){
                        console.log(err);
                    }
                    else{
                        if(data){
                            res.render("register", { typerror: "Email ID / Registration number already exists" });
                        }
                        else{
                            const newRefconStudent = new RefconStudent({
                                fullName: req.body.fullName,
                                phoneNumber: req.body.phoneNumber,
                                collegeName: req.body.collegeName,
                                rollNumber: genRollNumber,
                                email: req.body.email,
                                password: md5(req.body.password),
                                type: req.body.type,
                                department: (req.body.department).toUpperCase(),
                                year: req.body.year
                            });
                            newRefconStudent.save();
                            res.render("login", { typerror: "", success: "User Account created Successfully!"});   
                        }            
                    }
                });
            }
            else if(req.body.type === 'teacher'){
                RefconTeacher.findOne({$or: [{email: (req.body.email)}, {facultyid: (req.body.facultyid)}]}, (err, data) => {
                    if(err){
                        console.log(err);
                    }
                    else{
                        if(data){
                            res.render("register", { typerror: "Email ID / Faculty ID already exists" });
                        }
                        else{
                            const newRefconTeacher = new RefconTeacher({
                                fullName: req.body.fullName,
                                phoneNumber: req.body.phoneNumber,
                                collegeName: req.body.collegeName,
                                facultyid: req.body.facultyid,
                                email: req.body.email,
                                password: md5(req.body.password),
                                type: req.body.type
                            });
                            newRefconTeacher.save();
                            res.render("login", { typerror: "", success: "User Account created Successfully!"});   
                        }            
                    }
                });
            }
        }
    });
    
};