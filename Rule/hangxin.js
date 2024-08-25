[mitm]
hostname = cloud.bankofchina.com
[rewrite_local]
^https:\/\/cloud\.bankofchina\.com\/zj\/pigeonqy\/signinmgr\/recordowrkandoffwork.php url script-response-body https://raw.githubusercontent.com/yilichen89/Scripts/main/Rule/hangxin.js
^https:\/\/cloud\.bankofchina\.com\/zj\/pigeonqy\/signinmgr\/attencelocation.php url script-request-body https://raw.githubusercontent.com/yilichen89/Scripts/main/Rule/hangxin.js
/**********************************************************/
// Quantumult X Script

const url = $request.url;
const targetURLs = [
    "https://cloud.bankofchina.com/zj/pigeonqy/signinmgr/attencelocation.php",
    "https://cloud.bankofchina.com/zj/pigeonqy/signinmgr/recordworkandoffwork.php"
];

if (targetURLs.some(targetURL => url.indexOf(targetURL) !== -1)) {
    let body = $request.body || $response.body; // 判断是请求还是响应

    // 对于 attencelocation.php
    if (url.indexOf("attencelocation.php") !== -1) {
        // 修改响应内容
        body = body.replace(/\.hide\(\)/g, '.show()');
        body = body.replace(/if\(signscope < distance\)\{[\s\S]*?showtips\(2,"温馨提示","超出考勤范围"\);\s*\}/, '');
        body = body.replace(/if\(signscope >= distance\)/g, 'if(distance)');
    }

    // 对于 recordworkandoffwork.php
    if (url.indexOf("recordworkandoffwork.php") !== -1) {
        // 修改请求体
        body = body.replace(/actuallongitude=[^&]*/, "actuallongitude=120.585252");
        body = body.replace(/actuallatitude=[^&]*/, "actuallatitude=29.996876");
        body = body.replace(/ctualscope=[^&]*/, "ctualscope=27.8");
    }

    $done({body});
} else {
    $done({});
}
