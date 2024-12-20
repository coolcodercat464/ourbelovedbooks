const page1checker = setInterval(function() {
    page1done();
  }, 1000);

const page2checker = setInterval(function() {
page2done();
}, 500);

const page3checker = setInterval(function() {
page3done();
}, 500);
  
function page1done(cont=false) {
    if (document.getElementById('tos').checked === true) {
        document.getElementById('tosd').innerHTML = '<b style="color: green;">Good to go!</b>'
        entry = document.getElementById('username').value.trim();
        fetch('/allusernames').then(response => response.json()).then(data => {
        const usernameList = data.map(
            user => `${user.username}`
        );
        if (usernameList.includes(entry)) {
            document.getElementById('avaliability').innerHTML = '<b style="color: red;">Username taken. Try something else!</b>'
        } else if (entry === '' || entry.length < 5) {
            document.getElementById('avaliability').innerHTML = '<b style="color: red;">Enter a username! At least 5 characters!</b>'
        } else {
            document.getElementById('avaliability').innerHTML = '<b style="color: green;">Nice username :) Let\'s continue!</b>'
            if (document.getElementById('password').value.trim() === '' || document.getElementById('password').value.trim().length < 5) {
            document.getElementById('pwd').innerHTML = '<b style="color: red;">Enter a password please! At least 5 characters!</b>'
            } else {
            document.getElementById('pwd').innerHTML = '<b style="color: green;">Good to go!</b>'
            if (document.getElementById('email').value.trim() === '' || document.getElementById('email').value.trim().includes('@') === false) {
                document.getElementById('emaild').innerHTML = '<b style="color: red;">Enter a valid email please!</b>'
            } else {
                document.getElementById('emaild').innerHTML = '<b style="color: green;">Good to go!</b>'
                if (document.getElementById('bio').value.trim() === '') {
                document.getElementById('biod').innerHTML = '<b style="color: red;">Enter something for your biography!</b>'
                } else {
                document.getElementById('biod').innerHTML = '<b style="color: green;">Good to go!</b>';
                if (cont === true) {
                    clearInterval(page1checker);
                    goToNextPage(1)
                }
                }
            }
            }
        }
        });
    } else {
        document.getElementById('tosd').innerHTML = '<b style="color: red;">Remember to read and agree to the ToS!</b>'
    }
}

function page2done(cont=false) {
    if (document.getElementById('name').value.trim() === '') {
        document.getElementById('named').innerHTML = '<b style="color: red;">Enter a first name please!</b>'
    } else {
        document.getElementById('named').innerHTML = '<b style="color: green;">Good to go!</b>';
        if (checkRadiocheck('age') === true) {
            document.getElementById('aged').innerHTML = '<b style="color: green;">Good to go!</b>';
            if (cont === true) {
                clearInterval(page2checker);
                goToNextPage(2)
            }
        } else {
            document.getElementById('aged').innerHTML = '<b style="color: red;">Select your age bracket!</b>'
        }
    }
}

function page3done(cont=false) {
    if (checkCheckcheck('genre') === true) {
        document.getElementById('genred').innerHTML = '<b style="color: green;">Good to go!</b>';
        if (checkCheckcheck('length') === true) {
            document.getElementById('lengthd').innerHTML = '<b style="color: green;">Good to go!</b>';
            if (checkCheckcheck('narrationstyle') === true) {
                document.getElementById('styled').innerHTML = '<b style="color: green;">Good to go!</b>';
                if (checkRadiocheck('level') === true) {
                    document.getElementById('leveld').innerHTML = '<b style="color: green;">Good to go!</b>';
                    if (cont === true) {
                        clearInterval(page3checker);
                    }
                } else {
                    document.getElementById('leveld').innerHTML = '<b style="color: red;">Select your reading level!</b>'
                }
            } else {
                document.getElementById('styled').innerHTML = '<b style="color: red;">Select your favorite styles!</b>'
            }
        } else {
            document.getElementById('lengthd').innerHTML = '<b style="color: red;">Select your favorite styles!</b>'
        }
    } else {
        document.getElementById('genred').innerHTML = '<b style="color: red;">Select your favorite genres!</b>'
    }
}
  
function goToNextPage(rn) {
    currentId = "pg" + rn.toString();
    newId = "pg" + (rn+1).toString();
    currentPage = document.getElementById(currentId);
    newPage = document.getElementById(newId);
    currentPage.style.display = "none";
    newPage.style.display = "block";
}
  
function goToPrevPage(rn) {
    currentId = "pg" + rn.toString();
    newId = "pg" + (rn-1).toString();
    currentPage = document.getElementById(currentId);
    newPage = document.getElementById(newId);
    currentPage.style.display = "none";
    newPage.style.display = "block";
}
  
function checkRadiocheck(n) {
    var radios = document.getElementsByTagName('input');
    var value = false;
    for (var i = 0; i < radios.length; i++) {
      if (radios[i].name == n) {
        if (radios[i].type === 'radio' && radios[i].checked) {
           value = true;
        }
      }  
    }
    return value;
}

function checkCheckcheck(n) {
    var radios = document.getElementsByTagName('input');
    var value = false;
    for (var i = 0; i < radios.length; i++) {
      if (radios[i].name == n) {
        if (radios[i].type === 'checkbox' && radios[i].checked) {
           value = true;
        }
      }  
    }
    return value;
}
  
function checkAvaliability() {
    entry = document.getElementById('username').value.trim();
    fetch('/allusernames').then(response => response.json()).then(data => {
      const usernameList = data.map(
        user => `${user.username}`
      );
      if (usernameList.includes(entry)) {
        document.getElementById('avaliability').innerHTML = '<b style="color: red;">Username taken. Try something else!</b>'
      } else {
        document.getElementById('avaliability').innerHTML = '<b style="color: green;">Nice username :) Let\'s continue!</b>'
      }
    });
}