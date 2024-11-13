let url = $request.url;
let targetURL = "https://cloud.bankofchina.com/zj/pigeonqy/signinmgr/attencelocation.php";
if (url.indexOf(targetURL) !== -1) {
    let body = $response.body;
    // 替换 .hide() 为 .show()
    body = body.replace(/\.hide\(\)/g, '.show()');
    // 移除指定的if语句块
    body = body.replace(/if\(signscope < distance\)\{[\s\S]*?showtips\(2,"温馨提示","超出考勤范围"\);\s*\}/, '');
    // 修改if语句的条件
    body = body.replace(/if\(signscope >= distance\)/g, 'if(distance)');
    $done({body});
} else {
    $done({});
}
