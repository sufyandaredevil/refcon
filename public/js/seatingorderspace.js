//jshint esversion:10
function showdiv(){
    document.getElementById('clickhere').style.display = 'none';
    document.getElementById('main').style.float = 'none';
    document.getElementById('info').style.display = 'block';
}

function showNoOfStudentsAndInfo(){

    if(Number(document.getElementById("noOfRows").value) === 0 || Number(document.getElementById("noOfColumns").value) === 0 || Number(document.getElementById("noOfRows").value) === 1 || Number(document.getElementById("noOfColumns").value) === 1){
        if(document.getElementById("noOfRows").value !== "" && document.getElementById("noOfColumns").value !== ""){
            document.getElementById("noOfStudentsInfoDanger").innerHTML = "Rows, Columns should be greater than 1";
            document.getElementById('noOfStudentsInfoDanger').style.display = "block";
            document.getElementById('noOfStudentsInfo').style.display = "none";
            document.getElementById('createButton').style.display = "none";
            document.getElementById("forFocus").focus();

        }
        else{
            document.getElementById('noOfStudentsInfo').style.display = "none";
            document.getElementById('noOfStudentsInfoDanger').style.display = "none";
            document.getElementById('createButton').style.display = "none";
            document.getElementById("forFocus").focus();
        }
    }
    else if(document.getElementById("noOfRows").value != "" && document.getElementById("noOfColumns").value != "" && checkDY12() === true){

        var noOfstudentsInDept1="";
        var noOfstudentsInDept2="";
        var dispdept1 = $('input[name="department1"]:checked').val();
        var dispdept2 = $('input[name="department2"]:checked').val();
        var dispyear1 = $('input[name="year1"]:checked').val();
        var dispyear2 = $('input[name="year2"]:checked').val();
        
        var d1y1RealStudentCount = parseInt($('.'+dispdept1+'.'+dispyear1+'')[0].innerHTML);
        var d2y2RealStudentCount = parseInt($('.'+dispdept2+'.'+dispyear2+'')[0].innerHTML);
        var dyRealStudentTotalCount = d1y1RealStudentCount + d2y2RealStudentCount;

        const multipliedNo = parseInt(document.getElementById("noOfRows").value)*parseInt(document.getElementById("noOfColumns").value);

        noOfstudentsInDept1 = Math.round(multipliedNo/2);
        noOfstudentsInDept2 = Math.floor(multipliedNo/2);

        var d1y1seatsOccupied = (d1y1RealStudentCount >= noOfstudentsInDept1) ? noOfstudentsInDept1 : d1y1RealStudentCount;
        var d2y2seatsOccupied = (d2y2RealStudentCount >= noOfstudentsInDept2) ? noOfstudentsInDept2 : d2y2RealStudentCount;

        document.getElementById('sd1').innerHTML = dispdept1;
        document.getElementById('sd2').innerHTML = dispdept2;
        document.getElementById('sy1').innerHTML = dispyear1;
        document.getElementById('sy2').innerHTML = dispyear2;

        document.getElementById('maxAllocD1').innerHTML = noOfstudentsInDept1;
        document.getElementById('maxAllocD2').innerHTML = noOfstudentsInDept2;
        document.getElementById('maxAllocTotal').innerHTML = multipliedNo;

        document.getElementById('curCountD1').innerHTML = d1y1RealStudentCount;
        document.getElementById('curCountD2').innerHTML = d2y2RealStudentCount;
        document.getElementById('curCountTotal').innerHTML = dyRealStudentTotalCount;

        document.getElementById('seatsOccupiedD1').innerHTML = d1y1seatsOccupied;
        document.getElementById('seatsOccupiedD2').innerHTML = d2y2seatsOccupied;
        document.getElementById('seatsOccupiedTotal').innerHTML = d1y1seatsOccupied + d2y2seatsOccupied;

        document.getElementById('remUnallocD1').innerHTML = d1y1RealStudentCount - d1y1seatsOccupied;
        document.getElementById('remUnallocD2').innerHTML = d2y2RealStudentCount - d2y2seatsOccupied;
        document.getElementById('remUnallocTotal').innerHTML = (d1y1RealStudentCount - d1y1seatsOccupied) + (d2y2RealStudentCount - d2y2seatsOccupied);

        document.getElementById('emptySeatCount').innerHTML = multipliedNo - (d1y1seatsOccupied + d2y2seatsOccupied);

        document.getElementById('noOfStudentsInfo').style.display = "block";
        document.getElementById('noOfStudentsInfoDanger').style.display = "none";
        document.getElementById('createButton').style.display = "block";
        document.getElementById("forFocus").focus();
    }
    else{
        document.getElementById('noOfStudentsInfo').style.display = "none";
        document.getElementById("forFocus").focus();
    }

}

function checkDY12(){

    var dispdept1 = $('input[name="department1"]:checked').val();
    var dispdept2 = $('input[name="department2"]:checked').val();
    var dispyear1 = $('input[name="year1"]:checked').val();
    var dispyear2 = $('input[name="year2"]:checked').val();
    var errCount = 0;

    if(dispdept1 != undefined && dispyear1 != undefined && dispdept2 != undefined && dispyear2 != undefined){

        if(dispdept1+dispyear1 === dispdept2+dispyear2){
            document.getElementById("dyDanger").innerHTML = "<font style='font-weight: bolder'>Department</font>, <font style='font-weight: bolder'>year 1</font> & <font style='font-weight: bolder;'>2</font> can't be the same";
            document.getElementById('dyDanger').style.display = "block";

            document.getElementById('d1y1Danger').style.display = "none";
            document.getElementById('d2y2Danger').style.display = "none";
            errCount++;
        }
        else{
            document.getElementById('dyDanger').style.display = "none";

            if(!($('.'+dispdept1+'.'+dispyear1+'')[0])){
                document.getElementById("d1y1Danger").innerHTML = `<font style="font-weight: bolder">${dispdept1}</font>, <font style="font-weight: bolder">${dispyear1}</font> year already allocated`;
                document.getElementById('d1y1Danger').style.display = "block";
                errCount++;
            }
            else{
                document.getElementById('d1y1Danger').style.display = "none";
            }
        
            if(!($('.'+dispdept2+'.'+dispyear2+'')[0])){
                document.getElementById("d2y2Danger").innerHTML = `<font style="font-weight: bolder">${dispdept2}</font>, <font style="font-weight: bolder">${dispyear2}</font> year already allocated`;
                document.getElementById('d2y2Danger').style.display = "block";
                errCount++;
            }
            else{
                document.getElementById('d2y2Danger').style.display = "none";
            }

        }

        if(errCount > 0){
            document.getElementById('createButton').style.display = "none";
            document.getElementById('displayRowColumn').style.display = "none";
            return false;
        }
        else{
            document.getElementById('displayRowColumn').style.display = "block";
            document.getElementById("forFocus").focus();
            return true;
        }

    }

}