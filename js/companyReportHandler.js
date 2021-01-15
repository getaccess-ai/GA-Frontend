const pre = document.querySelector("pre");
let report;

const loadReport = async () => {
    pre.innerText = JSON.stringify(report);
};

const handleLoad = async (e) => {
    if(!Cookies.get('company-auth')) window.location.replace("company_login.html");
    const urlParams = new URLSearchParams(window.location.search);
    const name = urlParams.get('reportName');
    axios.defaults.headers.common['Authorization'] = Cookies.get('company-auth');
    try{
        const resp = await axios.get(`https://z2o.herokuapp.com/company/data/reports/${name}`);
        report = resp.data;
        loadReport();
    }
    catch(error){
        console.log(error.response.data);
    }
};