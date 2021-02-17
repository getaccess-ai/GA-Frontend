const quickbooks = document.getElementById("quickbooks");
const zoho = document.getElementById("zoho");
const tally = document.getElementById("tally");
const khata = document.getElementById("khata");
quickbooks.addEventListener("click", handleConnectClick);
zoho.addEventListener("click", handleConnectClick);
tally.addEventListener("click", handleConnectClick);
khata.addEventListener("click", handleConnectClick);
let company;

async function handleConnectClick(e) {
  e.preventDefault();
  document.querySelector(".page-loader").style.visibility = "visible";
  const type = e.target.id;

  //Zoho
  if (type === "zoho") {
    const resp = await axios.post(
      "https://api-getaccess.herokuapp.com/company/connection/zoho"
    );
    const redirectUri = resp.data.redirect_url;
    const connectChild = window.open(
      redirectUri,
      "ConnectWindow",
      "toolbar=0,status=0,width=626,height=436"
    );
    const timer = setInterval(() => {
      if (connectChild.closed) {
        location.reload();
        clearInterval(timer);
      }
    }, 500);
  }

  //Quickbooks
  if (type === "quickbooks") {
    const resp = await axios.post(
      "https://api-getaccess.herokuapp.com/company/connection/quickbooks"
    );
    const redirectUri = resp.data.redirect_url;
    const connectChild = window.open(
      redirectUri,
      "ConnectWindow",
      "toolbar=0,status=0,width=626,height=436"
    );
    const timer = setInterval(() => {
      if (connectChild.closed) {
        location.reload();
        clearInterval(timer);
      }
    }, 500);
  }

  //Xero
  if (type === "xero") {
    const resp = await axios.post(
      "https://api-getaccess.herokuapp.com/company/connection/xero"
    );
    const redirectUri = resp.data.redirect_url;
    const connectChild = window.open(
      redirectUri,
      "ConnectWindow",
      "toolbar=0,status=0,width=626,height=436"
    );
    const timer = setInterval(() => {
      if (connectChild.closed) {
        location.reload();
        clearInterval(timer);
      }
    }, 500);
  }
  //Khata
  if (type === "khata") {
    const connectChild = window.open(
      "company_connection_khata.html",
      "ConnectWindow",
      "toolbar=0,status=0,width=626,height=436"
    );
    const timer = setInterval(() => {
      if (connectChild.closed) {
        location.reload();
        clearInterval(timer);
      }
    }, 500);
  }
  if (type === "tally") {
    try {
      const resp = await axios.get(`http://localhost:${port}`);
      if (resp) {
        const reqBody = {
          name: "tally",
          refreshToken: "NA",
          accessToken: "NA",
          endpoint: "http://localhost:9000",
          expiryDate: Date.now(),
        };
        try {
          const resp = await axios.post(
            `https://api-getaccess.herokuapp.com/company/connection`,
            reqBody
          );
          location.reload();
        } catch (err) {
          console.log(err.response.data);
          document.querySelector(".page-loader").style.visibility = "hidden";
          alert("Something went wrong. Please try Again");
        }
      }
    } catch (error) {
      console.log(error);
      document.querySelector(".page-loader").style.visibility = "hidden";
      alert("Please check whether tally is acting as a server on port 9000.");
    }
    return;
  }
}

const handleSubmit = async (e) => {
  e.preventDefault();
  document.querySelector(".page-loader").style.visibility = "visible";
  const companyReference = document.querySelector("#companyReference").value;
  try {
    const resp = await axios.put(
      "https://api-getaccess.herokuapp.com/company/connection",
      {
        companyReference,
      }
    );
    location.reload();
  } catch (error) {
    console.log(error);
    alert("Something went wrong");
  }
};

const loadValues = async () => {
  try {
    if (company.platform === "zoho") {
      const resp = await axios.get(
        "https://api-getaccess.herokuapp.com/company/data/reports/GA.Reports.Zoho.OrganizationsData"
      );
      const report = resp.data;
      const selector = document.querySelector("#companyReference");
      selector.innerHTML = "";
      report.data.forEach((orgzn) => {
        const option = document.createElement("option");
        option.value = orgzn.organization_id;
        option.text = orgzn.name;
        selector.appendChild(option);
      });
      document.querySelector("#submitParam").style.visibility = "visible";
    } else if (company.platform === "xero") {
      const resp = await axios.get(
        "https://api-getaccess.herokuapp.com/company/data/reports/GA.Reports.Xero.OrganizationsData"
      );
      const report = resp.data;
      const selector = document.querySelector("#companyReference");
      selector.innerHTML = "";
      report.data.forEach((orgzn) => {
        const option = document.createElement("option");
        option.value = orgzn.tenantId;
        option.text = orgzn.tenantName;
        selector.appendChild(option);
      });
      document.querySelector("#submitParam").style.visibility = "visible";
    } else if (company.platform === "khata") {
      const books = company.dataConnection.other.books;
      const selector = document.querySelector("#companyReference");
      selector.innerHTML = "";
      books.forEach((book) => {
        const option = document.createElement("option");
        option.value = book.book_id;
        option.text = book.business_name;
        selector.appendChild(option);
      });
      document.querySelector("#submitParam").style.visibility = "visible";
    }
  } catch (error) {
    console.log(error);
    alert("Something went wrong");
  }
};

const getCompanyInfo = () => {
  const paramName =
    company.platform === "zoho" ? "Organization Id" : "Company Name";
  const param =
    company.platform === "zoho" ? "organization_id" : "company_name";
  document.querySelector("#body-container").innerHTML = `
    <div class="container-fluid company-content">
        <div class="form-wrapper">
            <h1>Specify the ${paramName}</h1>
            <br/>
            <form id="select-form">
                <select class="form-select" id="companyReference">
                    <option selected>Loading values</option>
                </select>
                <br>
                <button  id="submitParam" style="visiblity:none;" class="btn btn-primary">Submit</button>
            </form>
            <br>
        </div>
    </div>`;
  document
    .querySelector("#submitParam")
    .addEventListener("click", handleSubmit);
  loadValues();
};

async function handleLoad() {
  if (!Cookies.get("company-auth"))
    window.location.replace("company_login.html");
  if (localStorage.getItem("clogoUrl"))
    document.getElementsByClassName(
      "navbar-brand h1"
    )[0].innerHTML = `<img id="clogoUrl" src="${localStorage.getItem(
      "clogoUrl"
    )}" height="36px"/>`;
  axios.defaults.headers.common["Authorization"] = Cookies.get("company-auth");
  try {
    const resp = await axios.get(
      "https://api-getaccess.herokuapp.com/company/data"
    );
    company = resp.data;
    if (company.status === "connected")
      window.location.replace("company_reports.html");
    else if (company.status == "linked") getCompanyInfo();
    else document.querySelector("div.container").style.visibility = "visible";
  } catch (error) {
    Cookies.remove("company-auth");
    window.location.replace("company_login.html");
  }
}
