function buildTable(data, clickFunc, curId, headers) {
  // If the params are not supplied
  if (!clickFunc) clickFunc = (id) => console.log(id);
  if (curId && curId !== "") curId += "||";
  else curId = "";

  // If the data is a js object
  if (!Array.isArray(data) && typeof data === "object") {
    let table;
    if (!headers) {
      table = getTable();
      const tbody = document.createElement("tbody");
      if (!data) {
        const cell = document.createElement("p");
        cell.innerHTML = "";
        return cell;
      }
      Object.keys(data).forEach((key) => {
        const row = document.createElement("tr");

        const cellHead = document.createElement("th");
        const elementHead = buildTable(key, clickFunc, curId + key + "head");
        cellHead.className = "table-light";
        cellHead.appendChild(elementHead);
        row.appendChild(cellHead);

        const cell = document.createElement("td");
        const element = buildTable(data[key], clickFunc, curId + key);
        cell.appendChild(element);
        if (element.nodeName === "P") {
          cell.onclick = () => clickFunc(curId + key);
          cell.id = curId + key;
          cell.style.cursor = "pointer";
        }
        row.appendChild(cell);

        tbody.appendChild(row);
      });
      table.appendChild(tbody);
      return table;
    }
    const row = document.createElement("tr");
    headers.forEach((header) => {
      const cell = document.createElement("td");
      const element = buildTable(data[header], clickFunc, curId + header);
      cell.appendChild(element);
      if (element.nodeName === "P") {
        cell.onclick = () => clickFunc(curId + header);
        cell.id = curId + header;
        cell.style.cursor = "pointer";
      }
      row.appendChild(cell);
    });
    return row;
  }

  // If its a terminal element like a number or string
  if (!Array.isArray(data)) {
    const cell = document.createElement("p");
    try {
      cell.innerText = data.toString();
    } catch (e) {
      cell.innerHTML = "";
    }
    return cell;
  }

  // If it is a table
  const table = getTable();
  const headersCur = getHeaders(data);
  table.appendChild(getHeadersHtml(headersCur));
  const tbody = document.createElement("tbody");
  data.forEach((element, idx) => {
    const rowReturned = buildTable(
      element,
      clickFunc,
      curId + idx.toString(),
      headersCur
    );
    const row = document.createElement("tr");
    if (rowReturned.nodeName !== "TR") {
      row.appendChild(rowReturned);
      tbody.append(row);
    } else tbody.append(rowReturned);
  });
  table.appendChild(tbody);
  return table;
}

function getHeaders(objs) {
  const headers = new Set();
  objs.forEach((obj) => {
    if (typeof obj === "object")
      Object.keys(obj).forEach((key) => headers.add(key));
  });
  return Array.from(headers);
}

function getHeadersHtml(headers) {
  const head = document.createElement("thead");
  head.className = "table-light";
  const row = document.createElement("tr");
  headers.forEach((header) => {
    const cell = document.createElement("td");
    cell.innerHTML = header;
    row.appendChild(cell);
  });
  head.appendChild(row);
  return head;
}

function getTable() {
  const table = document.createElement("table");
  table.className = "table table-bordered";
  return table;
}
