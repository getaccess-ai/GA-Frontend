const baseURL = 'https://z2o.herokuapp.com';
const companyForm = document.getElementById('company-form');

const loadCompany = () => {
    axios.defaults.headers.common['Authorization'] = Cookies.get('authKey');
    const urlParams = new URLSearchParams(window.location.search);
    const companyId = urlParams.get('companyId');
    axios.get(baseURL + '/bank/companies/' + companyId)
        .then(responseCompany => {
            const company = responseCompany.data;
            $("#companyName").val(company.name);
            $("#companyEmail").val(company.email);
            $("#companyType").val(company.companyType);
            $("#companyRegion").val(company.region);
            $("#companyCIF").val(company.CIF);
            $("#companyBusinessLine").val(company.businessLine);
            $("#companyId").val(company.companyId);
            companyForm.addEventListener('submit', e => {
                e.preventDefault();
                $(".page-loader").fadeIn('fast');
                axios.defaults.headers.common['Authorization'] = Cookies.get('authKey');
                const data = new FormData(companyForm);
                const companyBody = {
                    companyId: companyId,
                    region: data.get('region'),
                    email: data.get('email'),
                    name: data.get('name'),
                    companyType: data.get('companyType'),
                    businessLine: data.get('businessLine'),
                    CIF: data.get('CIF')
                };
                console.log(companyBody);
                axios.put(baseURL + '/bank/companies/' + companyId, companyBody)
                    .then(response => {
                        console.log(response.data);
                        document.location.href = 'bank_companies.html';
                    })
                    .catch(error => {
                        console.log(error);
                        $(".page-loader").fadeOut('fast');
                        alert(error.response.data.error || "Your request didn't validate");
                    })
            })
            $(".content-loader").fadeOut('fast');
        })
        .catch(error => {
            console.log(error);
            document.location.href = 'bank_companies.html';
        })
}

loadCompany();