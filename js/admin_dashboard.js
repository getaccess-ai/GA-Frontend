const baseURL = 'https://z2o.herokuapp.com';
const registrationForm = document.getElementById('registration-form');

if (!Cookies.get('adminKey')) window.location.replace("admin_login.html");

$(".page-loader").fadeOut('fast');


registrationForm.addEventListener('submit', e => {
    e.preventDefault();
    $(".page-loader").fadeIn('fast');
    const data = new FormData(registrationForm);
    const registerBody = {
        bankId: data.get('bankId'),
        password: data.get('password'),
        email: data.get('email'),
        name: data.get('name')
    };
    axios.defaults.headers.common['Authorization'] = Cookies.get('adminKey');
    axios.post(baseURL + '/admin/bank/register', registerBody)
        .then(response => {
            console.log(response.data);
            document.location.href = 'admin_dashboard.html';
        })
        .catch(error => {
            console.log(error);
            $(".page-loader").fadeOut('fast');
            alert(error.response.data.error || "Your request didn't validate");
        })
})