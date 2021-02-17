const baseURL = "https://api-getaccess.herokuapp.com";
let reports, companyName;

const loadReport = (report, companyName) => {
  const date = new Date(report.pushDate);
  document.querySelector(".table-responsive").innerHTML = "";
  $(".table-responsive").append(buildTable(report.approvedData.data));
  $("#report-name").text(
    report.reportName.split(".")[report.reportName.split(".").length - 1]
  );
  $("#company-name").text(companyName);
  $("#publish-date").text(date.toDateString());
  $("#update-name").text(report.pushedBy);
  console.log(report);
  if (report.reportName.includes("StockStatement")) {
    if (report.approvedData.data.Title)
      $("#report-title").text(report.approvedData.data.Title);
    else
      $("#report-title").text(
        `Stock Statement for ${report.approvedData.data.Period}`
      );
  }
  const annotations = report.approvedData.annotations;
  for (const cell in annotations) {
    const cellElement = document.getElementById(cell);
    cellElement.classList.add("annotated");
    cellElement.setAttribute("data-bs-toggle", "popover");
    cellElement.setAttribute("data-bs-placement", "top");
    cellElement.setAttribute(
      "title",
      `Adjustment: ${annotations[cell].adjustment}`
    );
    cellElement.setAttribute(
      "data-bs-content",
      `Comment: ${annotations[cell].comment}`
    );
  }
  $(function () {
    $('[data-bs-toggle="popover"]').popover();
  });
};

const handleChange = (e) => {
  const idx = document.getElementById("historySelect").value;
  console.log(idx);
  loadReport(reports[idx], companyName);
};

const handleReport = () => {
  document.querySelector(".page-loader").style.visibility = "visible";
  if (!Cookies.get("company-auth"))
    window.location.replace("company_login.html");
  const urlParams = new URLSearchParams(window.location.search);
  reportName = urlParams.get("reportName");
  axios.defaults.headers.common["Authorization"] = Cookies.get("company-auth");
  document.querySelector(".page-loader").style.visibility = "hidden";
  axios
    .get(baseURL + "/company" + "/data/reports/history/" + reportName)
    .then((response) => {
      reports = response.data;
      if (localStorage.getItem("clogoUrl"))
        $(".navbar-brand.h1").html(
          `<img id="clogoUrl" src="${localStorage.getItem(
            "clogoUrl"
          )}" height="36px"/>`
        );
      if (reports.length == 0) {
        console.log("hi");
        document.querySelector(".content-loader").style.visibility = "hidden";
        document.querySelector(".table-responsive").innerHTML =
          "No report pushed yet";
        document.querySelector("#historySelect").style.visibility = "hidden";
        return;
      }
      const historySelect = document.querySelector("#historySelect");
      reports.forEach((report, idx) => {
        const option = document.createElement("option");
        const date = new Date(report.pushDate);
        option.innerText = `${date.toDateString()} by ${report.pushedBy}`;
        option.value = idx;
        if (idx === 0) option.selected = true;
        option.id = idx;
        historySelect.appendChild(option);
      });
      loadReport(reports[0], companyName);
      $(".content-loader").fadeOut("fast");
    })
    .catch((error) => {
      console.log(error);
    });
};

document
  .getElementById("historySelect")
  .addEventListener("change", handleChange);
handleReport();
