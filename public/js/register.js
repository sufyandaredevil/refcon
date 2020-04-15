//jshint esversion:10

function showParFields() {

    const sel = document.getElementById('type').value;
    if (sel === 'teacher') {
      document.getElementById("myForm").reset();
      document.getElementById('type').value = sel;
      document.getElementById("rollNumber").required = false;
      document.getElementById("department").required = false;
      document.getElementById("yearOfJoining").required = false;
      document.getElementById("year").required = false;
      document.getElementById("student").style.display = "none";

      document.getElementById("facultyid").required = true;
      document.getElementById("teacher").style.display = "block";
    } else if (sel === 'student') {
      document.getElementById("myForm").reset();
      document.getElementById('type').value = sel;
      document.getElementById("facultyid").required = false;
      document.getElementById("teacher").style.display = "none";

      document.getElementById("rollNumber").required = true;
      document.getElementById("department").required = true;
      document.getElementById("yearOfJoining").required = true;
      document.getElementById("year").required = true;
      document.getElementById("student").style.display = "block";
    }
  }