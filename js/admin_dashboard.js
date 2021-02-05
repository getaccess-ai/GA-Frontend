const baseURL = "https://z2o.herokuapp.com";
const registrationForm = document.getElementById("registration-form");

const loadAdmin = () => {
  if (!Cookies.get("adminKey")) window.location.replace("admin_login.html");

  axios.defaults.headers.common["Authorization"] = Cookies.get("adminKey");
  axios
    .get(baseURL + "/admin/stats")
    .then((response) => {
      console.log(response.data);
      $("#banks").text(response.data.banks);
      $("#companies").text(response.data.companies);
      $("#reports").text(response.data.reports);

      registrationForm.addEventListener("submit", (e) => {
        e.preventDefault();
        $(".page-loader").fadeIn("fast");
        const data = new FormData(registrationForm);
        const registerBody = {
          bankId: data.get("bankId"),
          password: data.get("password"),
          email: data.get("email"),
          name: data.get("name"),
        };
        if (data.get("logoUrl")) registerBody.logoUrl = data.get("logoUrl");
        axios.defaults.headers.common["Authorization"] = Cookies.get(
          "adminKey"
        );
        axios
          .post(baseURL + "/admin/bank/register", registerBody)
          .then((response) => {
            console.log(response.data);
            document.location.href = "admin_dashboard.html";
          })
          .catch((error) => {
            console.log(error);
            $(".page-loader").fadeOut("fast");
            alert(error.response.data.error || "Your request didn't validate");
          });
      });

      $(".page-loader").fadeOut("fast");
    })
    .catch((error) => {
      console.log(error);
    });
};

loadAdmin();
