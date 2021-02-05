const baseURL = "https://z2o.herokuapp.com";
let reports, companyName;

const loadReport = (report, companyName) => {
  const date = new Date(report.pushDate);
  document.querySelector(".table-responsive").innerHTML = "";
  $(".table-responsive").append(buildTable(report.approvedData.data));
  $("#report-name").text(report.reportName);
  $("#company-name").text(companyName);
  $("#publish-date").text(date.toDateString());
  $("#update-name").text(report.pushedBy);
  console.log(report);
  if (report.reportName.includes("StockStatement")) {
    if (report.approvedData.data.Title)
      $("#report-title").text(report.approvedData.data.Title);
    else
      $("#report-title").text(
        `Stock Statement for ${report.approvedData.data.Period}: ${companyName}`
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
  const urlParams = new URLSearchParams(window.location.search);
  const name = urlParams.get("reportName");
  const companyId = urlParams.get("companyId");
  companyName = urlParams.get("companyName");
  axios.defaults.headers.common["Authorization"] = Cookies.get("authKey");
  axios
    .get(
      baseURL + "/bank/companies/" + companyId + "/data/reports/history/" + name
    )
    .then((response) => {
      reports = response.data;
      console.log(reports[0]);
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
