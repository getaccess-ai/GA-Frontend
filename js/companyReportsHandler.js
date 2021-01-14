const body = document.querySelector("body");
let company;

const loadReports = async () => {
    body.innerHTML = `
    <div class="container">
        <h3> ${company.name} Reports </h3>
        <br />
        <ul class="list-group" id="report-list"> 
        </ul>
    </div>
    `;
    try{
        const reports = company.reports;
        const reportList = document.getElementById('report-list'); 
        for(let report of reports){
            const reportListItem = document.createElement('a');
            reportListItem.className = "list-group-item list-group-item-action";
            reportListItem.href = `company_report.html?reportName=${report.name}`;
            reportListItem.innerText = report.name;
            reportList.appendChild(reportListItem); 
        }
    }
    catch(error){
        console.log(error);
    } 
}

const handleLoad = async (e) => {
    if(!Cookies.get('company-auth')) window.location.replace("company_login.html");
    axios.defaults.headers.common['Authorization'] = Cookies.get('company-auth');
    try{
        const resp = await axios.get('https://z2o.herokuapp.com/company/data');
        company = resp.data;
        loadReports();
    }
    catch(error){
        console.log(error);
    }
};