const baseURL = 'https://z2o.herokuapp.com';

const loadReport = (report, companyName) => {
    $('.table-responsive').append(buildTable(report.approvedData.data));
    $('#report-name').text(report.name);
    $('#company-name').text(companyName);
};

const handleReport = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const name = urlParams.get('reportName');
    const companyId = urlParams.get('companyId');
    const companyName = urlParams.get('companyName');
    axios.defaults.headers.common['Authorization'] = Cookies.get('authKey');
    axios.get(baseURL + '/bank/companies/' + companyId + '/data/reports/' + name)
    .then(response => {
        loadReport(response.data, companyName);
        $(".content-loader").fadeOut('fast');
    })
    .catch(error => {
        console.log(error);
    })
};

handleReport();