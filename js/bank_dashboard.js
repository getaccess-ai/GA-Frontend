const authKey = Cookies.get('authKey');

if(typeof authKey !== 'undefined') {
    document.getElementById('bankName').innerText = 'Hi ' + Cookies.get('name') + '! You are logged in.';
} else {
    document.location.href = 'bank_login.html';
}