const baseURL = 'https://z2o.herokuapp.com';
const forgotForm = document.getElementById('forgot-form');

$(".page-loader").fadeOut('fast');


forgotForm.addEventListener('submit', e => {
    e.preventDefault();
    $(".page-loader").fadeIn('fast');
    const data = new FormData(forgotForm);
    const forgotBody = {
        email: data.get('email')
    };
    axios.post(baseURL + '/bank/auth/reset-password/trigger', forgotBody)
        .then(response => {
            $('#forgot-form').css('display', 'none');
            $('.titles').css('display', 'none');
            $('.confirm-div').css('visibility', 'visible');
            $(".page-loader").fadeOut('fast');
        })
        .catch(error => {
            console.log(error);
            $(".page-loader").fadeOut('fast');
            alert(error.response.data.error || "Account with submitted email address doesn't exist.");
        })
})