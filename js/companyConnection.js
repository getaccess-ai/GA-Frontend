const marg = document.getElementById('marg');
const zoho = document.getElementById('zoho');
const tally = document.getElementById('tally');
const sage = document.getElementById('sage');
marg.addEventListener('click', handleConnectClick);
zoho.addEventListener('click', handleConnectClick);
tally.addEventListener('click', handleConnectClick);
sage.addEventListener('click', handleConnectClick);

async function handleConnectClick(e){
    e.preventDefault();
    const type = e.target.id;
    if(type==='zoho') {
        const resp = await axios.post("https://z2o.herokuapp.com/company/connection/zoho");
        const redirectUri = resp.data.redirect_url;
        const connectChild = window.open(redirectUri, 'ConnectWindow', 'toolbar=0,status=0,width=626,height=436');
        const timer = setInterval(()=>{
            if(connectChild.closed){
                location.reload();
                clearInterval(timer);
            }
        }, 500);
    }
    if(type==='quickbooks') {
        const resp = await axios.post("https://z2o.herokuapp.com/company/connection/quickbooks");
        const redirectUri = resp.data.redirect_url;
        const connectChild = window.open(redirectUri, 'ConnectWindow', 'toolbar=0,status=0,width=626,height=436');
        const timer = setInterval(()=>{
            if(connectChild.closed){
                location.reload();
                clearInterval(timer);
            }
        }, 500);
    }
}

const handleSubmit = async (e) => {
    e.preventDefault();
    document.querySelector('.page-loader').style.visibility = 'visible';
    const companyReference = document.querySelector('#companyReference').value;
    try {
        const resp = await axios.put('https://z2o.herokuapp.com/company/connection', {companyReference});
        location.reload();
    }catch(error){
        console.log(error);
        alert('Something went wrong');
    }
}

const loadValues = async () => {
    try{
        if(company.platform!=='zoho') throw {error: 'Connection type not zoho'};
        const resp = await axios.get('https://z2o.herokuapp.com/company/data/reports/GA.Reports.Zoho.OrganizationsData');
        const report = resp.data;
        const selector = document.querySelector('#companyReference');
        selector.innerHTML = "";
        report.data.forEach(orgzn => {
            const option = document.createElement("option");
            option.value = orgzn.organization_id;
            option.text = orgzn.name;
            selector.appendChild(option);
        });
        document.querySelector('#submitParam').style.visibility = 'visible';
    }
    catch(error){
        console.log(error);
        alert('Something went wrong');
    }
}

const getCompanyInfo = () => {
    const paramName = company.platform === 'zoho'? 'Organization Id': 'Company Name';
    const param = company.platform === 'zoho'? 'organization_id': 'company_name';
    document.querySelector('#body-container').innerHTML = `
    <div class="container-fluid company-content">
        <div class="form-wrapper">
            <h1>Specify the ${paramName}</h1>
            <br/>
            <form id="select-form">
                <select class="form-select" id="companyReference">
                    <option selected>Loading values</option>
                </select>
                <br>
                <button  id="submitParam" style="visiblity:none;" class="btn btn-primary">Submit</button>
            </form>
            <br>
        </div>
    </div>`;
    document.querySelector('#submitParam').addEventListener('click', handleSubmit);
    loadValues();
}

async function handleLoad() {
    if (!Cookies.get('company-auth'))
        window.location.replace("company_login.html");
    axios.defaults.headers.common['Authorization'] = Cookies.get('company-auth');
    try {
        const resp = await axios.get('https://z2o.herokuapp.com/company/data');
        company = resp.data;
        if (company.status === 'connected')
            window.location.replace("company_reports.html");
        else if(company.status == 'linked')
            getCompanyInfo();
        else document.querySelector('div.container').style.visibility = 'visible';
    }
    catch (error) {
        Cookies.remove('company-auth');
        window.location.replace("company_login.html");
    }
}