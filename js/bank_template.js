const authKey = Cookies.get("authKey");

if (typeof authKey === "undefined") {
  document.location.href = "bank_login.html";
}

$("#menu-toggle").click(function (e) {
  e.preventDefault();
  $("#wrapper").toggleClass("toggled");
  $(".content-loader").toggleClass("toggled");
});

$("#logoutButton").click(function (e) {
  e.preventDefault();
  Cookies.remove("authKey");
  Cookies.remove("name");
  document.location.href = "bank_login.html";
});

let nameElements = document.getElementsByClassName("bankName");
for (let i = 0; i < nameElements.length; i++) {
  nameElements[i].innerText = Cookies.get("name");
}

let sidebarHeading = document.getElementsByClassName(
  "sidebar-heading bankName"
)[0];
let logoUrl = localStorage.getItem("logoUrl");
if (logoUrl)
  sidebarHeading.innerHTML = `<img id="logoUrl" src="${logoUrl}" width="100px"/>`;

$(".page-loader").fadeOut("fast");
