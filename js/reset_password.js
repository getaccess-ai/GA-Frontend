const baseURL = "https://z2o.herokuapp.com";
const resetForm = document.getElementById("reset-form");

$(".page-loader").fadeOut("fast");

resetForm.addEventListener("submit", (e) => {
  e.preventDefault();
  $(".page-loader").fadeIn("fast");
  const urlParams = new URLSearchParams(window.location.search);
  const resetToken = urlParams.get("resetToken");
  const data = new FormData(resetForm);
  const resetBody = {
    resetToken: resetToken,
    password: data.get("password"),
  };
  axios
    .post(baseURL + "/bank/auth/reset-password", resetBody)
    .then((response) => {
      $("#reset-form").css("display", "none");
      $(".titles").css("display", "none");
      $(".confirm-div").css("visibility", "visible");
      $(".page-loader").fadeOut("fast");
    })
    .catch((error) => {
      console.log(error);
      $(".page-loader").fadeOut("fast");
      alert(error.response.data.error || "Your password couldn't be updated.");
    });
});
