const body = document.querySelector("body");
let reports;

const loadReports = async (company) => {
    body.innerHTML = `
    <div class="container">
        <h3> ${company.name} Reports </h3>
        <br />
        <ul class="list-group" id="report-list"> 
        </ul>
    </div>
    `;
    try{
        const resp = await axios.get('http://localhost:3000/company/data/reports');
        const reportList = document.getElementById('report-list'); 
        reports = resp.data.reports;
        for(let report of reports){
            const reportListItem = document.createElement('li');
            reportListItem.className = "list-group-item";
            reportListItem.innerText = report.name;
            reportListItem.id = report.id;
            reportList.appendChild(reportListItem); 
        }
    }
    catch(error){
        console.log(error);
    } 
}

const handleLoginSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const companyId = document.getElementById('companyId');
    const password = document.getElementById('password');
    companyId.className = password.className = 'form-control'; 
    const formData = new FormData(form);
    const formDataObject = Object.fromEntries(formData.entries());
    try{
        const resp = await axios.post('http://localhost:3000/company/auth', formDataObject);
        axios.defaults.headers.common['Authorization'] = resp.data.authKey;
        loadReports(resp.data.data);
    }
    catch(error){
        const status = error.response.status;
        const wrongElement = status === 404? companyId: password;
        wrongElement.className += ' is-invalid';
    }
}

const loginForm = document.getElementById('login-form');
loginForm.onsubmit = handleLoginSubmit;