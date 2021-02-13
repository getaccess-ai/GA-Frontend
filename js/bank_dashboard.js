const baseURL = "https://api-getaccess.herokuapp.com";

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

      var ctx = document.getElementById("myAreaChart").getContext("2d");
      var chart = new Chart(ctx, {
        // The type of chart we want to create
        type: "line",

        // The data for our dataset
        data: {
          labels: labels,
          datasets: [
            {
              label: "Customers Added Over Time",
              borderColor: "rgb(104,133,219)",
              data: data,
              lineTension: 0.5,
            },
          ],
        },

        // Configuration options go here
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            xAxes: [
              {
                type: "time",
                time: {
                  tooltipFormat: "ll HH:mm",
                  unit: "day",
                  unitStepSize: 1,
                  displayFormats: {
                    day: "MMM D YYYY",
                  },
                },
                scaleLabel: {
                  display: true,
                  labelString: "Date",
                },
                gridLines: {
                  display: false,
                },
                ticks: {
                  autoSkip: true,
                  maxTicksLimit: 8,
                },
              },
            ],
            yAxes: [
              {
                scaleLabel: {
                  display: true,
                  labelString: "Companies",
                },
                ticks: {
                  autoSkip: true,
                  maxTicksLimit: 8,
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
