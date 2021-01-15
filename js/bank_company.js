const baseURL = 'https://z2o.herokuapp.com';

const loadCompany = () => {
    axios.defaults.headers.common['Authorization'] = Cookies.get('authKey');
    const urlParams = new URLSearchParams(window.location.search);
    const companyId = urlParams.get('companyId');
    axios.get(baseURL + '/bank/companies/' + companyId)
    .then(response => {
        const company = response.data;
        document.getElementById('company-name').innerText = company.name;
        $(".content-loader").fadeOut('fast');
    })
    .catch(error => {
        console.log(error);
        document.location.href = 'bank_companies.html';
    })
}

loadCompany();