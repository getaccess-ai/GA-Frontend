const pre = document.querySelector("pre");
let name;
let report;
let annotations = {};
let curAnnotation;
const myModal = new bootstrap.Modal(document.getElementById('annotationModal'));
const pushModal = new bootstrap.Modal(document.getElementById('pushModal'));
const successModal = new bootstrap.Modal(document.getElementById('successModal'));
const failureModal = new bootstrap.Modal(document.getElementById('failureModal'));
const successBody = document.getElementById('successBody');
const failureBody = document.getElementById('failureBody');

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

function pushSuccessModal(msg, redirect){
    successBody.innerText = msg;
    if(redirect){
        window.location.replace('company_reports.html');
    }
    successModal.show();
}

function pushFailureModal(msg, err){
    failureBody.innerText = msg;
    console.log(err);
    failureModal.show();
}

async function handleDelete(){
    try {
        const resp = await axios.delete(`https://z2o.herokuapp.com/company/data/reports/${name}`);
        pushSuccessModal('This report has been deleted. Press ok to go to report listing.', true);
    } catch (error) {
        pushFailureModal('There was a problem in parsing your request. Please try again.', error);
    }
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
        pushSuccessModal('The report has been pushed. Press ok to go to the report listing. Press close to continue editing');
    }
    catch(error){
        console.log(error.response.data);
        pushModal.hide();
        pushFailureModal('There was a problem in parsing your request. Please try again.');
    }
}

const loadReport = async () => {
    $('.table-responsive').append(buildTable(report.data, annotationHandler));
    $('span').text(report.name);
};

const handleLoad = async (e) => {
    if(!Cookies.get('company-auth')) window.location.replace("company_login.html");
    const urlParams = new URLSearchParams(window.location.search);
    name = urlParams.get('reportName');
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