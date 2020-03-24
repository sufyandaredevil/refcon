//jshint esversion:10

module.exports = (app,md5, RefconStudent, RefconTeacher) => {
    app.get("/accountsettings", (req, res) => {
        if(!req.session.user){
            res.render('login', {typerror: "You haven't logged in or your're session might have ended", success: ""});
        }
        else{
            res.render('accountsettings',{ typerror: "" , success: ""});
        }
    });
    
    app.post("/accountsettings", (req, res) => {
        if(!req.session.user){
            res.render('login', {typerror: "You haven't logged in or your're session might have ended", success: ""});
        }
        else if(req.body.type === 'none'){
            res.render('accountsettings', { typerror: "Please select a valid option" , success: ""});
        }
        else if(((req.body.type === 'name') && (req.body.fullName === "")) || ((req.body.type === 'password') && ((req.body.currentPassword === "") && (req.body.newPassword === ""))) || ((req.body.type === 'phoneNumber') && (req.body.phoneNumber === ""))){
            res.render('accountsettings', { typerror: "You didn't enter the data!" , success: ""});
        }
        else{
            if(req.session.user.type === 'student'){
                RefconStudent.findOne({_id: req.session.user._id}, (err, data) => {
                    if(err){
                        res.send("500 Internal Server Error");
                    }
                    else{
                        if(req.body.type === 'name'){
                            data.fullName = req.body.fullName;
                            data.save();
                            req.session.user.fullName = data.fullName;
                            res.render('accountsettings', { typerror: "" , success: "Name changed successfully!"});
                        }
                        else if(req.body.type === 'password'){
                            if(data.password === md5(req.body.currentPassword)){
                                data.password = md5(req.body.newPassword);
                                data.save();
                                req.session.user.password = data.password;
                                res.render('accountsettings', { typerror: "" , success: "Password changed successfully!"});
                            }
                            else{
                                res.render('accountsettings', { typerror: "You entered the wrong password!" , success: ""});
                            }
                        }
                        else if(req.body.type === 'phoneNumber'){
                            data.phoneNumber = req.body.phoneNumber;
                            data.save();
                            req.session.user.phoneNumber = data.phoneNumber;
                            res.render('accountsettings', { typerror: "" , success: "Phone Number changed successfully!"});
                        }
                    }
                });
            }
            else if(req.session.user.type === 'teacher'){
                RefconTeacher.findOne({_id: req.session.user._id}, (err, data) => {
                    if(err){
                        res.write("500 Internal Server Error");
                    }
                    else{
                        if(req.body.type === 'name'){
                            data.fullName = req.body.fullName;
                            data.save();
                            req.session.user.fullName = data.fullName;
                            res.render('accountsettings', { typerror: "" , success: "Name changed successfully!"});
                        }
                        else if(req.body.type === 'password'){
                            if(data.password === md5(req.body.currentPassword)){
                                data.password = md5(req.body.newPassword);
                                data.save();
                                req.session.user.password = data.password;
                                res.render('accountsettings', { typerror: "" , success: "Password changed successfully!"});
                            }
                            else{
                                res.render('accountsettings', { typerror: "You entered the wrong password!" , success: ""});
                            }
                        }
                        else if(req.body.type === 'phoneNumber'){
                            data.phoneNumber = req.body.phoneNumber;
                            data.save();
                            req.session.user.phoneNumber = data.phoneNumber;
                            res.render('accountsettings', { typerror: "" , success: "Phone Number changed successfully!"});
                        }
                    }
                });
            }
        }
    });
};