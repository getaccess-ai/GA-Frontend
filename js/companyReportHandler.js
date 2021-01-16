const pre = document.querySelector("pre");
let report;
let annotations = {};
let curAnnotation;
const myModal = new bootstrap.Modal(document.getElementById('exampleModal'));

function annotationHandler(id){
    curAnnotation = id;
    if(annotations[id]){
        $('#adjustment').text = annotations[id].adjustment;
        $('#comment').text = annotations[id].comment;
    }
    myModal.show();
}

function saveAnnotation(){
    annotations[curAnnotation] = {
        adjustment: $('#adjustment').text,
        comment: $('#comment').text
    }
    $('#adjustment').text = "";
    $('#comment').text = "";
    myModal.hide();
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
        console.log(report);
        loadReport();
    }
    catch(error){
        console.log(error.response.data);
    }
};