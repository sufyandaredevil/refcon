//jshint esversion:10

module.exports = (app, RefconStudent, RefconEvent) => {

    app.get('/event', (req, res) => {
        if(req.session.user){
            if(req.session.user.type === 'teacher'){
                RefconEvent.find({}, (err, data) => {        
                    res.render('event', {data: data, type: req.session.user.type});
                });  
            }
            else if(req.session.user.type === 'student'){
                RefconEvent.find({}, (err, data) => {                        
                    res.render('event', {data: data, type: req.session.user.type, rollNumber: req.session.user.rollNumber });
                });
            }
        }
        else{
            res.render('login', {typerror: "You haven't logged in or your're session might have ended", success: ""});
        }
    });

    app.get('/eventspace', (req, res) => {
        if(req.session.user){
            if(req.session.user.type === 'teacher'){
                res.render('eventspace');
            }
            else{
                res.redirect('event');
            }
        }
        else{
            res.render('login', {typerror: "You haven't logged in or your're session might have ended", success: ""});
        }
    });

    app.post('/eventspace', (req, res) => {
        if(req.session.user.type === 'teacher'){
            const newRefconEvent = new RefconEvent({
                eventName: req.body.eventName,
                eventDescription: req.body.eventDescription,
                participantType: req.body.participantType,
                yearType: typeof(req.body.yearType) === typeof('') ? req.body.yearType : req.body.yearType.join(', '),
                venue: req.body.venue,
                date: req.body.date,
                time: req.body.time,
                prizes: req.body.prizes,
                fee: req.body.fee,
            });
            newRefconEvent.save();
            res.render('sent', {message: "Event posted successfully!", goback: "event"});
        }
        else{
            res.redirect('event');
        }
        
    });

    app.get('/event/:eventID', (req, res) => {
        if(req.session.user){
            RefconEvent.findOne({_id: req.params.eventID}, (err, data) => {
                if(data){
                    res.render('eventinfo', {rollNumber: req.session.user.rollNumber, data: data, type: req.session.user.type});
                }
                else{
                    res.render('oops');
                }
            });
        }
        else{
            res.render('login', {typerror: "You haven't logged in or your're session might have ended", success: ""});
        }
    });

    app.get('/eventverify', (req, res) => {
        if(req.session.user){
            if(req.session.user.type === 'teacher'){
                res.render('eventverify', {found: "", fullName: "", department: "", year: "", rollNumber: "", eventName: "" });
            }
            else{
                res.redirect('event');
            }
        }
        else{
            res.render('login', {typerror: "You haven't logged in or your're session might have ended", success: ""});
        }
    });

    app.post('/eventverify', (req, res) => {
        if(req.session.user){
            if(req.session.user.type === 'teacher'){
                var eventName = "";
                var rollNumber = "";
                var fullName = "";
                var department = "";
                var year = "";
                var tid = "";
                console.log(req.body.tokenId);

                RefconEvent.find({}, (err, data) => {
                    for( var i=0 ; i<data.length ; i++){
                        if(data[i].tokenId.indexOf(req.body.tokenId.toUpperCase()) !=-1){
                            tid = req.body.tokenId.toUpperCase();
                            eventName = data[i].eventName;
                            rollNumber = data[i].rollNumbers[data[i].tokenId.indexOf(req.body.tokenId.toUpperCase())];
                            found=1;
                            break;
                        }
                    }

                    RefconStudent.findOne({rollNumber: rollNumber}, (err, result) => {
                        if(result){console.log(tid);
                            fullName = result.fullName;
                            department = result.department;
                            year = result.year;
                            res.render('eventverify', {tid: tid, found: "true", fullName: fullName, department: department, year: year, rollNumber: rollNumber, eventName: eventName });
                        }
                        else{console.log(tid+"anerror");
                            res.render('eventverify', {tid: tid, found: "false", fullName: fullName, department: department, year: year, rollNumber: rollNumber, eventName: eventName });
                        }
                        found = 0;
                    });

                });
            }
        }
        else{
            res.render('login', {typerror: "You haven't logged in or your're session might have ended", success: ""});
        }
    });

    app.get('/eventdelete/:eventId', (req, res) => {
        if(req.session.user.type === 'teacher'){
            RefconEvent.deleteOne({_id: req.params.eventId}, (err, data) => {
                if(data.deletedCount === 1){
                    res.render('sent', {message: "Event Space Deleted", goback: "event"});
                }else{
                    res.render('oops');
                }
            });
        }
    });

};