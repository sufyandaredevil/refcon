//jshint esversion:10

module.exports = (app, RefconStudent, StudentQueue, CheckBoolean, SeatingOrder) => {

    app.get('/seatingorder', (req, res) => {
        
        if(!req.session.user){
            res.render('login', {typerror: "You haven't logged in or your're session might have ended", success: ""});
        }
        else if(req.session.user.type === 'teacher'){

            res.render('seatingorder');

        }
        else if(req.session.user.type === 'student'){



        }

    });

    app.get('/seatingorderspace', (req, res) => {

        if(!req.session.user){
            res.render('login', {typerror: "You haven't logged in or your're session might have ended", success: ""});
        }
        else if(req.session.user.type === 'teacher'){

            CheckBoolean.findOne((err, data) => {

                if(data.allAllocated === false){

                    if(data.start === false){

                        data.start = true;
                        data.save();

                        const department = ['CSE', 'EEE', 'ECE', 'MECH', 'MECH', 'CIVIL', 'IT'];
                        const year = ['1', '2','3', '4'];
    
                        for(var i=0; i<department.length; i++){
                            for(var j=0; j<year.length; j++){
    
                                RefconStudent.find({$and: [{department: department[i]}, {year: year[j]}]}).sort('rollNumber').exec((err, data1) => {
                                    if(data1.length != 0){
    
                                        StudentQueue.findOne({$and: [{department: data1[0].department}, {year: data1[0].year}]}, (err, data2) => {
    
                                            for(var k=0; k< data1.length; k++){
                                                data2.unalloc.push(data1[k].rollNumber);
                                                data2.markModified('unalloc');
                                            }
                                            data2.save();

                                        });
    
                                    }
                                });
    
                            }
                        }
                        
                    }
                    else{
                        StudentQueue.find({}).sort("year").exec((err, data) => {
                            res.render('seatingorderspace', {data: data, typerror: ""});
                        });
                    }

                }
                else{
                    res.render('sent', {message: 'All students are allocated!', goback: 'seatingorder'});
                }

            });

        }

    });

    app.post('/seatingorderspace', (req, res) => {

        var departments = [];
        var years = [];
        departments.push(req.body.department1);
        departments.push(req.body.department2);
        years.push(req.body.year1);
        years.push(req.body.year2);

        if(!req.session.user){
            res.render('login', {typerror: "You haven't logged in or your're session might have ended", success: ""});
        }
        else if(req.session.user.type === 'teacher'){

            if(req.body.department1 === req.body.department2 && req.body.year1 === req.body.year2){
                StudentQueue.find({}).sort("year").exec((err, data) => {
                    res.render('seatingorderspace', {data: data, typerror: "Can't select same department and year!"});
                });
            }
            else{

                var numberOfStudentsInDepartment1 = 0;
                var numberOfStudentsInDepartment2 = 0;
                const department1 = req.body.department1;
                const department2 = req.body.department2;
                const year1 = req.body.year1;
                const year2 = req.body.year2;
                const nor = parseInt(req.body.noOfRows);
                const noc = parseInt(req.body.noOfColumns);
                const block = req.body.blockInfo;
                const product = nor * noc;
                if(product % 2 === 0){
                    numberOfStudentsInDepartment1 = product/2;
                    numberOfStudentsInDepartment2 = product/2;
                }
                else{
                    numberOfStudentsInDepartment1 = Math.round(product/2);
                    numberOfStudentsInDepartment2 = Math.floor(product/2);
                }

                StudentQueue.findOne({$and: [{department: department1}, {year: year1}]}, (err, department1data) => {

                    StudentQueue.findOne({$and: [{department: department2}, {year: year2}]}, (err, department2data) => {

                        var dept1unalloc = [];
                        var dept2unalloc = [];
                        var rollNumbers = [];
                        var seatTypes = [];
                        var seatNumbers = [];

                        for(var i=0; i<numberOfStudentsInDepartment1; i++){
                            if( department1data.unalloc[i] != undefined ){ dept1unalloc.push(department1data.unalloc[i]); }
                            else{ break; }
                        }

                        for(var j=0; j<numberOfStudentsInDepartment2; j++){
                            if( department2data.unalloc[j] != undefined ){ dept2unalloc.push(department2data.unalloc[j]); }
                            else{ break; }
                        }console.log("______________________________________________________________________________________________________");
                        console.log(dept1unalloc);console.log(dept2unalloc);
                        const dept1unalloclength = dept1unalloc.length;
                        const dept2unalloclength = dept2unalloc.length;
                        const totaldeptlength = dept1unalloclength+dept2unalloclength;

                        if(nor % 2 === 0){

                            console.log("even");


                        }
                        else{
                            var c = 0;
                            var d1p = 0;
                            var d2p = 0;
                            for(i=0; i<totaldeptlength; i++){

                                if(c%2 === 0 && dept1unalloc[d1p] != undefined){
                                    rollNumbers.push(dept1unalloc[d1p]);
                                    seatTypes.push(department1);
                                    d1p++;
                                    c++;
                                }
                                else if(dept2unalloc[d2p] != undefined){
                                    rollNumbers.push(dept2unalloc[d2p]);
                                    seatTypes.push(department2);
                                    d2p++;
                                    c++;
                                }

                            }
                            console.log(seatTypes);
                            console.log(rollNumbers);
                        }

    
                    });

                });

            }

        }

    });


};

//syntax backup {$and: [{$or:[{department: req.body.department1}, {department: req.body.department2}]},{$or: [{year: req.body.year1}, {year: req.body.year2}]}], }