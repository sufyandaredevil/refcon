//jshint esversion:10

module.exports = (app) => {

    app.get('/overviewt', (req, res) => {
        if(!req.session.user){
            res.render('login', { typerror: "You haven't logged in or your're session might have ended" , success: ""});
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
    
    app.get('/overview', (req, res) =>{
        if(!req.session.user){
            res.render('login', { typerror: "You haven't logged in or your're session might have ended" , success: ""});
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

};