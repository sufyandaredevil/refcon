//jshint esversion:10

module.exports = (app, RefconReport, sendDateTime) => {

    app.get('/report', (req, res) => {
        if(!req.session.user){
            res.render('login', {typerror: "You're not logged in or you're session might have ended.", success: ""});
        }
        else if(req.session.user.type === 'student' || req.session.user.type === 'teacher'){
            RefconReport.find({}, (err,data)=> {
                if(data){
                    if(req.session.user.type === 'teacher'){
                        res.render('report', { data: data , id: req.session.user.facultyid});
                    }
                    else if(req.session.user.type === 'student'){
                        res.render('report', { data: data , id: req.session.user.rollNumber});
                    }
                }
            });
        }
    });

    app.get('/reportspace', (req, res) => {
        if(!req.session.user){
            res.render('login', {typerror: "You're not logged in or you're session might have ended.", success: ""});
        }
        else if(req.session.user.type === 'student'){
            res.render('reportspace', {type: req.session.user.type, id: req.session.user.rollNumber});
        }
        else if(req.session.user.type === 'teacher'){
            res.render('reportspace', {type: req.session.user.type, id: req.session.user.facultyid});
        }
    });

    app.post('/reportspace', (req, res) => {
        const newRefconReport = new RefconReport({
            report: req.body.report,
            reportType: req.body.reportType,
            reportTitle: req.body.reportTitle,
            date: sendDateTime(),
            fromId: req.body.fromId,
            fromType: req.body.fromType,
        });
        newRefconReport.save();
        res.render('sent', { message: "Report Submitted successfully", goback: 'report'});
    });

    app.get('/reportdelete/:reportId', (req, res) => {
        if(!req.session.user){
            res.render('login', {typerror: "You're not logged in or you're session might have ended.", success: ""});
        }
        else if(req.session.user.type === 'student'){
            RefconReport.findOne({_id: req.params.reportId}, (err, data) => {
                if(req.session.user.rollNumber === data.fromId){
                    RefconReport.deleteOne({_id: req.params.reportId}, (err, result) =>{
                        if(result.deletedCount === 1){
                            res.redirect('/report');
                        }
                    });
                }
                else{
                    res.redirect('/report');
                }
            });
        }
        else if(req.session.user.type === 'teacher'){
            RefconReport.findOne({_id: req.params.reportId}, (err, data) => {
                if(req.session.user.facultyid === data.fromId){
                    RefconReport.deleteOne({_id: req.params.reportId}, (err, data) =>{
                        if(data.deletedCount === 1){
                            res.redirect('/report');
                        }
                    });
                }
                else{
                    res.redirect('/report');
                }
            });
        }
    });

    app.get('/report/:reportId', (req, res) => {
        if(!req.session.user){
            res.render('login', {typerror: "You haven't logged in or your're session might have ended", success: ""});
        }
        else{
            RefconReport.findOne({_id: req.params.reportId}, (err, data) => {
                if(data){
                    res.render('reportinfo', {data: data});
                }
                else{
                    res.render('oops');
                }
            });
        }
    });

};