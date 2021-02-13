const baseURL = "https://api-getaccess.herokuapp.com";
const loginForm = document.getElementById("login-form");
const registrationForm = document.getElementById("registration-form");

const authKey = Cookies.get("authKey");

if (typeof authKey !== "undefined") {
  document.location.href = "bank_dashboard.html";
}

$(".page-loader").fadeOut("fast");

if (registrationForm) {
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
    axios
      .post(baseURL + "/bank/register", registerBody)
      .then((response) => {
        console.log(response.data);
        document.location.href = "bank_login.html";
      })
      .catch((error) => {
        console.log(error);
        $(".page-loader").fadeOut("fast");
        alert(error.response.data.error || "Your request didn't validate");
      });
  });
}

if (loginForm) {
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    $(".page-loader").fadeIn("fast");
    const data = new FormData(loginForm);
    const loginBody = {
      bankId: data.get("bankId"),
      password: data.get("password"),
    };
    axios
      .post(baseURL + "/bank/auth", loginBody)
      .then((response) => {
        console.log(response.data);
        Cookies.set("authKey", response.data.authKey);
        Cookies.set("name", response.data.data.name);
        if (response.data.data.logoUrl)
          Cookies.set("logoUrl", response.data.data.logoUrl);
        else Cookies.remove("logoUrl");
        document.location.href = "bank_dashboard.html";
      })
      .catch((error) => {
        console.log(error);
        $(".page-loader").fadeOut("fast");
        alert(
          error.response.data.error || "BankId or Password didn't validate"
        );
      });
  });
}
