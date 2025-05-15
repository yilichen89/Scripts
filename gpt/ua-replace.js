const CACHE_KEY = 'CHATGPT_LATEST_VERSION';
const CACHE_EXPIRE = 86400000; // 24小时的毫秒数

// 从App Store获取ChatGPT最新版本号
function getLatestChatGPTVersion() {
  return new Promise((resolve, reject) => {
    const request = {
      url: 'https://itunes.apple.com/lookup?id=6448311069',
      headers: {
        'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Mobile/15E148 Safari/604.1'
      }
    };
    
    $httpClient.get(request, function(error, response, data) {
      if (error) {
        resolve('1.2024.317'); // 如果请求失败，使用默认版本号
        return;
      }
      
      try {
        const jsonData = JSON.parse(data);
        if (jsonData.results && jsonData.results.length > 0) {
          const version = jsonData.results[0].version;
          // 缓存版本号
          $persistentStore.write(version, CACHE_KEY);
          $persistentStore.write(String(Date.now()), CACHE_KEY + '_TIME');
          resolve(version);
        } else {
          resolve('1.2024.317'); // 如果解析失败，使用默认版本号
        }
      } catch (e) {
        resolve('1.2024.317'); // 如果解析出错，使用默认版本号
      }
    });
  });
}

// 获取版本号，优先从缓存中获取
async function getVersion() {
  const cachedVersion = $persistentStore.read(CACHE_KEY);
  const cachedTime = $persistentStore.read(CACHE_KEY + '_TIME');
  
  // 如果有缓存且未过期，使用缓存的版本号
  if (cachedVersion && cachedTime && (Date.now() - parseInt(cachedTime)) < CACHE_EXPIRE) {
    return cachedVersion;
  }
  
  // 否则重新获取最新版本号
  return await getLatestChatGPTVersion();
}

function modifyHeaders(headers, version) {
  const ua = headers['user-agent'];
  if (ua && ua.includes('ChatGPT') && ua.includes('iOS')) {
    // 匹配iOS版本并替换为17.0.0
    let modifiedUA = ua.replace(/iOS \d+\.\d+(\.\d+)?/, 'iOS 17.0.0');
    // 匹配ChatGPT版本并替换为最新版本
    modifiedUA = modifiedUA.replace(/ChatGPT\/\d+\.\d+\.\d+/, `ChatGPT/${version}`);
    headers['user-agent'] = modifiedUA;
  }
  return headers;
}

// 主函数
async function main() {
  const headers = $request.headers;
  const latestVersion = await getVersion();
  const modifiedHeaders = modifyHeaders(headers, latestVersion);
  
  $done({headers: modifiedHeaders});
}

// 执行主函数
main();
