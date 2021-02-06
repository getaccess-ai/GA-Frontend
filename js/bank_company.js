const baseURL = "https://z2o.herokuapp.com";

const reportsHTML = (company, reports) => {
  const reportsList = document.createElement("div");
  reportsList.className = "list-group list-group-flush";
  reports.forEach((report) => {
    const date = new Date(report.lastPublishDate);
    const reportListItem = document.createElement("a");
    reportListItem.className = "list-group-item list-group-item-action";
    reportListItem.href = `bank_company_report.html?companyId=${company.companyId}&companyName=${company.name}&reportName=${report.name}`;
    reportListItem.innerHTML = `<div class="d-flex w-100 justify-content-between">
                                        <h5 class="mb-1">${report.name.split(".")[report.name.split(".").length - 1]}</h5>
                                        <small>${date.toDateString()}</small>
                                    </div>
                                    <small>Submitted By: ${
                                      report.lastUpdateMadeBy
                                    }</small>`;
    reportsList.appendChild(reportListItem);
  });
  return reportsList.innerHTML;
};

const companyReportsHTML = (company, reports) => {
  if (reports.totalResults === 0) {
    return `
            <ul class="list-group list-group-flush">
                <li class="list-group-item"><b>This company hasn't submitted any reports yet.</b></li>
            </ul>
        `;
  }
  return reportsHTML(company, reports.reports);
};

const detailsHTML = (company) => {
  const date = new Date(company.createdAt);
  return `
    <ul class="list-group list-group-flush">
        <li class="list-group-item"><b>ID:</b> ${company.companyId}</li>
        <li class="list-group-item"><b>Email:</b> ${company.email}</li>
        <li class="list-group-item"><b>Type:</b> ${company.companyType}</li>
        <li class="list-group-item"><b>Region:</b> ${company.region}</li>
        <li class="list-group-item"><b>CIF:</b> ${company.CIF}</li>
        <li class="list-group-item"><b>Business Line:</b> ${
          company.businessLine
        }</li>
        <li class="list-group-item"><b>Created:</b> ${date.toDateString()}</li>
    </ul>
    `;
};

const connectionHTML = (company) => {
  if (!company.dataConnection) {
    return `
        <ul class="list-group list-group-flush">
            <li class="list-group-item"><b>This company hasn't connected an accounting software yet.</b></li>
        </ul>
        `;
  }
  return `
    <ul class="list-group list-group-flush">
        <li class="list-group-item"><b>Platform:</b> ${
          company.dataConnection.name.charAt(0).toUpperCase() +
          company.dataConnection.name.slice(1)
        }</li>
    </ul>
    `;
};

const settingsHTML = (settings) => {
  return `
        <ul class="list-group list-group-flush">
            <li class="list-group-item"><b>Update Period:</b> ${settings.updatePeriod}</li>
            <li class="list-group-item"><b>Allowed to Change Connection:</b> ${settings.allowedToChangeConnection}</li>
        </ul>
    `;
};

const statusToColor = (status) => {
  if(status === 'registered') return 'secondary'
  if(status === 'connected') return 'primary'
  return 'info'
}

const companyHTML = (company, settings, reports) => {
  return `
            <div class="d-flex w-100 justify-content-between">
            <h1>${
              company.name
            } &nbsp; <span class="badge bg-${statusToColor(company.status)} rounded-pill">${
    company.status.charAt(0).toUpperCase() + company.status.slice(1)
  }</span></h1>
            <div>
                <a class="btn btn-primary" href="bank_edit_company.html?companyId=${
                  company.companyId
                }" role="button">Edit</a>
                <a class="btn btn-secondary" href="bank_edit_company_settings.html?companyId=${
                  company.companyId
                }" role="button">Edit Settings</a>
                <a class="btn btn-danger" id="delete-company" role="button">Delete</a>
            </div>
            </div>
        <div class="w-100 separator mt-2 shadow"></div>
        <div class="container mt-4">
            <div class="row">
            <div class="col-sm">
                <h2>Details</h2>
                <div class="w-100 separator mt-2 shadow-sm"></div>
                ${detailsHTML(company)}
            </div>
            <div class="col-sm">
                <div class="row">
                    <div class="col-sm">
                        <h2>Connection</h2>
                        <div class="w-100 separator mt-2 shadow-sm"></div>
                        ${connectionHTML(company)}
                    </div>
                </div>
                <div class="row">
                    <div class="col-sm">
                        <h2>Settings</h2>
                        <div class="w-100 separator mt-2 shadow-sm"></div>
                        ${settingsHTML(settings)}
                    </div>
                </div>
            </div>
            
            </div>
        </div>
        <div class="container mt-4">
            <div class="row">
                <div class="col-sm">
                <h2>Reports <span class="badge bg-primary rounded-pill">${
                  reports.totalResults
                }</span></h2>
                <div class="w-100 separator mt-2 shadow-sm"></div>
                    ${companyReportsHTML(company, reports)}
                </div>
            </div>
        </div>
    `;
};

const deleteCompany = (company) => {
  if (
    confirm(
      "Are you sure you want to delete this company? This is not reversible."
    )
  ) {
    $(".page-loader").fadeIn("fast");
    axios.defaults.headers.common["Authorization"] = Cookies.get("authKey");
    axios
      .delete(baseURL + "/bank/companies/" + company.companyId)
      .then((response) => {
        console.log(response.data);
        document.location.href = "bank_companies.html";
      })
      .catch((error) => {
        console.log(error);
        document.location.href = "bank_companies.html";
      });
  } else {
    console.log("Cancelled.");
  }
};

const loadCompany = () => {
  axios.defaults.headers.common["Authorization"] = Cookies.get("authKey");
  const urlParams = new URLSearchParams(window.location.search);
  const companyId = urlParams.get("companyId");
  axios
    .get(baseURL + "/bank/companies/" + companyId)
    .then((responseCompany) => {
      const company = responseCompany.data;
      axios
        .get(baseURL + "/bank/companies/" + company.companyId + "/settings")
        .then((responseSettings) => {
          const settings = responseSettings.data;
          axios
            .get(
              baseURL + "/bank/companies/" + company.companyId + "/data/reports"
            )
            .then((responseReports) => {
              const reports = responseReports.data;
              document.getElementById("company").innerHTML = companyHTML(
                company,
                settings,
                reports
              );
              document
                .getElementById("delete-company")
                .addEventListener("click", (e) => {
                  deleteCompany(company);
                });
              $(".content-loader").fadeOut("fast");
            })
            .catch((error) => {
              console.log(error);
              document.location.href = "bank_companies.html";
            });
        })
        .catch((error) => {
          console.log(error);
          document.location.href = "bank_companies.html";
        });
    })
    .catch((error) => {
      console.log(error);
      document.location.href = "bank_companies.html";
    });
};

loadCompany();
