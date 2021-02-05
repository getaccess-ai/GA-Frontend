const loginForm = document.getElementById("login-form");
let phoneNo, company, otp;

const handleOTP = async (e) => {
  e.preventDefault();
  document.querySelector(".page-loader").style.visibility = "visible";
  otp = document.getElementById("phone").value;
  try {
    const resp = await axios.post(
      `https://z2o.herokuapp.com/company/connection/khata`,
      {
        phone: phoneNo,
        otp,
      },
      { headers: { Authorization: Cookies.get("company-auth") } }
    );
    alert("done!");
    window.close();
    window.location.replace("company_reports.html");
  } catch (err) {
    console.log(err);
    alert("Something went wrong!");
    window.close();
  }
};

const handleSubmit = async (e) => {
  e.preventDefault();
  document.querySelector(".page-loader").style.visibility = "visible";
  phoneNo = document.getElementById("phone").value;
  try {
    const resp = await axios.get(
      `https://z2o.herokuapp.com/company/connection/khata?phone=${phoneNo}`,
      { headers: { Authorization: Cookies.get("company-auth") } }
    );
    loginForm.onsubmit = handleOTP;
    document.getElementById("phoneLabel").innerText = "Enter the otp sent";
    document.getElementById("phone").value = "";
    document.querySelector(".page-loader").style.visibility = "hidden";
  } catch (err) {
    console.log(err.response.data);
    alert("Something went wrong!");
    window.close();
  }
};

async function handleLoad() {
  document.querySelector(".page-loader").style.visibility = "visible";
  if (!Cookies.get("company-auth")) window.close();
  axios.defaults.headers.common["Authorization"] = Cookies.get("company-auth");
  try {
    const resp = await axios.get("https://z2o.herokuapp.com/company/data");
    company = resp.data;
    console.log(company);
    if (company.status === "connected" && company.platform !== "nil")
      window.close();
    else if (company.status === "linked")
      window.location.replace("company_connection.html");
    else document.querySelector(".page-loader").style.visibility = "hidden";
    loginForm.onsubmit = handleSubmit;
  } catch (error) {
    Cookies.remove("company-auth");
    window.location.replace("company_login.html");
  }
}
handleLoad();
