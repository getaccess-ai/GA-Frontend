const baseURL = "https://z2o.herokuapp.com";
const companiesRegisteredList = document.getElementById(
  "companies-registered-list"
);
const companiesConnectedList = document.getElementById(
  "companies-connected-list"
);

const companyHTML = (company) => {
  const date = new Date(company.createdAt);
  return `<div class="d-flex w-100 justify-content-between">
            <h5 class="mb-1">${company.name}</h5>
            <small>${date.toDateString()}</small>
        </div>
        <small>${company.companyId}&nbsp;${company.email}&nbsp;</small>
        <span class="badge bg-primary rounded-pill">${
          company.status.charAt(0).toUpperCase() + company.status.slice(1)
        }</span>`;
};

const loadCompanies = () => {
  axios.defaults.headers.common["Authorization"] = Cookies.get("authKey");
  axios
    .get(baseURL + "/bank/companies")
    .then((response) => {
      console.log(response.data);
      let reg = 0,
        conn = 0;
      response.data.results.forEach((company) => {
        const companyListItem = document.createElement("a");
        companyListItem.className = "list-group-item list-group-item-action";
        companyListItem.href = `bank_company.html?companyId=${company.companyId}`;
        companyListItem.innerHTML = companyHTML(company);
        if (company.status === "registered") {
          reg++;
          companiesRegisteredList.appendChild(companyListItem);
        } else {
          conn++;
          companiesConnectedList.appendChild(companyListItem);
        }
      });
      if (reg === 0) {
        const noCompanies = document.createElement("p");
        noCompanies.innerText =
          "Either you haven't added any customers yet, or all of them have connected their accounting softwares.";
        noCompanies.className = "text-muted";
        companiesRegisteredList.appendChild(noCompanies);
      }
      if (conn === 0) {
        const noCompanies = document.createElement("p");
        noCompanies.innerText =
          "You don't have any customers who have connected their accounting softwares.";
        noCompanies.className = "text-muted";
        companiesConnectedList.appendChild(noCompanies);
      }
      $(".content-loader").fadeOut("fast");
    })
    .catch((error) => {
      console.log(error);
    });
};

loadCompanies();
