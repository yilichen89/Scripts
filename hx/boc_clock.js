/**
 * boc_clock.js —— 签到/签退执行器（Loon cron 脚本）
 *
 * 用法：脚本条目里带 argument，例如
 *   script-path=boc_clock.js, argument=signin
 *   script-path=boc_clock.js, argument=signout
 *
 * 依赖 boc_capture.js 写下的变量：boc_token / boc_staff_info / boc_lon / boc_lat
 * 坐标默认取抓回来的打卡点，可用 BoxJs 里的 boc_lon / boc_lat 覆盖。
 */

var BASE = "https://zj.brcloud.bankofchina.com";
var API = "/staff/wework/api";
var PATHS = {
  signin: "/wework/staffsignin/entrance/SignIn",
  signout: "/wework/staffsignin/entrance/SignOut"
};
var LABEL = { signin: "签到", signout: "签退" };

function read(k) { return $persistentStore.read(k) || ""; }
function save(k, v) { $persistentStore.write(String(v), k); }

function today() {
  var d = new Date();
  var p = function (n) { return (n < 10 ? "0" : "") + n; };
  return d.getFullYear() + p(d.getMonth() + 1) + p(d.getDate());
}

function nowHM() {
  var d = new Date();
  var p = function (n) { return (n < 10 ? "0" : "") + n; };
  return p(d.getHours()) + ":" + p(d.getMinutes());
}

function notify(title, sub, body) {
  $notification.post(title, sub, body);
}

function post(url, headers, body, cb) {
  $httpClient.post({ url: url, headers: headers, body: body }, function (err, resp, data) {
    cb(err, resp, data);
  });
}

function finish(text, isError) {
  notify(isError ? "考勤失败" : "考勤", action ? LABEL[action] : "", text);
  $done();
}

var action = String(($argument || "") + "").trim().toLowerCase();
if (action !== "signin" && action !== "signout") {
  // 允许 "action=signin" 这种写法
  var m = String($argument || "").match(/action\s*=\s*(signin|signout)/i);
  action = m ? m[1].toLowerCase() : "";
}
if (!action) {
  notify("考勤脚本", "配置错误", "argument 必须是 signin 或 signout");
  $done();
}

var token = read("boc_token").replace(/^Bearer\s+/i, "");
var staff = read("boc_staff_info");
var exp = parseInt(read("boc_token_exp") || "0", 10);
var now = Math.floor(Date.now() / 1000);

if (!token || !staff) {
  finish("缺 token/staffInfo：先打开一次企业微信考勤应用，让 boc_capture.js 抓一次", true);
} else if (exp && exp < now) {
  finish("token 已过期，打开一次考勤应用重新抓取（7 天有效）", true);
} else {
  // 同一天同一动作只打一次，防止 cron 多次触发
  var mark = "boc_last_" + action;
  var last = read(mark);
  if (last.indexOf(today()) === 0) {
    $done();  // 已经打过，静默退出，不打扰
  } else {
    var lon = read("boc_lon") || "120.5853";
    var lat = read("boc_lat") || "29.99663";
    var body = JSON.stringify({
      actualLongitude: Number(lon).toFixed(6),
      actualLatitude: Number(lat).toFixed(6),
      staffInfo: staff
    });
    var url = BASE + API + PATHS[action];
    var headers = {
      "Accept": "application/json, text/plain, */*",
      "Content-Type": "application/json",
      "Authorization": "Bearer " + token,
      "Cookie": "Token=" + token,
      "Origin": BASE,
      "Referer": BASE + "/staff/wework/staffsignin/?agentid=" + (read("boc_agent_id") || "1000002"),
      "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 wxworklocal/3.2.400 wxwork/4.0.0 MicroMessenger/7.0.1 appname/wxworklocal-customized wwlocal/3.2.400 appscheme/wxworklocalcustomized Language/zh_CN WXWorklocalClientType/IOS"
    };

    var tried = 0;
    (function go() {
      tried++;
      post(url, headers, body, function (err, resp, data) {
        var obj = null;
        try { obj = JSON.parse(data); } catch (e) {}
        if (err || !obj) {
          if (tried < 2) { setTimeout(go, 1200); return; }
          finish((err && err.error) || "网络错误", true);
          return;
        }
        if (obj.code === 200) {
          save(mark, today() + " " + nowHM());
          finish((obj.msg || "成功") + " @" + nowHM(), false);
        } else if (obj.code === 401) {
          finish("token 失效：" + (obj.msg || ""), true);
        } else {
          finish("code=" + obj.code + " " + (obj.msg || ""), true);
        }
      });
    })();
  }
}
