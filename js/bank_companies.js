const baseURL = 'https://z2o.herokuapp.com';
const companiesList = document.getElementById('companies-list'); 

const loadCompanies = () => {
    axios.defaults.headers.common['Authorization'] = Cookies.get('authKey');
    axios.get(baseURL + '/bank/companies')
    .then(response => {
        console.log(response.data);
        response.data.results.forEach(company => {
            const companyListItem = document.createElement('a');
            companyListItem.className = "list-group-item list-group-item-action";
            companyListItem.href = `bank_company.html?companyId=${company.companyId}`;
            companyListItem.innerText = company.name;
            companiesList.appendChild(companyListItem); 
        });
    })
    .catch(error => {
        console.log(error);
    })
}

loadCompanies();