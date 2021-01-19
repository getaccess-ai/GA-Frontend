const body = document.querySelector("body");
const reportSelector = document.getElementById("report-name");
const form = document.getElementById("add-form");
const failureModal = new bootstrap.Modal(document.getElementById('failureModal'));
let reports;

function pushFailureModal(msg, err){
    failureBody.innerText = msg;
    console.log(err);
    failureModal.show();
}

const clickHandler = async (e) => {
    e.preventDefault();
    document.querySelector('.page-loader').style.visibility = 'visible';
    const idx = reportSelector.value;
    if(idx===-1) return;
    const name = reports[idx].name;
    const formData = new FormData(form);
    const params = Object.fromEntries(formData.entries());
    let emptyValue = false;
    const missingParams = [];
    Object.keys(params).forEach(paramKey =>{
        if(params[paramKey]===""){
            missingParams.push(paramKey);
            emptyValue = true;
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
        window.location.replace("company_reports.html");
    }
    catch(error){
        document.querySelector('.page-loader').style.visibility = 'hidden';
        const status = error.response.status;
        console.log(error.response.data);
        pushFailureModal(error.response.data);
    }
}

const changeHandler = async (e) => {
    const idx = reportSelector.value;
    form.innerHTML = "";
    if(idx===-1) return;
    const report = reports[idx];
    report.requiredParams.forEach((param) => {
        const input = document.createElement('input');
        input.type = "text";
        input.className = "form-control";
        input.placeholder = `Enter ${param}`;
        input.name = param;
        input.required = true;
        input.id = param;
        form.appendChild(input);
    });
    const lineBreak = document.createElement('br');
    form.appendChild(lineBreak);
    const button = document.createElement('button');
    button.id = 'submit';
    button.innerText = "Add Report";
    button.type = 'submit'
    button.addEventListener('click', clickHandler);
    button.className = "btn btn-primary";
    form.appendChild(button);
}

const loadReports = async () => {
    reportSelector.innerHTML = "";
    reports.forEach((report, reportIdx) => {
        const option = document.createElement("option");
        option.value = reportIdx;
        option.innerText = report.name;
        reportSelector.appendChild(option);
    });
    const option = document.createElement("option");
    option.value = -1;
    option.innerText = "Select a report from the list";
    option.selected = true;
    reportSelector.appendChild(option);
    reportSelector.addEventListener("change", changeHandler);
}

const handleLoad = async (e) => {
    if(!Cookies.get('company-auth')) window.location.replace("company_login.html");
    axios.defaults.headers.common['Authorization'] = Cookies.get('company-auth');
    try{
        const resp = await axios.get('https://z2o.herokuapp.com/company/data/reports/all');
        reports = resp.data.reports;
        loadReports();
    }
    catch(error){
        if(error.response.status==404) window.location.replace("company_connection.html");
        Cookies.remove('company-auth');
        window.location.replace("company_login.html");
    }
};