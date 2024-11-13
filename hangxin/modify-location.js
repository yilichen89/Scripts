def("body", $request.body);
if (body) {
    body = body | sub("actuallongitude=[^&]*", "actuallongitude=120.585252");
    body = body | sub("actuallatitude=[^&]*", "actuallatitude=29.996876");
    body = body | sub("ctualscope=[^&]*", "ctualscope=27.8");
}
$done({body: body});
