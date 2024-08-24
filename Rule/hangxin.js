[mitm]
hostname = cloud.bankofchina.com
[rewrite_local]
^https:\/\/cloud\.bankofchina\.com\/zj\/pigeonqy\/signinmgr\/recordowrkndoffwork.php url script-response-body https://raw.githubusercontent.com/yilichen89/Scripts/main/Rule/hangxin.js
^https:\/\/cloud\.bankofchina\.com\/zj\/pigeonqy\/signinmgr\/recordowrkndoffwork.php url script-request-body https://raw.githubusercontent.com/yilichen89/Scripts/main/Rule/hangxin.js
/**********************************************************/
// Quantumult X Script

const url = $request.url;

if (url.includes("https://cloud.bankofchina.com/zj/pigeonqy/signinmgr/recordowrkndoffwork.php")) {
    // 处理位置信息请求
    var body = $request.body;
    if (body) {
        body = body.replace(/actuallongitude=[^&]*/, "actuallongitude=120.585252");
        body = body.replace(/actuallatitude=[^&]*/, "actuallatitude=29.996876");
        body = body.replace(/ctualscope=[^&]*/, "ctualscope=27.8");
    }
    $done({body: body});
}
else if (url.includes("https://cloud.bankofchina.com/zj/pigeonqy/signinmgr/attencelocation.php")) {
    // 处理响应页面
    let responseBody = $response.body;
    
    // 替换 .hide() 为 .show()
    responseBody = responseBody.replace(/\.hide\(\)/g, '.show()');
    
    // 完全移除检查距离和显示提示的相关代码
    responseBody = responseBody.replace(/if\s*\(\s*signscope\s*<\s*distance\s*\)\s*\{[\s\S]*?showtips\s*\([^)]*\)\s*;[\s\S]*?\}/g, '');
    
    // 修改签到和签退函数，移除距离检查逻辑
    responseBody = responseBody.replace(/function\s+clockin\(\)\s*\{[\s\S]*?\}/g, function(match) {
        return match.replace(/if\s*\(\s*signscope\s*<\s*distance\s*\)\s*\{[\s\S]*?\}/g, '');
    });
    
    responseBody = responseBody.replace(/function\s+signout\(\)\s*\{[\s\S]*?\}/g, function(match) {
        return match.replace(/if\s*\(\s*signscope\s*<\s*distance\s*\)\s*\{[\s\S]*?\}/g, '');
    });
    
    // 修改if语句的条件
    responseBody = responseBody.replace(/if\s*\(\s*signscope\s*>=\s*distance\s*\)/g, 'if(true)');
    
    $done({body: responseBody});
}
else {
    $done({});
}
