

let createQuery = document.getElementById("create-query");

let enterYear = document.getElementById("enter-year");

let submitRequest = document.getElementById("submit-request");

submitRequest.style.fontSize = "15px";
submitRequest.textContent = "SUBMIT REQUEST";


enterYear.addEventListener('input', (e)=>{

    console.log(e.target.value);
    //search = enterYear.value;


});

submitRequest.onclick = function(){

    console.log("I'm at the submit button");
    let y = enterYear.value;
    console.log(y);
    let getVariables = `https://api.census.gov/data/${y}/acs/acs5/profile/variables.json`;

    reactToVariableRequest(getVariables);

}

//submitRequest.addEventListener('click', ()=>{

    //console.log("I'm at the submit button");
    //let y = enterYear.value;
   // console.log(y);
   // let getVariables = `https://api.census.gov/data/${y}/acs/acs5/profile/variables.json`;

   // reactToVariableRequest(getVariables);
//});

//let censusRequest = createRequest("2020", "acs", "acs5", "DP03_0018E");


function reactToVariableRequest(request) {
    fetch(request)
    .then(function (resp) {

        if(!resp.ok){
            alert("Invalid Request! Try another Year!");
            }

        else{

            return resp.text();
        }

    }) .then(text => {
        data = JSON.parse(text);
        console.log(data);
        //return makeCensusTractFeature(data);

     });
    
}

reactToRequest(censusRequest);

function initiateDropdown() {
    document.getElementById("myDropdown").classList.toggle("show");
  }
  
  // Close the dropdown menu if the user clicks outside of it
  window.onclick = function(event) {
    if (!event.target.matches('.dropbtn')) {
      var dropdowns = document.getElementsByClassName("dropdown-content");
      var i;
      for (i = 0; i < dropdowns.length; i++) {
        var openDropdown = dropdowns[i];
        if (openDropdown.classList.contains('show')) {
          openDropdown.classList.remove('show');
        }
      }
    }
  }

let getVariables = `https://api.census.gov/data/${year}/acs/acs5/profile/variables.json`;
