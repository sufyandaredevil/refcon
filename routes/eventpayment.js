//jshint esversion:10
const _ = require('lodash');
module.exports = (app, request, RefconEvent) => {

    const paystack = (request) => {
        const MySecretKey = 'Bearer sk_test_a17f97372c04e9b2e92560c84b64b560536bf58d';
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
    
    app.post('/eventpayment', (req, res) => {
        const form = {};
        form.email = req.body.id+"@refcon.com";
        form.amount = (req.body.amount)*100;

        initializePayment(form, (error, body)=>{
            if(error){
                //handle errors
                console.log(error);
           }
           response = JSON.parse(body);
           res.redirect(response.data.authorization_url);
        });
    });
    
    app.get('/eventpayment/callback', (req,res) => {
        const ref = req.query.reference;
        verifyPayment(ref, (error,body) => {
            if(error){
                console.log(error);
                return res.render('oops');
            }
            else{
                response = JSON.parse(body);
                
                const tokenId = response.data.reference.slice(0,5).toUpperCase();
                const eventId = ((_.at(response.data, ['customer.email']))[0]).slice(0, ((_.at(response.data, ['customer.email']))[0]).lastIndexOf('@'));
                
                RefconEvent.findOne({_id: eventId}, (err, data) => {
                    if(data){
                        data.rollNumbers.push(req.session.user.rollNumber);
                        data.tokenId.push(tokenId);
                        if(data.registered === undefined){
                            data.registered = 1;
                        }
                        else{
                            data.registered = String(parseInt(data.registered)+1);
                        }
                        data.save();
                    }
                    res.render("sent", { message: 'Event ID generated!', goback: "event" });
                });
            }
        });
    });

};