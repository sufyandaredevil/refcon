//jshint esversion:10

module.exports = (app, md5, RefconStudent, RefconTeacher) => {

    app.get(["/", "/login"], (req, res) => {
        if(!req.session.user){
            res.render('login', {typerror: "", success: ""});
        }
        else{
            if(req.session.user.type === 'student'){
                res.render('overview', {name: req.session.user.fullName});
            }
            else if(req.session.user.type === 'teacher'){
                res.render('overviewt', {name: req.session.user.fullName});
            }
        }
    });

    app.post(["/", "/login"], (req, res) => {
        const email = req.body.email;
        const password = md5(req.body.password);
    
        if(!req.session.user){
            RefconStudent.findOne({$and: [{email: email}, {password: password}]}, (err, data) => {
            if(err){
                console.log(err);
            }
            else{
                if(data){                        
                    req.session.user = data;
                    res.render('overview', {name: req.session.user.fullName});
                }
                else{
                    RefconTeacher.findOne({$and: [{email: email}, {password: password}]}, (err, data) => {
                        if(err){
                            console.log(err);
                        }
                        else{
                            if(data){                
                                req.session.user = data;
                                res.render('overviewt', {name: req.session.user.fullName});
                            }
                            else{
                                res.render('login', { typerror: "Incorrect Email ID or password." , success: ""});
                            }            
                        }
                        });
                }            
            }
            });
        }
        else{
            res.render('overview', {name: req.session.user.fullName});
        }
    });
    
};