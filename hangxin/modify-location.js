/*
Loon 脚本：中行签到终极版 (对照源码字段拼写)
*/

const target_lng = 120.5853; 
const target_lat = 29.99663;
const current_lng = 120.4956159764929;
const current_lat = 30.09852847084429;

let url = $request.url;

// --- 逻辑 A：拦截并伪造提交请求 ---
if (url.includes("SignIn") || url.includes("SignOut")) {
    let body = JSON.parse($request.body);
    body.actualLongitude = target_lng;
    body.actualLatitude = target_lat;
    
    console.log("检测到签到提交，已重写为目标坐标并修正字段名");
    $done({ body: JSON.stringify(body) });
} 

// --- 逻辑 B：伪造初始化数据 ---
else if (url.includes("getUserInfo")) {
    let body = JSON.parse($response.body);
    if (body.data) {
        // 让中心点等于当前位置，计算出的 mi 趋近于 0
        body.data.longitude1 = current_lng;
        body.data.latitude1 = current_lat;
        body.data.signScope = "999999"; 
    }
    $done({ body: JSON.stringify(body) });
} else {
    $done({});
}
