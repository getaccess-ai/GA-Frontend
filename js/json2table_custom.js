function buildTable(data, clickFunc, curId, headers)
{
    if(!clickFunc){
        clickFunc = (id) => console.log(id);
    }
    if(curId && curId !== '') curId += '.';
    else curId = '';
    if(!Array.isArray(data) && typeof data === "object"){
        let table;
        if(!headers){
            headers = getHeaders([data]);
            table = getTable();
            table.appendChild(getHeadersHtml(headers));
        }
        const row = document.createElement('tr');
        headers.forEach(header => {
            const cell = document.createElement('td');
            const element = buildTable(data[header], clickFunc, curId+header);
            cell.appendChild(element);
            if(element.nodeName === 'P'){
                cell.onclick = ()=>clickFunc(curId+header);
                cell.style.cursor = "pointer";
            }
            row.appendChild(cell);
        });
        if(table){
            const tbody = document.createElement('tbody');
            tbody.append(row);
            table.appendChild(tbody);
            return table;
        }
        return row;
    }
    if(!Array.isArray(data)){
        const cell = document.createElement('p');
        cell.innerText = data? data.toString(): "";
        return cell;
    }
    const table = getTable();
    const headersCur = getHeaders(data);
    table.appendChild(getHeadersHtml(headersCur));
    const tbody = document.createElement('tbody');
    data.forEach((element, idx) => {
        const rowReturned = buildTable(element, clickFunc, curId+idx.toString(), headersCur);
        const row = document.createElement('tr');
        if(rowReturned.nodeName !== 'TR'){
            row.appendChild(rowReturned);
            tbody.append(row);
        }
        else tbody.append(rowReturned);
    });
    table.appendChild(tbody);
    return table;
}

function getHeaders(objs)
{
    const headers = new Set();
    objs.forEach(obj => {
        if(typeof obj === 'object') Object.keys(obj).forEach(key => headers.add(key));
    })
    return Array.from(headers);
}

function getHeadersHtml(headers)
{
    const head = document.createElement('thead');
    head.className = "table-light";
    const row = document.createElement('tr');
    headers.forEach(header => {
        const cell = document.createElement('td');
        cell.innerHTML = header;
        row.appendChild(cell);
    });
    head.appendChild(row);
    return head;
}

function getTable()
{
    const table = document.createElement('table');
    table.className = "table table-bordered";
    return table;
}