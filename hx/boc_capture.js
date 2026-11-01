/**
 * boc_capture.js —— 凭证抓取（Loon http-response 脚本）
 *
 * 命中两条响应，把「能用一辈子的东西」写进 $persistentStore：
 *   1) /staff/wework/api/auth/wework/getUserInfo   -> token(JWT) + staffInfo + exp + uid
 *   2) /staff/wework/api/wework/staffsignin/entrance/getUserInfo -> 打卡点坐标 + signScope + 时间窗
 *
 * 只要在 Loon 里打开一次考勤应用（或点一次签到/刷新），变量就自动更新。
 * 变量名与 BoxJs 面板一致，BoxJs 能直接看和改。
 */

var K = {
  token:   "boc_token",
  staff:   "boc_staff_info",
  exp:     "boc_token_exp",
  uid:     "boc_uid",
  agent:   "boc_agent_id",
  lon:     "boc_lon",
  lat:     "boc_lat",
  site:    "boc_site",
  scope:   "boc_scope",
  window:  "boc_window",
  updated: "boc_updated"
};

function read(k) { return $persistentStore.read(k) || ""; }
function save(k, v) {
  if (v === undefined || v === null || String(v).length === 0) return;
  $persistentStore.write(String(v), k);
}

function b64url(s) {
  s = s.replace(/-/g, "+").replace(/_/g, "/");
  while (s.length % 4) s += "=";
  var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
  var out = "", acc = 0, bits = 0;
  for (var i = 0; i < s.length; i++) {
    var c = s.charAt(i);
    if (c === "=") break;
    var v = chars.indexOf(c);
    if (v < 0) continue;
    acc = (acc << 6) | v; bits += 6;
    if (bits >= 8) { bits -= 8; out += String.fromCharCode((acc >> bits) & 0xFF); }
  }
  return out;
}

function jwtClaims(tok) {
  try {
    var p = String(tok).replace(/^Bearer\s+/i, "").split(".");
    if (p.length !== 3) return {};
    return JSON.parse(b64url(p[1]));
  } catch (e) { return {}; }
}

function parse(body) {
  try { return JSON.parse(body); } catch (e) { return null; }
}

function notify(title, body) {
  $notification.post("考勤凭证", title, body);
}

(function main() {
  var url = ($request && $request.url) || "";
  var body = $response && $response.body;
  var obj = body ? parse(body) : null;

  // 顺手记下 agentid，签到 URL 里用得到
  var m = url.match(/agentid=(\d+)/);
  if (m) save(K.agent, m[1]);

  if (!obj || obj.code !== 200 || !obj.data) { $done({}); return; }

  // ---- 登录态：token + staffInfo
  if (/\/auth\/wework\/getUserInfo/.test(url)) {
    var d = obj.data;
    var tk = d.oAuth2AccessTokenResponse && d.oAuth2AccessTokenResponse.accessToken;
    if (tk && tk.tokenValue) {
      save(K.token, tk.tokenValue);
      var c = jwtClaims(tk.tokenValue);
      if (c.exp) save(K.exp, c.exp);
      if (c.uid) save(K.uid, c.uid);
    }
    if (d.userInfo) save(K.staff, d.userInfo);
    save(K.updated, Math.floor(Date.now() / 1000));
    notify("已更新", "uid=" + (read(K.uid) || "?") + " staffInfo=" + (read(K.staff) || "").length + " hex");
    $done({});
    return;
  }

  // ---- 考勤规则：打卡点 + 范围 + 时间窗
  if (/\/entrance\/getUserInfo/.test(url)) {
    var r = obj.data;
    if (r.longitude1 !== undefined && r.latitude1 !== undefined) {
      save(K.lon, r.longitude1);
      save(K.lat, r.latitude1);
    }
    save(K.site, r.workSite1);
    save(K.scope, r.signScope);
    save(K.window, [r.begSignInTime, r.endSignInTime, r.begSignOutTime, r.endSignOutTime].join("-"));
    notify("打卡点", (r.workSite1 || "?") + " " + r.longitude1 + "," + r.latitude1 + " 范围" + r.signScope + "m");
    $done({});
    return;
  }

  $done({});
})();
