function deRequire(elName) {
    el = document.getElementsByName(elName)
  
    var atLeastOneChecked = false; //at least one cb is checked
    for (i = 0; i < el.length; i++) {
      if (el[i].checked === true) {
        atLeastOneChecked = true;
      }
    }
  
    if (atLeastOneChecked === true) {
      for (i = 0; i < el.length; i++) {
        el[i].required = false;
      }
    } else {
      for (i = 0; i < el.length; i++) {
        el[i].required = true;
      }
    }
  }
  
  function togglePasswordVisibility(id) {
    var passwordInput = document.getElementById(id);
    if (passwordInput.type === "password") {
        passwordInput.type = "text";
    } else {
        passwordInput.type = "password";
    }
  }