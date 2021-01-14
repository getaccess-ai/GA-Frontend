const baseURL = 'https://z2o.herokuapp.com';
const loginForm = document.getElementById('login-form');
const registrationForm = document.getElementById('registration-form');

const authKey = Cookies.get('authKey');

if(typeof authKey !== 'undefined') {
    document.location.href = 'bank_dashboard.html';
}

const hexToRgb = (hex) => {
    var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, function(m, r, g, b) {
      return r + r + g + g + b + b;
    });
  
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  }

if(registrationForm) {
    registrationForm.addEventListener('submit', e => {
        e.preventDefault();
        const data = new FormData(registrationForm);
        console.log(hexToRgb(data.get('primaryColor')));
        const registerBody = {
            bankId: data.get('bankId'),
            password: data.get('password'),
            email: data.get('email'),
            name: data.get('name'),
            primaryColor: hexToRgb(data.get('primaryColor')),
            secondaryColor: hexToRgb(data.get('secondaryColor')),
            coverImg: data.get('coverImg')
        };
        axios.post(baseURL + '/bank/register', registerBody)
        .then(response => {
            console.log(response.data);
            document.location.href = 'bank_login.html';
        })
        .catch(error => {
            console.log(error);
            alert(error.response.data.error || "Your request didn't validate");
        })
    })
}

if(loginForm) {
    loginForm.addEventListener('submit', e => {
        e.preventDefault();
        const data = new FormData(loginForm);
        const loginBody = {
            bankId: data.get('bankId'),
            password: data.get('password')
        };
        axios.post(baseURL + '/bank/auth', loginBody)
        .then(response => {
            console.log(response.data);
            Cookies.set('authKey', response.data.authKey);
            Cookies.set('name', response.data.data.name);
            document.location.href = 'bank_dashboard.html';
        })
        .catch(error => {
            console.log(error);
            alert(error.response.data.error || "BankId or Password didn't validate");
        })
    })
}
