const url = $request.url;
const targetURL = "https://cloud.bankofchina.com/zj/pigeonqy/signinmgr/attencelocation.php";
    
if (url.indexOf(targetURL) !== -1) {
    let body = resp.body;
    body = body.replace(/\.hide\(\)/g, '.show()');
    body = body.replace(/if\(signscope < distance\)\{[\s\S]*?showtips\(2,"温馨提示","超出考勤范围"\);\s*\}/, '');
    body = body.replace(/if\(signscope >= distance\)/g, 'if(distance)');
    $done({body});
} else {
    $done({});
}
