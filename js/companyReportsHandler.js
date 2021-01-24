const body = document.querySelector("body");
let company;

const fmtDate = (date) => (new Date(date)).toDateString().split(' ').slice(1,).join(' ')

const getSessionParamsText = ({params}) => {
    if(!params) return 'Continuous';
    const {as_of_date, from_date, to_date} = params;
    let returnText = '';
    if(as_of_date) returnText += `As of ${fmtDate(as_of_date)} `;
    if(from_date) returnText += `From ${fmtDate(from_date)} to ${fmtDate(to_date)}`;
    return returnText===''?'Continuous':returnText;
}

const loadReports = async () => {
    document.querySelector('h3').innerText = `Reports added by ${company.name}`
    try{
        const reports = company.reports;
        const reportList = document.getElementById('report-list'); 
        for(let report of reports){
            const itemRow = document.createElement('div');
            itemRow.className = 'row d-flex';

            const contentColumn = document.createElement('div');
            contentColumn.className = "col col-11";

            const reportListItem = document.createElement('a');
            reportListItem.className = "list-group-item list-group-item-action mt-1";
            reportListItem.href = `company_report.html?reportName=${report.name}`;
            const sessionText = getSessionParamsText(report);
            reportListItem.innerHTML = `
                <h4>${report.name} <span class="badge bg-primary rounded-pill"><small>${sessionText}</small></span></h4>
            `;
            if(report.lastPublishDate) reportListItem.innerHTML += `
                <p>Updated on ${fmtDate(report.lastPublishDate)} by ${report.lastUpdateMadeBy}</p>
            `
            else reportListItem.innerHTML += `
                <p>Never Pushed</p>
            `
            
            contentColumn.appendChild(reportListItem);
            itemRow.appendChild(contentColumn);
            const reportListActions = document.createElement('div');
            reportListActions.className = 'col col-1 align-middle';
            const reportRedirect = `company_change_report.html?reportName=${report.name}`;
            reportListActions.innerHTML = `
                <a class="list-group-item list-group-item-action mt-1" href="${reportRedirect}">
                    <i class="fa fa-pencil-square-o fa-2x" aria-hidden="true"></i>
                </a>                   
            `
            itemRow.appendChild(reportListActions);
            reportList.appendChild(itemRow); 
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