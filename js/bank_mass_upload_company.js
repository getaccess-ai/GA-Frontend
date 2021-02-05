const baseURL = "https://z2o.herokuapp.com";
let result = [];

handleFileSelect = (event) => {
  result = [];
  $(".page-loader").fadeIn("fast");
  let file = event.target.files[0];
  if (file.name.split(".")[file.name.split(".").length - 1] !== "xlsx") {
    alert("Only xlsx files are accepted!");
    $(".page-loader").fadeOut("fast");
    return;
  }

  let reader = new FileReader();

  reader.onload = function (e) {
    let res = e.target.result;
    let data = new Uint8Array(res);
    let arr = new Array();
    for (let i = 0; i != data.length; ++i)
      arr[i] = String.fromCharCode(data[i]);
    let bstr = arr.join("");

    let workbook = XLSX.read(bstr, {
      type: "binary",
    });

    let first_sheet_name = workbook.SheetNames[0];

    let worksheet = workbook.Sheets[first_sheet_name];
    let parsed = XLSX.utils.sheet_to_json(worksheet, {
      raw: true,
    });
    parsed.forEach((company) => {
      result.push({
        name: company.name,
        email: company.email,
        companyType: company.companyType || "",
        region: company.region || "",
        CIF: company.CIF || "",
        businessLine: company.businessLine || "",
        companyId: company.companyId,
      });
    });
    console.log(result);
    document.querySelector(".table-responsive").innerHTML = "";
    $(".table-responsive").append(buildTable(result));
    $("#massUpload").css("visibility", "visible");
    $(".page-loader").fadeOut("fast");
  };
  reader.readAsArrayBuffer(file);
};

validateEmail = (email) => {
  const re = /\S+@\S+\.\S+/;
  return re.test(email);
};

handleMassUpload = (e) => {
  let validated = true;
  result.forEach((company, index) => {
    if (
      !(
        company.name &&
        company.email &&
        company.companyId &&
        validateEmail(company.email)
      )
    ) {
      if (validated) {
        validated = false;
        alert(`Customer ${index + 1} has some required fields missing.`);
      }
    }
  });
  if (validated) {
    $(".page-loader").fadeIn("fast");
    axios.defaults.headers.common["Authorization"] = Cookies.get("authKey");
    console.log(result);
    axios
      .post(baseURL + "/bank/companies/mass", { companies: result })
      .then((response) => {
        document.location.href = "bank_companies.html";
      })
      .catch((error) => {
        console.log(error);
        $(".page-loader").fadeOut("fast");
        alert(error.response.data.error || "Your request didn't validate");
      });
  }
};

document
  .getElementById("fileInput")
  .addEventListener("change", handleFileSelect, false);
document.getElementById("fileInput").addEventListener("click", (e) => {
  e.target.value = null;
});
document
  .getElementById("massUpload")
  .addEventListener("click", handleMassUpload);
