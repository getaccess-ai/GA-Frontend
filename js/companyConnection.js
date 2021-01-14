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

async function handleLoad() {
    if (!Cookies.get('company-auth'))
        window.location.replace("company_login.html");
    axios.defaults.headers.common['Authorization'] = Cookies.get('company-auth');
    try {
        const resp = await axios.get('https://z2o.herokuapp.com/company/data');
        company = resp.data;
        if (company.status === 'connected')
            window.location.replace("company_reports.html");
    }
    catch (error) {
        Cookies.remove('company-auth');
        window.location.replace("company_login.html");
    }
}