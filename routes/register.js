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
        if(!req.session.user){
        if(req.body.type === 'student'){
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
                            rollNumber: req.body.rollNumber,
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