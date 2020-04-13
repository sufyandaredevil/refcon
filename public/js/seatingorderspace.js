function showdiv(){
    document.getElementById('clickhere').style.display = 'none';
    document.getElementById('main').style.float = 'none';
    document.getElementById('info').style.display = 'block';
}

function showNoOfStudentsAndInfo(){

// if(Number(document.getElementById("noOfRows").value) === 0 || Number(document.getElementById("noOfColumns").value) === 0 || Number(document.getElementById("noOfRows").value) === 1 || Number(document.getElementById("noOfColumns").value) === 1)

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
    else if(document.getElementById("noOfRows").value != "" && document.getElementById("noOfColumns").value != ""){

        var noOfstudentsInDept1="";
        var noOfstudentsInDept2="";
        var textInfo="";
        var dispdept1 = $('input[name="department1"]:checked').val();
        var dispdept2 = $('input[name="department2"]:checked').val();
        var dispyear1 = $('input[name="year1"]:checked').val();
        var dispyear2 = $('input[name="year2"]:checked').val();
        
        const multipliedNo = parseInt(document.getElementById("noOfRows").value)*parseInt(document.getElementById("noOfColumns").value);

            noOfstudentsInDept1 = Math.round(multipliedNo/2);
            noOfstudentsInDept2 = Math.floor(multipliedNo/2);
            textInfo = '<br><ul><li>Number of Students in <font style="font-weight: bolder;">'+dispdept1+'</font>, <font style="font-weight: bolder;">'+dispyear1+'</font> year: <font style="font-weight: bolder;">'+noOfstudentsInDept1+'</font></li><li>Number of Students in <font style="font-weight: bolder;">'+dispdept2+'</font>, <font style="font-weight: bolder;">'+dispyear2+'</font> year: <font style="font-weight: bolder;">'+noOfstudentsInDept2+'</font></li>';

        document.getElementById('noOfStudentsInfo').innerHTML = 'Maximum of <font style="font-weight:bolder;">'+String(multipliedNo)+ '</font>' +" students can be allocated"+textInfo;
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