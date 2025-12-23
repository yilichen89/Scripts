let body = $request.body;
if (body) {
    let obj = JSON.parse(body);
    if (obj.data) {
        obj.data.actualLatitude = 29.99656480435857; 
        obj.data.actualLongitude = 120.5850024356243;
        obj.data.ctualScope = "29.6";
    }
    $done({ body: JSON.stringify(obj) });
}
