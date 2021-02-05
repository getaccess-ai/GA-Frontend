const baseURL = "https://z2o.herokuapp.com";
const companyForm = document.getElementById("company-form");

companyForm.addEventListener("submit", (e) => {
  e.preventDefault();
  $(".page-loader").fadeIn("fast");
  axios.defaults.headers.common["Authorization"] = Cookies.get("authKey");
  const data = new FormData(companyForm);
  const companyBody = {
    companyId: data.get("companyId"),
    region: data.get("region"),
    email: data.get("email"),
    name: data.get("name"),
    companyType: data.get("companyType"),
    businessLine: data.get("businessLine"),
    CIF: data.get("CIF"),
  };
  axios
    .post(baseURL + "/bank/companies", companyBody)
    .then((response) => {
      document.location.href = "bank_companies.html";
    })
    .catch((error) => {
      console.log(error);
      $(".page-loader").fadeOut("fast");
      alert(error.response.data.error || "Your request didn't validate");
    });
});
