const body = document.querySelector("body");
let company;

const loadReports = async () => {
    document.querySelector('h3').innerText = `Reports added by ${company.name}`
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
        if(company.status !== 'connected') window.location.replace("company_connection.html");
        else loadReports();
    }
    catch(error){
        Cookies.remove('company-auth');
        window.location.replace("company_login.html");
    }
};