const body = document.querySelector("body");
const form = document.getElementById("add-form");
const failureModal = new bootstrap.Modal(document.getElementById('failureModal'));
let report;

function pushFailureModal(msg, err){
    failureBody.innerText = msg;
    console.log(err);
    failureModal.show();
}

const clickHandler = async (e) => {
    e.preventDefault();
    document.querySelector('.page-loader').style.visibility = 'visible';
    const name = report.name;
    const formData = new FormData(form);
    const allParams = Object.fromEntries(formData.entries());
    const params = {};
    let emptyValue = false;
    const missingParams = [];
    Object.keys(allParams).forEach(paramKey =>{
        if(!paramKey.startsWith('~__')){
            if(allParams[paramKey]===""){
                missingParams.push(paramKey);
                emptyValue = true;
            }
            params[paramKey] = allParams[paramKey];
        }
    });
    if(emptyValue){
        document.querySelector('.page-loader').style.visibility = 'hidden';
        pushFailureModal(`${missingParams.join(', ')} params not specified`);
        return;
    }
    const req = {name, params};
    try{
        const resp = await axios.post('https://z2o.herokuapp.com/company/data/reports', req);
        Object.keys(params).forEach(paramKey =>{
            if(allParams[`~__${paramKey}`]) localStorage.setItem(paramKey, params[paramKey]);
        });
        window.location.replace(`company_report.html?reportName=${report.name}`);
    }
    catch(error){
        document.querySelector('.page-loader').style.visibility = 'hidden';
        const status = error.response.status;
        console.log(error.response.data);
        pushFailureModal(error.response.data.error);
    }
}

const loadReport = async (e) => {
    form.innerHTML = "";
    Object.keys(report.params).forEach((param) => {
        const input = document.createElement('input');
        if(param.includes("date"))  input.type = "date";
        else input.type = "text";
        input.className = "form-control mt-2";
        input.placeholder = `Enter ${param}`;
        input.autocomplete = 'off';
        const prevValue = report.params[param];
        if(prevValue) input.value = prevValue;
        input.name = param;
        input.required = true;
        input.id = param;
        form.appendChild(input);
    });
    const lineBreak = document.createElement('br');
    form.appendChild(lineBreak);
    const button = document.createElement('button');
    button.id = 'submit';
    button.innerText = "View Report";
    button.type = 'submit'
    button.addEventListener('click', clickHandler);
    button.className = "btn btn-primary";
    form.appendChild(button);
    document.querySelector('.page-loader').style.visibility = 'hidden';
}

const handleLoad = async (e) => {
    document.querySelector('.page-loader').style.visibility = 'visible';
    if(!Cookies.get('company-auth')) window.location.replace("company_login.html");
    const urlParams = new URLSearchParams(window.location.search);
    name = urlParams.get('reportName');
    axios.defaults.headers.common['Authorization'] = Cookies.get('company-auth');
    try{
        const resp = await axios.get(`https://z2o.herokuapp.com/company/data/reports/${name}`);
        report = resp.data;
        loadReport();
    }
    catch(error){
        console.log(error.response.data.error);
        document.querySelector('.page-loader').style.visibility = 'hidden';
        const msg = error.response? error.response.data.error: "Something went wrong";
        pushFailureModal(msg);
    }
};