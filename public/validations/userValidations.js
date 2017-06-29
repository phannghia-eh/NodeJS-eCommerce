var firstpassword=document.getElementById("password");
var secondpassword=document.getElementById("confirmpassword");
function isPasswordMatched()
{
    console.log(firstpassword);
    console.log(secondpassword);
    if(firstpassword.value==secondpassword.value){
        secondpassword.setCustomValidity('');
    }  
    else{  
        secondpassword.setCustomValidity("Passwords Don't Match");
    }  
} 
firstpassword.onchange = isPasswordMatched;
secondpassword.onkeyup = isPasswordMatched;

function isUsernameValid()
{
    var username=document.getElementById("username").value;
    if(/^[a-zA-Z0-9- ]*$/.test(username) == false) {
        alert('Your search string contains illegal characters.');
    }
}