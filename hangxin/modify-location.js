let body = $response.body;
if (body) {
    let obj = JSON.parse(body);
    if (obj.data) {
        obj.data.longitude1 = 120.5853; 
        obj.data.latitude1 = 29.99663;
    }
    $done({ body: JSON.stringify(obj) });
}
