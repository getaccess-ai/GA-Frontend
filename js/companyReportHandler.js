const pre = document.querySelector("pre");
let report;
let annotations = {};
let curAnnotation;
const myModal = new bootstrap.Modal(document.getElementById('annotationModal'));
const pushModal = new bootstrap.Modal(document.getElementById('pushModal'));

function annotationHandler(id){
    curAnnotation = id;
    if(annotations[id]){
        document.querySelector('#adjustment').value = annotations[id].adjustment;
        document.querySelector('#comment').value = annotations[id].comment;
    }
    else{
        document.querySelector('#adjustment').value = "";
        document.querySelector('#comment').value = "";
    }
    myModal.show();
}

function saveAnnotation(){
    annotations[curAnnotation] = {
        adjustment: parseFloat(document.querySelector('#adjustment').value),
        comment: document.querySelector('#comment').value
    }
    document.getElementById(curAnnotation).className = 'table-active';
    myModal.hide();
}

async function approveAndPush(){
    const body = {
        person: document.querySelector('#person').value,
        annotations: annotations
    }
    console.log(body);
    try{
        const resp = await axios.post(`https://z2o.herokuapp.com/company/data/reports/${report.name}`, body);
        pushModal.hide();
        alert('Success');
    }
    catch(error){
        console.log(error.response.data);
        pushModal.hide();
        alert(error.response.data);
    }
}

const loadReport = async () => {
    $('.table-responsive').append(buildTable(report.data, annotationHandler));
    $('span').text(report.name);
};

const handleLoad = async (e) => {
    if(!Cookies.get('company-auth')) window.location.replace("company_login.html");
    const urlParams = new URLSearchParams(window.location.search);
    const name = urlParams.get('reportName');
    axios.defaults.headers.common['Authorization'] = Cookies.get('company-auth');
    try{
        const resp = await axios.get(`https://z2o.herokuapp.com/company/data/reports/${name}`);
        report = resp.data;
        loadReport();
    }
    catch(error){
        console.log(error.response.data);
    }
};