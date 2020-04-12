//jshint esversion:10

module.exports = (app, RefconStudent, StudentQueue, SeatingOrder) => {

    app.get('/seatingorder', (req, res) => {
        
        if(!req.session.user){
            res.render('login', {typerror: "You haven't logged in or your're session might have ended", success: ""});
        }
        else if(req.session.user.type === 'teacher'){

            SeatingOrder.find({}, (err, data) => {

                res.render('seatingorder', { type: req.session.user.type , data: data });

            });

        }
        else if(req.session.user.type === 'student'){
            SeatingOrder.find({$and: [{$or:[{department1: req.session.user.department}, {department2: req.session.user.department}]},{$or: [{year1: req.session.user.year}, {year2: req.body.year}]}], }, (err, data) => {

                if(data){

                    found = false;

                    for(i=0; i< data.length; i++){

                        if(data[i].rollNumbers.indexOf(req.session.user.rollNumber) != -1){
                            data[i].thisrollNumber = req.session.user.rollNumber;
                            res.render('seatingorder', { type: req.session.user.type , data: data[i] });
                            found = true;
                            break;
                        }
                    }

                    if(found === false){
                        res.render('seatingorder', { type: req.session.user.type , data: undefined });
                    }

                }
                else{

                    res.render('seatingorder', { type: req.session.user.type , data: undefined });

                }

            });

        }

    });

    app.get('/seatingorderspace', (req, res) => {

        if(!req.session.user){
            res.render('login', {typerror: "You haven't logged in or your're session might have ended", success: ""});
        }
        else if(req.session.user.type === 'teacher'){
            StudentQueue.find({}, (err, presentData)=> {

                if(presentData.length != 0){

                    var found = false;
                
                    for(let i=0; i<presentData.length; i++){
    
                        if(presentData[i].unalloc.length != 0){
                            found = true;
                            break;
                        }
                    }
                    
                    if(found === false){
                        res.render('sent', {message: 'All students are allocated!', goback: 'seatingorder'});
                    }
                    else{
    
                        StudentQueue.find({}).sort("year").exec((err, data) => {
                            res.render('seatingorderspace', {data: data, typerror: ""});
                        });
                        
                    }

                }
                else{
                    
                    var department = ['CSE', 'EEE', 'ECE', 'MECH', 'CIVIL', 'IT'];
                    var year = ['1', '2', '3', '4'];

                    for(var i=0; i<department.length; i++){
                        for(var j=0; j<year.length; j++){
                            
                            const dept_year = new StudentQueue({
                                department: department[i],
                                year: year[j],
                            });
                            
                            dept_year.save();
                        }
                    }

                    res.redirect('seatingOrderDeleteAll');

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

                const department1 = req.body.department1;
                const department2 = req.body.department2;
                const year1 = req.body.year1;
                const year2 = req.body.year2;
                const nor = parseInt(req.body.noOfRows);
                const noc = parseInt(req.body.noOfColumns);
                const block = req.body.blockInfo;
                const product = nor * noc;
                
                var numberOfStudentsInDepartment1 = Math.round(product/2);
                var numberOfStudentsInDepartment2 = Math.floor(product/2);

                StudentQueue.findOne({$and: [{department: department1}, {year: year1}]}, (err, department1data) => {

                    StudentQueue.findOne({$and: [{department: department2}, {year: year2}]}, (err, department2data) => {

                        if(department1data.unalloc.length === 0 && department2data.unalloc.length === 0){
                            StudentQueue.find({}).sort("year").exec((err, d) => {
                                res.render('seatingorderspace', {data: d, typerror: `Students in ${department1}, ${year1} year & ${department2}, ${year2} year are already allocated`});
                            });
                        }
                        else if(department1data.unalloc.length === 0){
                            StudentQueue.find({}).sort("year").exec((err, d) => {
                                res.render('seatingorderspace', {data: d, typerror: `Students in ${department1}, ${year1} year are already allocated`});
                            });
                        }
                        else if(department2data.unalloc.length === 0){
                            StudentQueue.find({}).sort("year").exec((err, d) => {
                                res.render('seatingorderspace', {data: d, typerror: `Students in ${department2}, ${year2} year are already allocated`});
                            });
                        }
                        else{

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
                            }

                            var tempSeatTypes = [];

                            if( nor % 2 === 0 && noc % 2 === 0 ){// special even case
                                let dc = 0;
                                let specialCount = 0;

                                for(let i=0; i<nor; i++){
                                    tempSeatTypes[i] = [];
                                    for(let j=0; j<noc-1; j++){

                                        if(dc % 2 === 0){
                                            tempSeatTypes[i][j] = department1;
                                        }
                                        else{
                                            tempSeatTypes[i][j] = department2;
                                        }
                                        dc++;
                                    }

                                }
                                for(let i=0; i<nor; i++){
                                    if(specialCount % 2 === 0){
                                        tempSeatTypes[i].push(department2);
                                    }
                                    else{
                                        tempSeatTypes[i].push(department1);
                                    }
                                    specialCount++;
                                }
                                
                            }
                            else if( (nor % 2 === 0 && noc % 2 != 0) && (nor > noc || nor < noc) ){ //horizontal case
                                let dc = 0;

                                for(let i=0; i<nor; i++){
                                    tempSeatTypes[i] = [];
                                    for(let j=0; j<noc; j++){

                                        if(dc % 2 === 0){
                                            tempSeatTypes[i][j] = department1;
                                        }
                                        else{
                                            tempSeatTypes[i][j] = department2;
                                        }
                                        dc++;
                                    }

                                }

                            }
                            else{ //vertical case

                                let dc = 0;
                                tempSeatTypes = Array.from(Array(nor), () => []);
                                
                                for(i=0; i<noc; i++){

                                    let subCount = 0;

                                    for(j=0; j<nor; j++){

                                        if(dc % 2 === 0){
                                            tempSeatTypes[subCount].push(department1);
                                        }
                                        else{
                                            tempSeatTypes[subCount].push(department2);
                                        }
                                        subCount++;
                                        dc++;
                                    }
                                }

                            }

                            var tempRollNumbers = Array.from(Array(nor), () => []);
                            var tempSeatNumbers = Array.from(Array(nor), () => []);
                            var rp1 = 0;
                            var rp2 = 0;
                            var seatno = 1;

                            for(i=0; i<noc; i++){

                                let subCount = 0;
                                for(j=0; j<nor; j++){

                                    if(tempSeatTypes[j][i] === department1){

                                        if(dept1unalloc[rp1] != undefined){
                                            tempRollNumbers[subCount].push(dept1unalloc[rp1]);
                                            rp1++;
                                        }
                                        else{
                                            tempRollNumbers[subCount].push("XX");
                                        }

                                    }
                                    else{
                                        if(dept2unalloc[rp2] != undefined){
                                            tempRollNumbers[subCount].push(dept2unalloc[rp2]);
                                            rp2++;
                                        }
                                        else{
                                            tempRollNumbers[subCount].push("XX");
                                        }
                                    }
                                    tempSeatNumbers[subCount].push(seatno++);
                                    subCount++;
                                    
                                }
                            }

                            for(i=0; i<nor; i++){
                                for(j=0; j<noc; j++){
                                    seatNumbers.push(tempSeatNumbers[i][j]);
                                    seatTypes.push(tempSeatTypes[i][j]);
                                    rollNumbers.push(tempRollNumbers[i][j]);
                                }
                            }

                            for(i=0; i<dept1unalloc.length; i++){
                                department1data.alloc.push(department1data.unalloc.shift());
                            }
                            for(j=0; j<dept2unalloc.length; j++){
                                department2data.alloc.push(department2data.unalloc.shift());
                            }

                            department1data.markModified('unalloc');
                            department2data.markModified('unalloc');
                            department1data.markModified('alloc');
                            department2data.markModified('alloc');
                            department1data.save();
                            department2data.save();

                            const newSeatingOrder = new SeatingOrder({
                                session: req.body.sessionIn,
                                block: block,
                                rollNumbers: rollNumbers,
                                seatTypes: seatTypes,
                                seatNumbers: seatNumbers,
                                department1: department1,
                                department2: department2,
                                year1: year1,
                                year2: year2,
                                rows: String(nor),
                                columns: String(noc),
                                department1rollNumbers: dept1unalloc,
                                department2rollNumbers: dept2unalloc
                            });
                            
                            newSeatingOrder.save((err, data) => {
                                if(data){
                                    res.render('sent', {message: "Seating Space Created successfully", goback: "seatingorder"});
                                }
                                else{
                                    res.render('oops');
                                }
                            });

                        }

    
                    });

                });

            }

        }

    });


    app.get('/seatingorderdelete/:seatingOrderID', (req, res) => {

        if(!req.session.user){
            res.render('login', {typerror: "You haven't logged in or your're session might have ended", success: ""});
        }
        else if(req.session.user.type === 'teacher'){

            SeatingOrder.findOne({_id: req.params.seatingOrderID}, (err, data) => {

                //departmentrollNumbers that need to be put into unalloc(sorted(1)) from alloc
                const departments = [data.department1, data.department2];
                const years = [data.year1, data.year2];
                const departmentrollNumbers = [data.department1rollNumbers, data.department2rollNumbers];

                SeatingOrder.deleteOne({_id: req.params.seatingOrderID}, (err) => {

                    for(let i=0; i<2; i++){

                        StudentQueue.findOne({$and: [{department: departments[i]}, {year: years[i]}]}, (err,d) => {

                            var newunalloc = [];
                            var currentunalloc = d.unalloc;
                            for(let j=0; j<departmentrollNumbers[i].length; j++){

                                newunalloc.push((d.alloc.splice( d.alloc.indexOf(departmentrollNumbers[i][j]), 1))[0]);

                            }

                            currentunalloc.push(...newunalloc);
                            currentunalloc = currentunalloc.map(Number);
                            currentunalloc.sort(function(a, b){return a-b;});
                            currentunalloc = currentunalloc.map(String);

                            d.unalloc = [];
                            d.unalloc.push(...currentunalloc);

                            d.markModified('unalloc');
                            d.markModified('alloc');
                            d.save();

                        });

                    }

                    res.redirect('/seatingorder');

                });

            });

        }

    });

    app.get('/seatingOrderDeleteAll', (req, res) => {

        if(!req.session.user){
            res.render('login', {typerror: "You haven't logged in or your're session might have ended", success: ""});
        }
        else if(req.session.user.type === 'teacher'){

            SeatingOrder.deleteMany({},(err) => {

                const department = ['CSE', 'EEE', 'ECE', 'MECH', 'CIVIL', 'IT'];
                const year = ['1', '2','3', '4'];

                for(var i=0; i<department.length; i++){

                    for(var j=0; j<year.length; j++){

                        RefconStudent.find({$and: [{department: department[i]}, {year: year[j]}]}).sort('rollNumber').exec((err, data1) => {
                            if(data1.length != 0){

                                StudentQueue.findOne({$and: [{department: data1[0].department}, {year: data1[0].year}]}, (err, data2) => {

                                    var tempSave = [];

                                    for(var k=0; k< data1.length; k++){
                                        tempSave.push(data1[k].rollNumber);
                                        // data2.unalloc.push(data1[k].rollNumber);
                                        // data2.markModified('unalloc');
                                    }
                                    data2.unalloc = tempSave.slice(0,tempSave.length);
                                    data2.alloc = [];
                                    data2.markModified('unalloc');
                                    data2.markModified('alloc');
                                    data2.save();

                                });

                            }
                        });

                    }
                }

                res.redirect('/seatingorder');

            });

        }

    });

    app.get('/seatingorderfind', (req, res) => {

        if(req.session.user){

            if(req.session.user.type === 'teacher'){
                res.render('seatingorderfind', {found: "", data: undefined, rollNumber: ""});
            }

        }
        else{

            res.render('login', {typerror: "You haven't logged in or your're session might have ended", success: ""});
        }

    });


    app.post('/seatingorderfind', (req, res) => {

        SeatingOrder.find({}, (err, data) => {

            var found = "false";

            for(let i = 0 ; i < data.length; i++){

                if(data[i].rollNumbers.includes(req.body.rollNumber)){

                    res.render('seatingorderfind', {found: "true", data: data[i], rollNumber: req.body.rollNumber});
                    found = "true";
                    break;

                }

            }

            if(found === 'false'){
                res.render('seatingorderfind', {found: "false", data: undefined, rollNumber: req.body.rollNumber});
            }


        });

    });


};

// syntax backup {$and: [{$or:[{department: req.body.department1}, {department: req.body.department2}]},{$or: [{year: req.body.year1}, {year: req.body.year2}]}], }