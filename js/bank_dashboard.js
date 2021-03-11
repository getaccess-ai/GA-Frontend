const baseURL = "https://api-getaccess.herokuapp.com";
let chart;

const handleclick = () => {
  console.log("hi");
};

const loadCompanies = () => {
  axios.defaults.headers.common["Authorization"] = Cookies.get("authKey");
  axios
    .get(baseURL + "/bank/companies")
    .then((response) => {
      console.log(response.data);
      $("#total-companies").text(response.data.results.length);
      let conn = 0,
        rep = 0,
        i = 0;
      let labels = [],
        data = [];
      response.data.results.forEach((company) => {
        if (company.status !== "registered") conn++;
        company.reports.forEach((report) => {
          if (report.hasOwnProperty("approvedData")) rep++;
        });
        i++;
        labels.push(company.createdAt);
        data.push(i);
      });
      $("#connected-companies").text(conn);
      $("#total-reports").text(rep);

      var ctx = document.getElementById("waterfallChart").getContext("2d");
      // document
      //   .getElementById("myAreaChart")
      //   .addEventListener("click", handleclick);

      chart = new Chart(ctx, {
        responsive: true,
        maintainAspectRatio: false,
        type: "bar",
        data: {
          labels: [
            "Total Added",
            "Not Connected",
            "Connected",
            "Not Active",
            "Active",
          ],
          datasets: [
            {
              data: [10, [7, 10], [0, 7], [6, 7], [0, 6]],
              backgroundColor: [
                "#b03060",
                "#b7446f",
                "#bf597f",
                "#c76e8f",
                "#cf829f",
              ],
              barPercentage: 1,
            },
          ],
        },
        options: {
          legend: {
            display: false,
          },
          scales: {
            yAxes: [
              {
                ticks: {
                  beginAtZero: true,
                },
              },
            ],
          },
        },
      });

      var ctx1 = document.getElementById("periodChart").getContext("2d");
      let chart1 = new Chart(ctx1, {
        responsive: true,
        maintainAspectRatio: false,
        type: "bar",
        data: {
          labels: ["Sep-20", "Oct-20", "Nov-20", "Dec-20", "Jan-21", "Feb-21"],
          datasets: [
            {
              data: [10, 9, 15, 8, 8, 10],
              barPercentage: 1,
            },
          ],
        },
        options: {
          legend: {
            display: false,
          },
          scales: {
            yAxes: [
              {
                ticks: {
                  beginAtZero: true,
                },
              },
            ],
          },
        },
      });
      $(".content-loader").fadeOut("fast");
    })
    .catch((error) => {
      console.log(error);
    });
};

loadCompanies();
