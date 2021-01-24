const baseURL = 'https://z2o.herokuapp.com';
const companiesList = document.getElementById('companies-list'); 

const companyHTML = (company) => {
    const date = new Date(company.createdAt);
    return `<div class="d-flex w-100 justify-content-between">
            <h5 class="mb-1">${company.name}</h5>
            <small>${date.toDateString()}</small>
        </div>
        <small>${company.companyId}&nbsp;${company.email}&nbsp;</small>
        <span class="badge bg-primary rounded-pill">${company.status.charAt(0).toUpperCase() + company.status.slice(1)}</span>`;
}

const loadCompanies = () => {
    axios.defaults.headers.common['Authorization'] = Cookies.get('authKey');
    axios.get(baseURL + '/bank/companies')
    .then(response => {
        console.log(response.data);
        if(response.data.results.length===0) {
            const noCompanies = document.createElement('p');
            noCompanies.innerText = "You haven't added any customers yet.";
            noCompanies.className = "text-muted";
            companiesList.appendChild(noCompanies); 
        }
        response.data.results.forEach(company => {
            const companyListItem = document.createElement('a');
            companyListItem.className = "list-group-item list-group-item-action";
            companyListItem.href = `bank_company.html?companyId=${company.companyId}`;
            companyListItem.innerHTML = companyHTML(company);
            companiesList.appendChild(companyListItem); 
        });
        $(".content-loader").fadeOut('fast');
    })
    .catch(error => {
        console.log(error);
    })
}

loadCompanies();