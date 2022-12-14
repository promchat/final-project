import g from "../data/CommChar.js" ;

//console.log(g);

let geos = g[0].features;

geos.attributeCode;
geos.attributeName;
geos.attributeValue;

//console.log(geos[0].geometry);

const censusTracts = [];
const currentSelection = [];

let peopleRequest = "https://api.census.gov/data/2020/acs/acs5/profile?get=NAME,DP03_0018E&for=tract:*&in=county:101&in=state:42";

let data;

let tableResponse = document.getElementById("populationTable");
let panel = document.getElementById("panel");
let card = document.getElementById("card");
let compareCard = document.getElementById("compare-card");
let dataTable = document.getElementById("tableBody");
let mainTable = document.getElementById("table");
tableResponse.appendChild(dataTable);

mainTable.style.display = "none";

let resultScreen = document.createElement("div");
resultScreen.style.display = "flex";
resultScreen.style.flexDirection = "column";
resultScreen.style.justifyContent = "center";
resultScreen.style.width = "800px";
resultScreen.style.height = "800px";
resultScreen.style.margin = "auto";
resultScreen.style.color = "#FFFFFF";
resultScreen.style.backgroundColor = "#585858";
resultScreen.style.opacity = "90%";
resultScreen.style.zIndex = "3";


let list = document.createElement("div");
list.style.display = "flex";
list.style.alignItems = "space-between";
list.style.width = "fit-content";
list.style.height = "fit-content";

panel.appendChild(list);


let generateTableButton = document.createElement("button");
generateTableButton.textContent = "Generate Table";
generateTableButton.style.fontSize = "10px";
generateTableButton.style.left = "10px";
generateTableButton.style.margin = "auto";
generateTableButton.style.width = "fit-content";
generateTableButton.style.height = "fit-content";
generateTableButton.style.zIndex = "2";


    let enterYear = document.getElementById("enter-year");

    let submitRequest = document.getElementById("submit-request");
    
    submitRequest.style.fontSize = "15px";
    submitRequest.textContent = "SUBMIT REQUEST";
    
    
    enterYear.addEventListener('input', (e)=>{
    
        console.log(e.target.value);
   
    });
    
    submitRequest.onclick = function(){
    
        console.log("I'm at the submit button");
        let y = enterYear.value;
        console.log(y);
        let getVariables = `https://api.census.gov/data/${y}/acs/acs5/profile/variables.json`;
    
        reactToVariableRequest(getVariables);
    
    }

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
            //data = JSON.parse(text);
            return text;
            //return makeCensusTractFeature(data);
    
         }). then (data =>{

            let variableList = document.createElement("p");

            variableList.textContent = data;
            variableList.style.overflow = "scroll";
            variableList.style.margin = "auto";
            variableList.style.width = "700px";
            variableList.style.height = "700px";

            let closeResultsButton = document.createElement("button");
            closeResultsButton.innerHTML = "CLOSE RESULTS"

            closeResultsButton.style.width = "fit-content";
            closeResultsButton.style.height = "fit-content";

            resultScreen.appendChild(variableList);

            closeResultsButton.addEventListener('click', ()=>{
                resultScreen.style.display = "none";
            });

            resultScreen.appendChild(closeResultsButton);

            document.getElementById("top-container").appendChild(resultScreen);

            console.log(variableList);

         });
        
    }

let map = L.map("map").setView([39.9526, -75.162], 13);

const mapboxAccount = 'mapbox';
const mapboxStyle = 'light-v10';
const mapboxToken = 'pk.eyJ1IjoicHJvbWNoYXQiLCJhIjoiY2w4dzFtbHkyMDJwbTN2b2szanl0aWV0NSJ9.1z0LR6gywZcgz7D21JSdcA';

L.tileLayer(`https://api.mapbox.com/styles/v1/promchat/cl9xkypa8000p14nwki6k3a69/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoicHJvbWNoYXQiLCJhIjoiY2w4dzFtbHkyMDJwbTN2b2szanl0aWV0NSJ9.1z0LR6gywZcgz7D21JSdcA`, {
            maxZoom: 19,
            attribution: '© <a href="https://www.mapbox.com/about/maps/">Mapbox</a> © <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> <strong><a href="https://www.mapbox.com/map-feedback/" target="_blank">Improve this map</a></strong>',
        }).addTo(map);


function populateCensusData(request) {
    fetch(request)
    .then(function (resp) {

        if(!resp.ok){
            alert("Invalid List Number.");
            }

        else{
            //console.log("Working");
            return resp.text();
        }

    }) .then(text => {
        //console.log(text);
        //tableResponse.textContent = text;
        data = JSON.parse(text);
        return makeCensusTractFeature(data);

     }) .then(CT =>{

        for(let tract of CT){

            queryResponse(geos, tract);

        }

        map.baseLayer = L.geoJSON(geos, {onEachFeature : onEachFeature, style : {color: "#721818", weight: 0.8, fillColor: "#585656", fillOpacity: .6},}).addTo(map);

        return CT;        
     }); 
    
}


function makeCensusTractFeature(data){

    let code = data[0][1];
    let name = " tableName ";

    for( let d = 1 ; d < data.length ; d++ ){

        let censusTract = {
            n : 0,
            FIPS : 0,
            attributeCode : 0,
            attributeName : 0,
            attributeValue : 0,
            geometry : 0,
            message : 0,
        }

        censusTract.n = d;
        censusTract.FIPS = data[d][2] + data[d][3] + data[d][4];
        censusTract.attributeCode = code;
        censusTract.attributeName = name;
        censusTract.attributeValue = parseInt(data[d][1]);

        censusTracts.push(censusTract);

    }

    return censusTracts;


}

function onEachFeature(feature, layer) {

    let t = message(censusTracts, feature);

    layer.bindTooltip(t.message);

    layer.on('click', function (e) {
        showCard(feature);
        currentSelection.push(feature.properties.GEOID);
        console.log(currentSelection);
        reviseList();
        list.appendChild(generateTableButton);
        });

}

function showCard(f){

    let color;

    let closeButton = document.createElement("button");
    closeButton.textContent = "Close Tract";
    closeButton.style.fontSize = "10px";
    closeButton.style.marginTop = "10px";
    closeButton.style.width = "fit-content";
    closeButton.style.height = "fit-content";

    let compareButton = document.createElement("button");
    compareButton.textContent = "Compare with";
    compareButton.style.fontSize = "10px";
    compareButton.style.marginTop = "5px";
    compareButton.style.width = "110px";
    compareButton.style.height = "15px";

    if(!map.chosenLayer){

        map.chosenLayer = L.geoJSON(f, { onEachFeature : onEachFeature, 
            style : {color: "#721818", weight: 0.8, fillColor: color, fillOpacity: .6},}).addTo(map);
            card.style.display = "flex";
            card.style.width = "250px";
            card.style.height = "80px";
            card.style.borderRadius = "5%";
            card.style.backgroundColor = "#FFFFFF";
            card.style.zIndex = "2";
            card.style.margin = "5px";
            card.textContent = "***CURRENT SELECTION***\n " + (message(censusTracts, f)).message;
            card.appendChild(closeButton);
            //card.appendChild(compareButton);
            panel.appendChild(card);

    }

    else{
        map.removeLayer(map.chosenLayer);
        map.chosenLayer = L.geoJSON(f, { onEachFeature : onEachFeature, 
            style : {color: "#721818", weight: 0.8, fillColor: color, fillOpacity: .6},}).addTo(map);
            card.style.display = "flex";
            card.style.width = "250px";
            card.style.height = "80px";
            card.style.borderRadius = "5%";
            card.style.backgroundColor = "#FFFFFF";
            card.style.zIndex = "2";
            card.style.margin = "5px";
            card.textContent = "***CURRENT SELECTION***\n " + (message(censusTracts, f)).message;
            card.appendChild(closeButton);
            //card.appendChild(compareButton);
            panel.appendChild(card);

    }

    closeButton.addEventListener('click', ()=>{
        card.style.display = "none";
    });

    compareButton.addEventListener('click', ()=>{

        let comparePHL = document.createElement("button");
        comparePHL.textContent = "Philadelphia";
        comparePHL.style.fontSize = "10px";
        comparePHL.style.marginTop = "10px";
        comparePHL.style.width = "110px";
        comparePHL.style.height = "15px";

        let compareCustom = document.createElement("button");
        compareCustom.textContent = "Custom geos";
        compareCustom.style.fontSize = "10px";
        compareCustom.style.marginTop = "10px";
        compareCustom.style.width = "110px";
        compareCustom.style.height = "15px";

        compareCard.style.display = "flex";
        compareCard.style.width = "250px";
        compareCard.style.height = "80px";
        compareCard.style.borderRadius = "5%";
        compareCard.style.backgroundColor = "#ADADAD";
        compareCard.style.zIndex = "2";
        compareCard.appendChild(comparePHL);
        compareCard.appendChild(compareCustom);
        panel.appendChild(compareCard);


        //compareCard.textContent = (message(censusTracts, f)).message;


        map.compareLayer = L.geoJSON(geos, {onEachFeature : onEachFeature, style : {color: "#721818", weight: 0.8, fillColor: "#585656", fillOpacity: .6},}).addTo(map);

    });
}

function makeCard(thing){
    
    let tag = document.createElement("p");
    let X = document.createElement("button");

    X.style.display = "block";
    X.style.height = "fit-content";
    X.style.width = "fit-content";
    X.innerHTML = "X";
    X.style.fontSize = "16px";
    X.value = thing;

    tag.style.display = "block";
    tag.style.height = "fit-content";
    tag.style.width = "fit-content";
    tag.style.margin = "25px";
    tag.style.padding = "1px";
    tag.style.borderStyle = "groove";
    tag.style.fontSize = "16px";
    tag.style.borderRadius = "5%";
    tag.style.border = "3px";
    tag.style.borderColor = "#000000";
    tag.innerHTML = thing;
    tag.style.color = "#FFFFFF";
    tag.style.backgroundColor = "#aaaaaa";

    tag.appendChild(X);

    X.addEventListener('click',()=>{

        console.log(X.value);
        const search = currentSelection.indexOf(X.value);
        console.log(search);
        if (search > -1) { 
        currentSelection.splice(search, 1); 
        console.log(currentSelection);
        }
        tag.style.display = "none";
    });


    return tag;
}

function reviseList(){

    //list.innerHTML = " ";

    //console.log(list.innerHTML);

    

    let temp;

        for ( let x of currentSelection ){

            temp = (makeCard(x));
            temp.style.margin = "auto";
        }
        panel.appendChild(temp);

        panel.appendChild(generateTableButton);

    }



function queryResponse(df1, df2){

    let response = " ";

        for( let d1 of df1){

            if( d1.properties.GEOID == df2.FIPS ){

                response = "GEOID:\n" + df2.FIPS + "\nAttribute Code:\n" + df2.attributeCode + "\nAttribute Name:\n" + df2.attributeName + "\nAttribute Value:\n" + df2.attributeValue;

                df2.geometry = d1.geometry;
                df2.message = response;

                break;

            }

        }

        return response;

    }


    function message(df1, df2){

        let response;
    
            for( let d1 of df1){
        
                if( d1.FIPS == df2.properties.GEOID ){
    
                    response = d1;
                    break;
    
                }
    
            }
    
            return response;
    
        }


populateCensusData(peopleRequest);

console.log(censusTracts);

//map.baseLayer = L.geoJSON(censusTracts, {onEachFeature : onEachFeature, style : {color: "#721818", weight: 0.8, fillColor: "#585656", fillOpacity: .6},}).addTo(map);





  function queryData(selection, allTracts){

    let result = [];

    for( let select of selection ){

        for( let tract of allTracts ){

            if(select == tract.FIPS){

                result.push(tract);
                break;

            }
        }
    }

    return result;

  }

  generateTableButton.addEventListener('click', ()=>{

    mainTable.style.display = "block";

    let table = queryData(currentSelection, censusTracts);

    let closeTable = document.createElement("button");
    closeTable.style.display = "block";
    closeTable.style.height = "fit-content";
    closeTable.style.width = "fit-content";
    closeTable.innerHTML = "X";
    closeTable.style.fontSize = "16px";

    mainTable.style.color = "#FFFFFF";
    mainTable.style.width = "fit-content";
    mainTable.style.margin = "auto";

    mainTable.appendChild(closeTable);

    closeTable.addEventListener('click', ()=>{
        mainTable.style.display = "none";
    })


        //let tbl = document.createElement('table');
        //tbl.style.width = '100%';
        //tbl.setAttribute('border', '1');
        //let tbdy = document.createElement('tbody');
        //for (let r of table) {    
         // tbl.appendChild(loadTableData(r));
        //}
        //tbl.appendChild(tbdy);
        //tableResponse.appendChild(tbdy);

        table.map(t=>{
            let row = dataTable.insertRow();
            let fips = row.insertCell(0);
            fips.innerHTML = t.FIPS;
            let code = row.insertCell(1);
            code.innerHTML = t.attributeCode;
            let name = row.insertCell(2);
            name.innerHTML = t.attributeName;
            let value = row.insertCell(3);
            value.innerHTML = t.attributeValue;

         });     
    


    //for( let r of table ){

     //  loadTableData(r);
    //}

    dataTable.style.display = "block";
    //dataTable.style.width = "fit-content";
    //dataTable.style.height = "fit-content";
    //dataTable.setAttribute('border', '1');

    


  });

  function loadTableData(item) {
    
      let row = dataTable.insertRow();
      let geoid = row.insertCell(0);
      geoid.innerHTML = item.FIPS;
      let code = row.insertCell(1);
      code.innerHTML = item.attributeCode;
      let name = row.insertCell(2);
      name.innerHTML = item.attributeName;
      let value = row.insertCell(3);
      value.innerHTML = item.attributeValue;
      
     }



window.data = data;
window.g = g;
window.geos = geos;
window.censusTracts = censusTracts;

