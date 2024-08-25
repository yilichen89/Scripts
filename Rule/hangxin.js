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
    console.log("位置信息已修改");
    $done({body: body});
}
else if (url.includes("https://cloud.bankofchina.com/zj/pigeonqy/signinmgr/attencelocation.php")) {
    // 处理响应页面
    let responseBody = $response.body;
    
    // 记录原始响应体的长度
    console.log("原始响应体长度：" + responseBody.length);

    // 替换 .hide() 为 .show()
    responseBody = responseBody.replace(/\.hide\(\)/g, '.show()');
    
    // 移除所有可能隐藏按钮的代码
    responseBody = responseBody.replace(/\.hide\(\)/g, '');
    responseBody = responseBody.replace(/style="display:\s*none;?"/gi, 'style="display:block;"');
    responseBody = responseBody.replace(/visibility:\s*hidden/gi, 'visibility:visible');
    
    // 移除距离检查逻辑
    responseBody = responseBody.replace(/if\s*\(\s*signscope\s*<\s*distance\s*\)\s*\{[\s\S]*?showtips\s*\([^)]*\)\s*;[\s\S]*?\}/g, '');
    
    // 修改签到和签退函数
    responseBody = responseBody.replace(/function\s+(clockin|signout)\(\)\s*\{[\s\S]*?\}/g, function(match, funcName) {
        return match.replace(/if\s*\(\s*signscope\s*<\s*distance\s*\)\s*\{[\s\S]*?\}/g, '')
                   .replace(/if\s*\(\s*signscope\s*>=\s*distance\s*\)/g, 'if(true)');
    });
    
    // 记录修改后响应体的长度
    console.log("修改后响应体长度：" + responseBody.length);
    
    $done({body: responseBody});
}
else {
    console.log("URL不匹配：" + url);
    $done({});
}
