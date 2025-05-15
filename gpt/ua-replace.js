let body = $request.body;
if (body) {
    // 替换User-Agent中的iOS版本号为17.0.0
    body = body.replace(
        /User-Agent=ChatGPT\/1\.2024\.200 \((iOS )([0-9]+\.[0-9]+\.[0-9]+); iPhone15,3; build 10062920475\)/,
        'User-Agent=ChatGPT/1.2024.200 ($1iOS 17.0.0$3)'
    );
}
$done({ body });
