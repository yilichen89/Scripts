def("url", $request.url);
def("targetURL", "https://cloud.bankofchina.com/zj/pigeonqy/signinmgr/attencelocation.php");
if (url | contains(targetURL)) {
    def("body", $response.body);
    // 替换 .hide() 为 .show()
    body = body | gsub(".hide\\(\\)", ".show()");
    // 移除指定的if语句块
    body = body | sub("if\\(signscope < distance\\)\\{[\\s\\S]*?showtips\\(2,\"温馨提示\",\"超出考勤范围\"\\);\\s*\\}", "");
    // 修改if语句的条件
    body = body | sub("if\\(signscope >= distance\\)", "if(distance)");
    $done({body: body});
} else {
    $done({});
}
