const baseURL = 'https://z2o.herokuapp.com';

const detailsHTML = (company) => {
    const date = new Date(company.createdAt);
    return `
    <ul class="list-group list-group-flush">
        <li class="list-group-item"><b>ID:</b> ${company.companyId}</li>
        <li class="list-group-item"><b>Email:</b> ${company.email}</li>
        <li class="list-group-item"><b>Type:</b> ${company.companyType}</li>
        <li class="list-group-item"><b>Region:</b> ${company.region}</li>
        <li class="list-group-item"><b>SIF:</b> ${company.SIF}</li>
        <li class="list-group-item"><b>Business Line:</b> ${company.businessLine}</li>
        <li class="list-group-item"><b>Created:</b> ${date.toDateString()}</li>
    </ul>
    `
}

const connectionHTML = (company) => {
    if(!company.dataConnection) {
        return `
        <ul class="list-group list-group-flush">
            <li class="list-group-item"><b>This company hasn't connected an accounting software yet.</b></li>
        </ul>
        `;
    }
    return `
    <ul class="list-group list-group-flush">
        <li class="list-group-item"><b>Platform:</b> ${company.dataConnection.name.charAt(0).toUpperCase() + company.dataConnection.name.slice(1)}</li>
    </ul>
    `
}

const companyHTML = (company) => {
    return `
            <div class="d-flex w-100 justify-content-between">
            <h1>${company.name} &nbsp; <span class="badge bg-primary rounded-pill">${company.status.charAt(0).toUpperCase() + company.status.slice(1)}</span></h1>
            <div>
                <a class="btn btn-primary" href="bank_edit_company?companyId=${company.companyId}" role="button">Edit</a>
                <a class="btn btn-secondary" href="bank_edit_company_settings?companyId=${company.companyId}" role="button">Edit Settings</a>
                <a class="btn btn-danger" role="button">Delete</a>
            </div>
        </div>
        <div class="w-100 separator mt-2 shadow"></div>
        <div class="container mt-4">
            <div class="row">
            <div class="col-sm">
                <h2>Details</h2>
                <div class="w-100 separator mt-2 shadow-sm"></div>
                ${detailsHTML(company)}
            </div>
            <div class="col-sm">
                <div class="row">
                    <div class="col-sm">
                        <h2>Connection</h2>
                        <div class="w-100 separator mt-2 shadow-sm"></div>
                        ${connectionHTML(company)}
                    </div>
                </div>
                <div class="row">
                    <div class="col-sm">
                        <h2>Settings</h2>
                        <div class="w-100 separator mt-2 shadow-sm"></div>
                    </div>
                </div>
            </div>
            
            </div>
        </div>
    `;
}

const loadCompany = () => {
    axios.defaults.headers.common['Authorization'] = Cookies.get('authKey');
    const urlParams = new URLSearchParams(window.location.search);
    const companyId = urlParams.get('companyId');
    axios.get(baseURL + '/bank/companies/' + companyId)
    .then(response => {
        const company = response.data;
        document.getElementById('company').innerHTML = companyHTML(company);
        $(".content-loader").fadeOut('fast');
    })
    .catch(error => {
        console.log(error);
        document.location.href = 'bank_companies.html';
    })
}

loadCompany();