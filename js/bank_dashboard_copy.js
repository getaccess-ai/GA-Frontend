const baseURL = "https://api-getaccess.herokuapp.com";

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

      var ctx = document.getElementById("myAreaChart").getContext("2d");
      document
        .getElementById("myAreaChart")
        .addEventListener("click", handleclick);
      const dat = {
        datasets: [
          {
            label: "Added",
            data: [10],
            backgroundColor: "#6495ed",
            stack: "stack 1",
          },
          {
            data: [2],
            waterfall: {
              dummyStack: true,
            },
            stack: "stack 1",
          },
          {
            label: "Not connected",
            data: [3],
            backgroundColor: "#ecebbd",
            stack: "stack 2",
          },
          {
            label: "Connected",
            data: [7],
            backgroundColor: "#3cb371",
            stack: "stack 2",
          },
          {
            data: [3],
            waterfall: {
              dummyStack: true,
            },
            stack: "stack 3",
          },
          {
            label: "Active",
            data: [6],
            backgroundColor: "#696969",
            stack: "stack 3",
          },
          {
            label: "Inactive",
            data: [1],
            backgroundColor: "#dcdcdc",
            stack: "stack 3",
          },
        ],
      };

      var chart = new Chart(ctx, {
        responsive: true,
        maintainAspectRatio: false,
        type: "bar",
        data: {
          labels: [
            "Not Connected",
            "Connected",
            "Not Active",
            "Active",
            "Total Added",
          ],
          datasets: [
            {
              data: [[0, 3], [3, 10], [3, 4], [4, 10], 10],
              backgroundColor: [
                "#d29baf",
                "#d29baf",
                "#d29baf",
                "#d29baf",
                "#d29baf",
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
      // var chart = new Chart(ctx, {
      //   // The type of chart we want to create
      //   type: "line",

      //   // The data for our dataset
      //   data: {
      //     labels: labels,
      //     datasets: [
      //       {
      //         label: "Customers Added Over Time",
      //         borderColor: "rgb(104,133,219)",
      //         data: data,
      //         lineTension: 0.5,
      //       },
      //     ],
      //   },

      //   // Configuration options go here
      //   options: {
      //     responsive: true,
      //     maintainAspectRatio: false,
      //     scales: {
      //       xAxes: [
      //         {
      //           type: "time",
      //           time: {
      //             tooltipFormat: "ll HH:mm",
      //             unit: "day",
      //             unitStepSize: 1,
      //             displayFormats: {
      //               day: "MMM D YYYY",
      //             },
      //           },
      //           scaleLabel: {
      //             display: true,
      //             labelString: "Date",
      //           },
      //           gridLines: {
      //             display: false,
      //           },
      //           ticks: {
      //             autoSkip: true,
      //             maxTicksLimit: 8,
      //           },
      //         },
      //       ],
      //       yAxes: [
      //         {
      //           scaleLabel: {
      //             display: true,
      //             labelString: "Companies",
      //           },
      //           ticks: {
      //             autoSkip: true,
      //             maxTicksLimit: 8,
      //           },
      //         },
      //       ],
      //     },
      //   },
      // });

      $(".content-loader").fadeOut("fast");
    })
    .catch((error) => {
      console.log(error);
    });
};

loadCompanies();
