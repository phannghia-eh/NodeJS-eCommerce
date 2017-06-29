function isPasswordMatched()
    {
    var firstpassword=document.getElementById("password");
    var secondpassword=document.getElementById("confirmpassword");

    if(firstpassword.value==secondpassword.value){  
        return true;  
    }  
    else{  
        secondpassword.setCustomValidity("Passwords Don't Match");
        return false;
    }  
} 