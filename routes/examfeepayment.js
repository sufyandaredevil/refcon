//jshint esversion:10

const _ = require('lodash');

module.exports = (app, request, RefconExamFee) => {
    const paystack = (request) => {
        const MySecretKey = 'Bearer sk_test_12baff4d2a7eacca6fd033bea318404a68b0a8fc';
        const initializePayment = (form, mycallback) => {
            const options = {
                url : 'https://api.paystack.co/transaction/initialize',
                headers : {
                    authorization: MySecretKey,
                    'content-type': 'application/json',
                    'cache-control': 'no-cache'
                },
               form
            };
            const callback = (error, response, body) => {
                return mycallback(error, body);
            };
            request.post(options,callback);
        };
        
        const verifyPayment = (ref, mycallback) => {
            const options = {
                url : 'https://api.paystack.co/transaction/verify/'+encodeURIComponent(ref),
                headers : {
                    authorization: MySecretKey,
                    'content-type': 'application/json',
                    'cache-control': 'no-cache'
               }
            };
            const callback = (error, response, body)=>{
                return mycallback(error, body);
            };
            request(options,callback);
        };
        return { initializePayment, verifyPayment };
    };
    
    const {initializePayment, verifyPayment} = paystack(request);

    app.post('/examfeepayment', (req, res) => {
        const form = {};
        form.email = req.body.id+"@refcon.com";
        form.amount = (req.body.amount)*100;

        initializePayment(form, (error, body) => {
            if(error){
                //handle errors
                console.log(error);
           }
           response = JSON.parse(body);
           res.redirect(response.data.authorization_url);
        });
    });
    
    app.get('/examfeepayment/callback', (req,res) => {
        const ref = req.query.reference;
        verifyPayment(ref, (error,body) => {
            if(error){

                console.log(error);
                return res.render('oops');
            }
            else{
                response = JSON.parse(body);
                
                const examId = ((_.at(response.data, ['customer.email']))[0]).slice(0, ((_.at(response.data, ['customer.email']))[0]).lastIndexOf('@'));
                RefconExamFee.findOne({_id: examId}, (err, data) => {
                    if(data){
                        data.isPaid[data.rollNumbers.indexOf(req.session.user.rollNumber)] = "Paid";
                        data.markModified('isPaid');
                        data.save();
                        res.redirect('/examfee');
                    }
                });
            }
        });
    });

};