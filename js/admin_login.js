const baseURL = "https://api-getaccess.herokuapp.com";
const loginForm = document.getElementById("login-form");

const adminKey = Cookies.get("adminKey");

if (typeof adminKey !== "undefined") {
  document.location.href = "admin_dashboard.html";
}

$(".page-loader").fadeOut("fast");

loginForm.addEventListener("submit", (e) => {
  e.preventDefault();
  $(".page-loader").fadeIn("fast");
  const data = new FormData(loginForm);
  const loginBody = {
    adminId: data.get("adminId"),
    password: data.get("password"),
  };
  axios
    .post(baseURL + "/admin/auth", loginBody)
    .then((response) => {
      console.log(response.data);
      Cookies.set("adminKey", response.data.authKey);
      Cookies.set("adminId", response.data.data.adminId);
      document.location.href = "admin_dashboard.html";
    })
    .catch((error) => {
      console.log(error);
      $(".page-loader").fadeOut("fast");
      alert(error.response.data.error || "AdminID or Password didn't validate");
    });
});
