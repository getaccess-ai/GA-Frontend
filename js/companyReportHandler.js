const pre = document.querySelector("pre");
let reportName;
let report;
let annotations = {};
let curAnnotation;
const myModal = new bootstrap.Modal(document.getElementById("annotationModal"));
const pushModal = new bootstrap.Modal(document.getElementById("pushModal"));
const successModal = new bootstrap.Modal(
  document.getElementById("successModal")
);
const failureModal = new bootstrap.Modal(
  document.getElementById("failureModal")
);
const successBody = document.getElementById("successBody");
const failureBody = document.getElementById("failureBody");

function annotationHandler(id) {
  curAnnotation = id;
  if (annotations[id]) {
    document.querySelector("#adjustment").value = annotations[id].adjustment;
    document.querySelector("#comment").value = annotations[id].comment;
  } else {
    document.querySelector("#adjustment").value = "";
    document.querySelector("#comment").value = "";
  }
  myModal.show();
}

function pushSuccessModal(msg, redirect) {
  successBody.innerText = msg;
  if (redirect) {
    window.location.replace("company_reports.html");
  }
  successModal.show();
}

function pushFailureModal(msg, err) {
  failureBody.innerText = msg;
  console.log(err);
  if (err) {
    console.log(1);
    if (err.response.status == 401 && reportName.split(".").includes("Khata")) {
      document
        .getElementById("closeModalButton")
        .addEventListener("click", (e) =>
          window.location.replace("company_connection_khata.html")
        );
      document.getElementById("closeModalButton").innerText = "Authorize";
      console.log(2);
    }
  }
  failureModal.show();
}

async function handleDelete() {
  try {
    document.querySelector(".page-loader").style.visibility = "visible";
    const resp = await axios.delete(
      `https://api-getaccess.herokuapp.com/company/data/reports/${reportName}`
    );
    pushSuccessModal(
      "This report has been deleted. Press ok to go to report listing.",
      true
    );
  } catch (error) {
    document.querySelector(".page-loader").style.visibility = "hidden";
    pushFailureModal(
      "There was a problem in parsing your request. Please try again.",
      error
    );
  }
}

function saveAnnotation() {
  annotations[curAnnotation] = {
    adjustment: parseFloat(document.querySelector("#adjustment").value),
    comment: document.querySelector("#comment").value,
  };
  document.getElementById(curAnnotation).className = "table-active";
  myModal.hide();
}

async function approveAndPush() {
  pushModal.hide();
  document.querySelector(".page-loader").style.visibility = "visible";
  const body = {
    person: document.querySelector("#person").value,
    annotations: annotations,
  };
  if (!body.person) {
    alert("Please put your name to push!");
    document.querySelector(".page-loader").style.visibility = "hidden";
    return;
  }
  console.log(body);
  try {
    const resp = await axios.post(
      `https://api-getaccess.herokuapp.com/company/data/reports/${report.name}`,
      body
    );
    document.querySelector(".page-loader").style.visibility = "hidden";
    pushSuccessModal(
      "The report has been pushed. Press ok to go to the report listing. Press close to continue editing"
    );
  } catch (error) {
    document.querySelector(".page-loader").style.visibility = "hidden";
    console.log(error.response.data);
    pushModal.hide();
    pushFailureModal(
      "There was a problem in parsing your request. Please try again."
    );
  }
}

const loadReport = async () => {
  $(".table-responsive").append(buildTable(report.data, annotationHandler));
  if (localStorage.getItem("clogoUrl"))
    $("span").html(
      `<div><img id="clogoUrl" src="${localStorage.getItem(
        "clogoUrl"
      )}" height="36px"/>&nbsp;&nbsp;${
        report.name.split(".")[report.name.split(".").length - 1]
      }</div>`
    );
  else
    $("span").text(report.name.split(".")[report.name.split(".").length - 1]);
  document.querySelector(".page-loader").style.visibility = "hidden";
};

const fetchReport = async () => {
  try {
    const resp = await axios.get(
      `https://api-getaccess.herokuapp.com/company/data/reports/${reportName}`
    );
    report = resp.data;
    return true;
  } catch (error) {
    console.log(error.response.data.error);
    document.querySelector(".page-loader").style.visibility = "hidden";
    const msg = error.response
      ? error.response.data.error
      : "Something went wrong";
    pushFailureModal(msg, error);
    return false;
  }
};

const handleLoad = async (e) => {
  document.querySelector(".page-loader").style.visibility = "visible";
  if (!Cookies.get("company-auth"))
    window.location.replace("company_login.html");
  const urlParams = new URLSearchParams(window.location.search);
  reportName = urlParams.get("reportName");
  axios.defaults.headers.common["Authorization"] = Cookies.get("company-auth");
  if (await fetchReport()) loadReport();
};
