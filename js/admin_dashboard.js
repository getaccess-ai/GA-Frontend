const baseURL = "https://api-getaccess.herokuapp.com";
const registrationForm = document.getElementById("registration-form");
const reader = new FileReader();
let imgURL = "";
reader.addEventListener(
  "load",
  (e) => {
    imgURL = reader.result;
    registrationContinue();
  },
  false
);

function registrationContinue() {
  const data = new FormData(registrationForm);
  const registerBody = {
    bankId: data.get("bankId"),
    email: data.get("email"),
    name: data.get("name"),
  };
  if (imgURL) registerBody.logoUrl = imgURL;
  axios.defaults.headers.common["Authorization"] = Cookies.get("adminKey");
  axios
    .post(baseURL + "/admin/bank/register", registerBody)
    .then((response) => {
      console.log(response.data);
      alert("Bank Added!");
      document.location.href = "admin_dashboard.html";
    })
    .catch((error) => {
      console.log(error);
      $(".page-loader").fadeOut("fast");
      alert(error.response.data.error || "Your request didn't validate");
    });
}

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
        if (data.get("bankLogo")) reader.readAsDataURL(data.get("bankLogo"));
        else registrationContinue();
      });

      $(".page-loader").fadeOut("fast");
    })
    .catch((error) => {
      console.log(error);
    });
};

loadAdmin();
