//jshint esversion:10

module.exports = (app, RefconMessage, sentDateTime) => {

    app.get("/message/:messageID", (req, res) => {
        if(req.session.user){
            RefconMessage.findOne({_id: req.params.messageID}, function(err, message){
                if(message){
                    res.render("message", { success: "", type: req.session.user.type, messageID: message._id, repliedDate: message.repliedDate,questionTitle: message.questionTitle, question: message.question ,answer: message.answer});
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
    
    app.post("/message/:messageId", (req, res) => {
        if(req.session.user){
            RefconMessage.findOne({_id: req.body.messageId}, (err, data) => {
                if(data){
                    data.answer = req.body.answer;
                    data.repliedDate = sentDateTime();
                    data.save();
                    res.render('sent', { message: "Message sent successfully!" , goback: "studenteacherdiscussion"});
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
    
};