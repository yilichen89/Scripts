function modifyHeaders(headers) {
  const ua = headers['user-agent'];
  if (ua && ua.includes('ChatGPT') && ua.includes('iOS')) {
    // 匹配iOS版本并替换为17.0.0
    let modifiedUA = ua.replace(/iOS \d+\.\d+(\.\d+)?/, 'iOS 17.0.0');
    // 匹配ChatGPT版本并替换为1.2024.317
    modifiedUA = modifiedUA.replace(/ChatGPT\/\d+\.\d+\.\d+/, 'ChatGPT/1.2024.317');
    headers['user-agent'] = modifiedUA;
  }
  return headers;
}

// 主函数
function main() {
  const headers = $request.headers;
  const modifiedHeaders = modifyHeaders(headers);
  
  $done({headers: modifiedHeaders});
}

// 执行主函数
main();
