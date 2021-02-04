const handleLoginSubmit = async (e) => {
    e.preventDefault();
    document.querySelector('.page-loader').style.visibility = 'visible';
    const form = e.target;
    const companyId = document.getElementById('companyId');
    const password = document.getElementById('password');
    companyId.className = password.className = 'form-control'; 
    const formData = new FormData(form);
    const formDataObject = Object.fromEntries(formData.entries());
    try{
        const resp = await axios.post('https://z2o.herokuapp.com/company/auth', formDataObject);
        Cookies.set('company-auth', resp.data.authKey);
        if(resp.data.data.logoUrl) Cookies.set('clogoUrl', resp.data.data.logoUrl);
        else Cookies.remove('clogoUrl');
        window.location.replace("company_reports.html");
    }
    catch(error){
        document.querySelector('.page-loader').style.visibility = 'hidden';
        const status = error.response.status;
        const wrongElement = status === 404? companyId: password;
        wrongElement.className += ' is-invalid';
    }
}

if(Cookies.get('company-auth')) window.location.replace("company_reports.html");
document.querySelector('div.form-wrapper').getElementsByClassName.visibility = "visible";
const loginForm = document.getElementById('login-form');
loginForm.onsubmit = handleLoginSubmit;