/**
 * Loon 脚本：中行签到双向伪装
 * 1. 修改 getUserInfo：让前端判定距离为 0
 * 2. 修改 SignIn/SignOut：提交符合要求的坐标
 */

const target_lng = 120.5853; // 目标经度
const target_lat = 29.99663; // 目标纬度
const current_lng = 120.4956159764929; // 你当前的经度
const current_lat = 30.09852847084429; // 你当前的纬度

let body = $request.body;
let url = $request.url;

// --- 逻辑 A：修改请求体 (发送给服务器的坐标) ---
if (url.includes("SignIn") || url.includes("SignOut")) {
    try {
        let obj = JSON.parse(body);
        obj.actualLongitude = target_lng; // 替换为目标经度 
        obj.actualLatitude = target_lat;   // 替换为目标纬度 
        obj.ctualScope = "50.5";           // 替换为合格的距离（如50.5米） [cite: 72]
        
        console.log("已拦截签到请求，坐标已修改为目标地点");
        $done({ body: JSON.stringify(obj) });
    } catch (e) {
        $done({});
    }
} 
// --- 逻辑 B：修改响应体 (显示在手机上的坐标) ---
else if (url.includes("getUserInfo")) {
    try {
        let obj = JSON.parse($response.body);
        if (obj.data) {
            // 让打卡中心点 = 你现在的实时位置，使前端计算出的 mi 为 0 [cite: 43, 44]
            obj.data.longitude1 = current_lng;
            obj.data.latitude1 = current_lat;
            obj.data.signScope = "999999"; // 极大化签到范围 [cite: 74]
            obj.data.workSite1 = "坐标对齐模式";
        }
        console.log("已修改 getUserInfo，前端判定距离将为 0");
        $done({ body: JSON.stringify(obj) });
    } catch (e) {
        $done({});
    }
} else {
    $done({});
}
