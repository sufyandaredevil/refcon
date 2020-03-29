//jshint esversion:10

module.exports = (app, md5, RefconTeacher, RefconReport) => {

    app.get(["/admin", "/adminlogin"], (req, res) => {
        if(!req.session.user){
            res.render('adminlogin', { typerror: "" });
        }
        else if(req.session.user.type === 'admin'){
            res.redirect('/adminoverview');
        }

    });

    app.post(["/admin", "/adminlogin"], (req, res) => {
        RefconTeacher.findOne({$and: [{email: req.body.username}, {password: md5(req.body.password)}, {type: 'admin'}]}, (err, data) => {

            if(data){
                req.session.user = data;
                res.redirect('/adminoverview');
            }
            else{
                res.render('adminlogin', { typerror: "Incorrect Username or Password."});
            }
        });
    });



    app.get('/adminreport', (req, res) => {
        if(!req.session.user){
            res.render('adminlogin', {typerror: "You're not logged in or you're session might have ended."});
        }
        else if(req.session.user.type === "admin"){

            RefconReport.find({}, (err, data)=> {
                if(data){
                    res.render('adminreport', { data: data });
                }
            });
        }
    });

    app.get('/adminreport/:reportId', (req, res) => {
        if(!req.session.user){
            res.render('login', {typerror: "You haven't logged in or your're session might have ended", success: ""});
        }
        else if(req.session.user.type === 'admin'){
            RefconReport.findOne({_id: req.params.reportId}, (err, data) => {
                if(data){
                    res.render('adminreportinfo', {data: data});
                }
                else{
                    res.render('oops');
                }
            });
        }
    });

    app.post('/adminreportinfo', (req, res) => {
        if(!req.session.user){
            res.render('adminlogin', {typerror: "You're not logged in or you're session might have ended."});
        }
        else if(req.session.user.type === 'admin'){
            RefconReport.findOne({_id: req.body.id}, (err, data) => {
                data.answer = req.body.btnType;
                data.save((err, data) => {
                    if(data){
                        res.redirect(`/adminreport/${req.body.id}`);
                    }
                    else{
                        res.render('oops');
                    }
                });
            });
        }
    });



    app.get('/adminaccountsettings', (req, res) => {
        if(!req.session.user){
            res.render('adminlogin', {typerror: "You're not logged in or you're session might have ended."});
        }
        else if(req.session.user.type === 'admin'){
            res.render('adminaccountsettings', { typerror: "", success: "" });
        }
    });




    app.post("/adminaccountsettings", (req, res) => {
        if(!req.session.user){
            res.render('adminlogin', {typerror: "You're not logged in or you're session might have ended."});
        }
        else if(req.body.type === 'none'){
            res.render('adminaccountsettings', { typerror: "Please select a valid option" , success: ""});
        }
        else if(((req.body.type === 'name') && (req.body.fullName === "")) || ((req.body.type === 'password') && ((req.body.currentPassword === "") && (req.body.newPassword === ""))) || ((req.body.type === 'phoneNumber') && (req.body.phoneNumber === ""))){
            res.render('adminaccountsettings', { typerror: "You didn't enter the data!" , success: ""});
        }
        else{
            if(req.session.user.type === 'admin'){
                RefconTeacher.findOne({_id: req.session.user._id}, (err, data) => {
                    if(err){
                        res.send("500 Internal Server Error");
                    }
                    else{
                        if(req.body.type === 'name'){
                            data.fullName = req.body.fullName;
                            data.save();
                            req.session.user.fullName = data.fullName;
                            res.render('adminaccountsettings', { typerror: "" , success: "Name changed successfully!"});
                        }
                        else if(req.body.type === 'password'){
                            if(data.password === md5(req.body.currentPassword)){
                                data.password = md5(req.body.newPassword);
                                data.save();
                                req.session.user.password = data.password;
                                res.render('adminaccountsettings', { typerror: "" , success: "Password changed successfully!"});
                            }
                            else{
                                res.render('adminaccountsettings', { typerror: "You entered the wrong password!" , success: ""});
                            }
                        }
                        else if(req.body.type === 'phoneNumber'){
                            data.phoneNumber = req.body.phoneNumber;
                            data.save();
                            req.session.user.phoneNumber = data.phoneNumber;
                            res.render('adminaccountsettings', { typerror: "" , success: "Phone Number changed successfully!"});
                        }
                    }
                });
            }
        }
    });

    app.get('/adminoverview', (req, res) => {
        if(!req.session.user){
            res.render('adminlogin', {typerror: "You're not logged in or you're session might have ended."});
        }
        else if(req.session.user.type === 'admin'){
            res.render('adminoverview', { name: req.session.user.type });
        }
    });

    app.get('/adminlogout', (req, res) => {
        req.session.destroy((err) => {
            if(err){
                res.send("500 Internal Server Error");
            }
            res.redirect("/admin");
        });
    });
    
};