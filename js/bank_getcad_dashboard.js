const baseURL = "https://api-getaccess.herokuapp.com";
let chart,
  curIdx = 0,
  custList;
let mp = {
  0: "Total",
  1: "NotConnected",
  2: "Connected",
  3: "NotActive",
  4: "Active",
};
const handleclick = (evt) => {
  let activeElement = chart.getElementAtEvent(evt);
  curIdx = activeElement[0]._index;
  renderTable(custList[mp[curIdx]].data);
};

const getAction = (ind) => {
  const vbtn = `<a href="bank_company.html?companyId=${custList.mapping[ind]}">View Reports</a>`;
  const rbtn = `<a href="#">Send Reminder</a>`;
  if (curIdx == 4 || custList["Active"].data.includes(ind)) return vbtn;
  else if (
    curIdx == 1 ||
    curIdx == 3 ||
    custList["NotActive"].data.includes(ind) ||
    custList["NotConnected"].data.includes(ind)
  )
    return rbtn;
};

const renderTable = (obj) => {
  const tbl = document.getElementById("customer-list");
  tbl.innerHTML = "";
  const thd = document.createElement("thead");
  thd.innerHTML = `
  <th>Sr. No</th>
  <th>Name</th>
  <th>Action</th>
  `;
  tbl.appendChild(thd);
  let count = 1;
  for (let ind of obj) {
    const trw = document.createElement("tr");
    trw.innerHTML = `
    <td>${count}</td>
    <td>${ind}</td>
    <td>${getAction(ind)}</td>
    `;
    tbl.appendChild(trw);
    count++;
  }
};

const loadCompanies = async () => {
  axios.defaults.headers.common["Authorization"] = Cookies.get("authKey");
  let ctx = document.getElementById("waterfallChart").getContext("2d");
  document
    .getElementById("waterfallChart")
    .addEventListener("click", handleclick);

  const resp = await axios.get(
    "https://api-getaccess.herokuapp.com/bank/aggregations/companyBreakup"
  );
  console.log(resp);
  custList = resp.data;
  renderTable(custList.Total.data);
  const total = custList["Total"].count,
    notConnected = custList["NotConnected"].count,
    connected = custList["Connected"].count,
    notActive = custList["NotActive"].count,
    active = custList["Active"].count;
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
          data: [
            total,
            [connected, total],
            [0, connected],
            [active, connected],
            [0, active],
          ],
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

  let ctx1 = document.getElementById("periodChart").getContext("2d");
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
};

loadCompanies();