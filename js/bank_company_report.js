const baseURL = 'https://z2o.herokuapp.com';

const loadReport = (report, companyName) => {
    const date = new Date(report.lastPublishDate);
    $('.table-responsive').append(buildTable(report.approvedData.data));
    $('#report-name').text(report.name);
    $('#company-name').text(companyName);
    $('#publish-date').text(date.toDateString());
    $('#update-name').text(report.lastUpdateMadeBy);
    const annotations = report.approvedData.annotations;
    for(const cell in annotations) {
        const cellElement = document.getElementById(cell);
        cellElement.classList.add('annotated');
        cellElement.setAttribute('data-bs-toggle', 'popover');
        cellElement.setAttribute('data-bs-placement', 'top');
        cellElement.setAttribute('title', `Adjustment: ${annotations[cell].adjustment}`);
        cellElement.setAttribute('data-bs-content', `Comment: ${annotations[cell].comment}`);
    }
    $(function () {
        $('[data-bs-toggle="popover"]').popover()
    })
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