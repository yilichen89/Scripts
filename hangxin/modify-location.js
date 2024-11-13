# modify-location.js
let modifyLocation = $persistentStore.read("modifyLocation");

if (!modifyLocation) {
    modifyLocation = {};
}

function modifyLocationHandler(req) {
    let body = req.body;
    if (body) {
        body = body.replace(/actuallongitude=[^&]*/, "actuallongitude=120.585252");
        body = body.replace(/actuallatitude=[^&]*/, "actuallatitude=29.996876");
        body = body.replace(/ctualscope=[^&]*/, "ctualscope=27.8");
    }
    $done({body});
}
