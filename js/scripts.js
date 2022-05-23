/*!
* Start Bootstrap - Heroic Features v5.0.1 (https://startbootstrap.com/template/heroic-features)
* Copyright 2013-2021 Start Bootstrap
* Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-heroic-features/blob/master/LICENSE)
*/
// This file is intentionally blank
// Use this file to add JavaScript to your projec


var randomSeedProduct;
var datePeroid;

// hardcoded metricId for posting
var metricIdElectricityPower = "electricity_power";
var metricIdPVS = "premium_vehicle_service";
var metricIdSTS = "satellite_telephone";

// platinum plan technical resource ids/
var technicalResourceIdPVS = ["72b90791-b179-47af-b90a-b3d242bd03c2", "c7df8dde-aecc-44b6-ac1e-1f7270ba63c5","37f1efbc-3e4e-4f17-b87e-43e0b1c3e8da"]; 
var technicalResourceIdSTS = "1e8d4742-eb25-4f24-8484-86ea1a062eef"; 


// technical resource id for power electricity charge.
var technicalResourceIds = ["60a44f1d-aff3-4e4e-836b-67b0cdf2aafc","57a41fec-4827-40b0-8001-68a045c3f06a","257df37d-a4a2-4b8d-beba-6f7989d0ac6b"]; 

var companyName = ["SuperNewCorp. (CD)","GalaxyNebulaCorp. (CN)","GalaxyNebulaCorp. (SG)"];

var hasPVS = false;
var hasSTS = false;
var electricityCost = -1;

function refreshToken() {
    let text = $("#btn-post").text()
    $("#btn-post").prop('disabled', true);
    $("#btn-post").text('Loading...');
    $("#btn-post").prepend('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> &nbsp');

    let token = getToken(text)
    console.log("Token refreshed")

}

function getTechnicalResourceId(index) {
    return technicalResourceIds[index]
}

function postTrip(toast) {
    $("#btn-post").text('Posting...');
    $("#btn-post").prop('disabled', true);
    $("#btn-post").prepend('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> &nbsp');

    
    let token = window.localStorage.getItem("token");
    if (token == null) {
        token = getToken()
    }

    let startAt = datePeroid[0];
    let endAt = datePeroid[1];

    let res = postUsageRecord(startAt, endAt, metricIdElectricityPower, electricityCost, getTechnicalResourceId(randomSeedProduct), true);
    
    if (hasPVS){
        postUsageRecord(startAt, endAt, metricIdPVS, 1, technicalResourceIdPVS[randomSeedProduct], true);
    }

    if (hasSTS){
        let stsUsage = getRandomInt(1, datePeroid[2]/60000); 
        postUsageRecord(startAt, endAt, metricIdSTS, stsUsage > 5 ? stsUsage : 5, technicalResourceIdSTS, true);
    }

    // toast.show();
}

function haveProblem(toast){
    toast.show();
}

function getRandElectricityCost(){
    let rand = -1;
    let mean = 15;
    let stddev = 3;
    while (rand < 0) {
        rand = getNormallyDistributedRandomNumber(mean, stddev);
    }

    return rand.toFixed(2);
}

function getDatePeroid(){
    // let leftBoundStamp = new Date("2016-06-09T05:00:00Z").getTime();
    // let rightBoundStamp = new Date("2018-03-30T05:00:00Z").getTime();

    let leftBoundStamp = new Date("2021-03-02T05:00:00Z").getTime();
    let rightBoundStamp = new Date("2021-07-10T05:00:00Z").getTime();


    let startStamp = getRandomInt(leftBoundStamp, rightBoundStamp);
    let offset = Math.round(getNormallyDistributedRandomNumber(1000*60*20, 1000*60*5));
    let endStamp = startStamp + offset;
    // let current = new Date();
    // current.toISOString()

    // let startAt = "2019-01-01T05:00:00Z";
    // let endAt = "2019-02-01T05:00:00Z";

    let startAt = new Date(startStamp).toISOString();
    let endAt = new Date(endStamp).toISOString();

    return [startAt, endAt, offset];
}

function boxMullerTransform() {
    const u1 = Math.random();
    const u2 = Math.random();
    const z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
    const z1 = Math.sqrt(-2.0 * Math.log(u1)) * Math.sin(2.0 * Math.PI * u2);
    return { z0, z1 };
}

function getNormallyDistributedRandomNumber(mean, stddev) {
    const { z0, _ } = boxMullerTransform();
    return z0 * stddev + mean;
}



function getToken(text) {
    let token="123456";

    //get a token to push usage.

    console.log("[mock] getToken from API");
    window.localStorage.setItem("token", token);
    $("#btn-post").prop('disabled', false);
    $("#btn-post").text(text);

    return token;
}


function postUsageRecord(startAt, endAt, metricId, quantity, technicalResourceId, async) {
    let res;
    let token = window.localStorage.getItem("token");
    var settings = {
        "url": "xxx url",
        "method": "POST",
        "timeout": 0,
        "async": async,
        "crossdomain": true,
        "headers": {
            "Authorization": "Bearer " + token,
            "Content-Type": "application/json",
        },
        "data": JSON.stringify({
            "startedAt": startAt,
            "endedAt": endAt,
            "metricId": metricId,
            "quantity": Math.ceil(quantity),
            "userTechnicalId": technicalResourceId
        }),
    };
    console.log(settings.data)

    // $.ajax(settings).done(function (response) {
    //     console.log(response);
    //     res = response
    //     $("#btn-post").text('Trip finished. Have a great day :)');

    // });

    console.log("[API] received some response from push endpoint.");
    $("#btn-post").text('Trip finished. Have a great day :)');

    return res;
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min) + min)
}


function showRandomPlan(overwriteProduct, productSeed){
    // 0 - silver, 1 - gold, 2 - platinum;
    let planNames = ["silver", "gold", "platinum"];

    if (overwriteProduct){
        console.log("Plan overwriteed to "+planNames[productSeed]);
        randomSeedProduct = productSeed
    }else{
        console.log("Random plan refreshed")
        randomSeedProduct = Math.floor(Math.random()*3);
        //randomSeedProduct = 0; // TODO remove this
    }

    hasPVS = false;
    hasSTS = false;

    switch (randomSeedProduct){
        case 0:
            $("#additional_charge_item").css("display","block")
            if (Math.random()>0.5){
                $("#additional_pvs").css("display","block")
                hasPVS = true;
            }
            break;
        case 1:
            $("#additional_charge_item").css("display","block")
            if (Math.random()>0.0){
                $("#additional_pvs").css("display","block")
                hasPVS = true;
            }
            break;
        case 2:
            $("#additional_charge_item").css("display","block")
            $("#additional_pvs").css("display","block")
            hasPVS = true;

            if (Math.random()>0.3){
                $("#additional_sts").css("display","block")
                hasSTS = true;
            }
            
            break;
        default:
            console.log("out of scope");
            
    }

    let src = "./assets/"+planNames[randomSeedProduct]+".png";
    $(".planLogoImg").attr("src", src);

    $("#companyName").text(companyName[randomSeedProduct]);

    // init Global variables;
    datePeroid = getDatePeroid();
    electricityCost = getRandElectricityCost();

    $("#trip_distance").text(electricityCost)
    // $("#trip_electricity").text(getRandElectricityCost())
    $("#trip_start").text(datePeroid[0])
    $("#trip_end").text(datePeroid[1])
    $("#trip_min").text(Math.floor(datePeroid[2]/60/1000))
    $("#trip_sec").text(Math.floor( ( datePeroid[2] - 1000*60*Math.floor(datePeroid[2]/60/1000) )/1000))

}


// ============================================================ DevUse ============================================================ 

async function forcePost(){
    showRandomPlan();
    postTrip();
}

function loopPost(times){
    forcePost().then( location.reload(true) )
}


async function forcePostInPeroid(overwriteplan, planseed, startAt, endAt){
    showRandomPlan(overwriteplan, planseed);
    postTripDev(startAt, endAt);
}


function postTripDev(startAt, endAt) {
    $("#btn-post").text('Posting...');
    $("#btn-post").prop('disabled', true);
    $("#btn-post").prepend('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> &nbsp');

    
    let token = window.localStorage.getItem("token");
    if (token == null) {
        token = getToken()
    }

    // startAt = datePeroid[0];
    // endAt = datePeroid[1];

    let res = postUsageRecord(startAt, endAt, metricIdElectricityPower, electricityCost, getTechnicalResourceId(randomSeedProduct), true);
    
    if (hasPVS){
        postUsageRecord(startAt, endAt, metricIdPVS, 1, technicalResourceIdPVS, true);
    }

    if (hasSTS){
        let stsUsage = getRandomInt(1, datePeroid[2]/60000); 
        postUsageRecord(startAt, endAt, metricIdSTS, stsUsage > 5 ? stsUsage : 5, technicalResourceIdSTS, true);
    }

    // toast.show();
}