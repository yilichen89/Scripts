let body = $request.body;
if (body) {
    body = body.replace(/actuallongitude=[^&]*/, "actuallongitude=120.585252");
    body = body.replace(/actuallatitude=[^&]*/, "actuallatitude=29.996876");
    body = body.replace(/ctualscope=[^&]*/, "ctualscope=27.8");
}
$done({body});
