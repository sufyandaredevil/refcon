//jshint esversion:10

module.exports = (app, RefconMessage) => {

    app.get('/studenteacherdiscussion', (req, res) => {
        if(!req.session.user){
            res.render('login', {typerror: "You haven't logged in or your're session might have ended", success: ""});
        }
        else{
            var questionTitle = [];
            var question = [];
            var date = [];
            var to = [];
            var answer = [];
            var repliedDate = [];
            var messageID = [];
            var fromID = [];
    
            if(req.session.user.type === 'student'){
                RefconMessage.find({}, (err, data) => {
                    for(var i = 0; i < data.length; i++){
                        if(data[i].fromID === req.session.user.rollNumber){
                            questionTitle.push(data[i].questionTitle);
                            question.push(data[i].question);
                            date.push(data[i].date);
                            to.push(data[i].to);
                            answer.push(data[i].answer);
                            repliedDate.push(data[i].repliedDate);
                            messageID.push(data[i]._id);
                        }
                    }
                    res.render('studenteacherdiscussion', { type: req.session.user.type, questionTitle: questionTitle, question: question, date: date, fromID: "", to: to, answer: answer, repliedDate: repliedDate, messageID: messageID});
                });
            }
            else if(req.session.user.type === 'teacher'){
                RefconMessage.find({}, (err, data) => {
                    for(var i = 0; i < data.length; i++){
                        if(data[i].to === req.session.user.facultyid){
                            questionTitle.push(data[i].questionTitle);
                            question.push(data[i].question);
                            date.push(data[i].date);
                            answer.push(data[i].answer);
                            fromID.push(data[i].fromID);
                            repliedDate.push(data[i].repliedDate);
                            messageID.push(data[i]._id);
                        }
                    }
                    res.render('studenteacherdiscussion', { type: req.session.user.type, questionTitle: questionTitle, question: question, date: date, fromID: fromID, to: "", answer: answer, repliedDate: repliedDate, messageID: messageID});
                });
            }
        }
    });

    app.get('/studenteacherdiscussiondelete/:messageId', (req, res) => {
        if(req.session.user.type === 'student'){
            RefconMessage.deleteOne({_id: req.params.messageId}, (err, data) => {
                if(data.deletedCount === 1){
                    res.redirect('/studenteacherdiscussion');
                }else{
                    res.render('oops');
                }
            });
        }
    });

};