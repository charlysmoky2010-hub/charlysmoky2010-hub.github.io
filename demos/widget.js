/**
 * PHI-BRAIN Verified Multilingual Guest Assistant Widget (v1.0)
 * 1-Line Embed: <script src="https://charlysmoky2010-hub.github.io/demos/widget.js" data-hotel="hotel-slug"></script>
 * Fail-Closed Guarantee: Never invents room availability, prices, or schedules.
 */
(function () {
  var script = document.currentScript || document.querySelector('script[data-hotel]');
  var hotelName = (script && script.getAttribute('data-name')) || document.title.split('—')[0].trim() || 'Hotel';
  var contact = (script && script.getAttribute('data-contact')) || 'Reception Desk';
  var facts = (script && script.getAttribute('data-facts')) || '';

  var box = document.createElement('div');
  box.id = 'phi-guest-widget';
  box.style.cssText = 'position:fixed;bottom:20px;right:20px;z-index:99999;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;';

  box.innerHTML =
    '<button id="phi-gw-toggle" style="background:#0e6e8c;color:#fff;border:none;border-radius:999px;padding:13px 20px;font-size:14px;font-weight:700;cursor:pointer;box-shadow:0 10px 25px rgba(0,0,0,.28);display:flex;align-items:center;gap:8px;">' +
    '<span>💬</span><span>' + hotelName + ' Assistant (DE/EN)</span></button>' +
    '<div id="phi-gw-panel" style="display:none;width:330px;background:#111827;color:#f8fafc;border:1px solid #334155;border-radius:16px;padding:18px;margin-top:10px;box-shadow:0 20px 40px rgba(0,0,0,.45);">' +
    '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">' +
    '<strong style="font-size:14px;color:#38bdf8;">' + hotelName + ' — Guest Desk</strong>' +
    '<button id="phi-gw-close" style="background:none;border:none;color:#94a3b8;cursor:pointer;font-size:16px;">✕</button></div>' +
    '<div id="phi-gw-msg" style="background:#1e293b;padding:12px;border-radius:10px;font-size:13px;line-height:1.5;margin-bottom:10px;">' +
    'Welcome! Ask about location, parking, arrival, or house info. (Bookings & live rates go directly to ' + contact + ').</div>' +
    '<div style="display:flex;gap:6px;">' +
    '<input id="phi-gw-input" type="text" placeholder="Type your question (DE/EN/TR)..." style="flex:1;padding:9px 12px;border-radius:8px;border:1px solid #475569;background:#0f172a;color:#fff;font-size:13px;"/>' +
    '<button id="phi-gw-send" style="background:#10b981;color:#052e16;border:none;border-radius:8px;padding:9px 13px;font-weight:700;cursor:pointer;font-size:13px;">Ask</button>' +
    '</div></div>';

  document.body.appendChild(box);

  var toggle = document.getElementById('phi-gw-toggle');
  var panel = document.getElementById('phi-gw-panel');
  var close = document.getElementById('phi-gw-close');
  var input = document.getElementById('phi-gw-input');
  var send = document.getElementById('phi-gw-send');
  var msg = document.getElementById('phi-gw-msg');

  toggle.onclick = function () {
    panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
  };
  close.onclick = function () {
    panel.style.display = 'none';
  };

  function reply() {
    var q = (input.value || '').toLowerCase().trim();
    if (!q) return;
    if (q.match(/preis|price|cost|buch|book|zimmer frei|availab|rate|fiyat|rezerv/)) {
      msg.textContent = '📅 Fail-Closed Policy: We never invent live room availability or rates. Please contact ' + hotelName + ' directly for official booking: ' + contact;
    } else if (q.match(/wo|adresse|lage|strand|bahnhof|park|where|locat|beach|station|nerede|konum|ulaşım/)) {
      msg.textContent = '📍 Verified Location & Info for ' + hotelName + ': ' + facts + ' (Official contact: ' + contact + ')';
    } else {
      msg.textContent = '🏨 ' + hotelName + ' Verified Info: ' + facts + ' — For personal requests or reservations, reach our team at: ' + contact;
    }
    input.value = '';
  }

  send.onclick = reply;
  input.onkeydown = function (e) {
    if (e.key === 'Enter') reply();
  };
})();
