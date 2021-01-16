const baseURL = 'https://z2o.herokuapp.com';
const companyForm = document.getElementById('company-form');

const loadCompany = () => {
    axios.defaults.headers.common['Authorization'] = Cookies.get('authKey');
    const urlParams = new URLSearchParams(window.location.search);
    const companyId = urlParams.get('companyId');
    axios.get(baseURL + '/bank/companies/' + companyId + '/settings')
        .then(responseSettings => {
            const settings = responseSettings.data;
            $("#companyUpdatePeriod").val(settings.updatePeriod);
            $("#companyAllowedToChangeConnection").val(settings.allowedToChangeConnection.toString());
            $("#companyId").val(settings.companyId);
            companyForm.addEventListener('submit', e => {
                e.preventDefault();
                $(".page-loader").fadeIn('fast');
                axios.defaults.headers.common['Authorization'] = Cookies.get('authKey');
                const data = new FormData(companyForm);
                const companyBody = {
                    companyId: companyId,
                    updatePeriod: data.get('updatePeriod'),
                    allowedToChangeConnection: data.get('allowedToChangeConnection')
                };
                axios.put(baseURL + '/bank/companies/' + companyId + '/settings', companyBody)
                    .then(response => {
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