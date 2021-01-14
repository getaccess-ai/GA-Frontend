const handleLoginSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const companyId = document.getElementById('companyId');
    const password = document.getElementById('password');
    companyId.className = password.className = 'form-control'; 
    const formData = new FormData(form);
    const formDataObject = Object.fromEntries(formData.entries());
    try{
        const resp = await axios.post('https://z2o.herokuapp.com/company/auth', formDataObject);
        Cookies.set('company-auth', resp.data.authKey);
        window.location.replace("company_reports.html");
    }
    catch(error){
        const status = error.response.status;
        const wrongElement = status === 404? companyId: password;
        wrongElement.className += ' is-invalid';
    }
}

if(Cookies.get('company-auth')) window.location.replace("company_reports.html");
const loginForm = document.getElementById('login-form');
loginForm.onsubmit = handleLoginSubmit;