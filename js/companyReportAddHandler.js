const body = document.querySelector("body");
const reportSelector = document.getElementById("report-name");
const form = document.getElementById("add-form");
const failureModal = new bootstrap.Modal(
  document.getElementById("failureModal")
);
let reports, company;

function pushFailureModal(msg, err) {
  failureBody.innerText = msg;
  console.log(err);
  failureModal.show();
}

const clickHandler = async (e) => {
  e.preventDefault();
  document.querySelector(".page-loader").style.visibility = "visible";
  const idx = reportSelector.value;
  if (idx === -1) return;
  const name = reports[idx].name;
  const formData = new FormData(form);
  const allParams = Object.fromEntries(formData.entries());
  const params = {};
  let emptyValue = false;
  const missingParams = [];
  Object.keys(allParams).forEach((paramKey) => {
    if (!paramKey.startsWith("~__")) {
      if (allParams[paramKey] === "") {
        missingParams.push(paramKey);
        emptyValue = true;
      }
      params[paramKey] = allParams[paramKey];
    }
  });
  if (emptyValue) {
    document.querySelector(".page-loader").style.visibility = "hidden";
    pushFailureModal(`${missingParams.join(", ")} params not specified`);
    return;
  }
  const req = { name, params };
  try {
    const resp = await axios.post(
      "https://z2o.herokuapp.com/company/data/reports",
      req
    );
    Object.keys(params).forEach((paramKey) => {
      if (allParams[`~__${paramKey}`])
        localStorage.setItem(paramKey, params[paramKey]);
    });
    window.location.replace("company_reports.html");
  } catch (error) {
    document.querySelector(".page-loader").style.visibility = "hidden";
    const status = error.response.status;
    console.log(error.response.data);
    pushFailureModal(error.response.data.error);
  }
};

const getGroup = (param) => {
  const outerDiv = document.createElement("div");
  outerDiv.className = "input-group mb-3";
  const innerDiv = document.createElement("div");
  innerDiv.className = "input-group-text";
  innerDiv.innerHTML = `
        <label class="me-2">${param}: Default </label>
        <input class="form-check-input" name="~__${param}" type="checkbox" value="Default" aria-label="Checkbox for following text input">`;
  outerDiv.appendChild(innerDiv);
  return outerDiv;
};

const changeHandler = async (e) => {
  const idx = reportSelector.value;
  form.innerHTML = "";
  if (idx === -1) return;
  const report = reports[idx];
  report.requiredParams.forEach((param) => {
    if (!param) return;
    const group = getGroup(param);
    const input = document.createElement("input");
    if (param.includes("date")) input.type = "date";
    else input.type = "text";
    input.className = "form-control";
    input.placeholder = `Enter ${param}`;
    input.autocomplete = "off";
    const prevValue = localStorage.getItem(param);
    if (prevValue) input.value = prevValue;
    input.name = param;
    input.required = true;
    input.id = param;
    group.appendChild(input);
    form.appendChild(group);
  });
  const lineBreak = document.createElement("br");
  form.appendChild(lineBreak);
  const button = document.createElement("button");
  button.id = "submit";
  button.innerText = "Add Report";
  button.type = "submit";
  button.addEventListener("click", clickHandler);
  button.className = "btn btn-primary";
  form.appendChild(button);
};

const loadReports = async () => {
  reportSelector.innerHTML = "";
  let optgroupmap = {};
  reports.forEach((report, reportIdx) => {
    const option = document.createElement("option");
    option.value = reportIdx;
    option.innerText = report.name.split(".")[
      report.name.split(".").length - 1
    ];
    if (report.category in optgroupmap) {
      optgroupmap[report.category].appendChild(option);
    } else {
      const optgroup = document.createElement("optgroup");
      optgroup.label = report.category;
      optgroupmap[report.category] = optgroup;
      optgroupmap[report.category].appendChild(option);
    }
  });
  for (const optgroup in optgroupmap) {
    reportSelector.appendChild(optgroupmap[optgroup]);
  }
  const option = document.createElement("option");
  option.value = -1;
  option.innerText = "Select a report from the list";
  option.selected = true;
  reportSelector.appendChild(option);
  reportSelector.addEventListener("change", changeHandler);
};

const handleLoad = async (e) => {
  if (!Cookies.get("company-auth"))
    window.location.replace("company_login.html");

  let sidebarHeading = document.getElementsByClassName("sidebar-heading")[0];
  if (Cookies.get("clogoUrl"))
    sidebarHeading.innerHTML = `<img id="clogoUrl" src="${Cookies.get(
      "clogoUrl"
    )}" height="36px"/>`;

  axios.defaults.headers.common["Authorization"] = Cookies.get("company-auth");
  try {
    const cresp = await axios.get("https://z2o.herokuapp.com/company/data");
    company = cresp.data;
    if (company.status !== "connected")
      window.location.replace("company_connection.html");
    const resp = await axios.get(
      "https://z2o.herokuapp.com/company/data/reports/all"
    );
    reports = resp.data.reports;
    loadReports();
  } catch (error) {
    if (error.response.status == 404)
      window.location.replace("company_connection.html");
    Cookies.remove("company-auth");
    window.location.replace("company_login.html");
  }
};
