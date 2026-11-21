/*
 * PINOCCHIO 웹사이트 렌더러
 * 모든 문구·이름·연락처는 content.json에서 읽어 옵니다.
 * 내용을 바꾸려면 이 파일이 아니라 content.json을 수정하세요.
 */
(function () {
  'use strict';

  // ---------- helpers ----------
  var esc = function (s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  };
  var list = function (a) { return Array.isArray(a) ? a : []; };
  var has = function (a) { return list(a).length > 0; };
  var pad = function (n) { return String(n).padStart(2, '0'); };
  var get = function (obj, path, fallback) {
    var cur = obj;
    var parts = path.split('.');
    for (var i = 0; i < parts.length; i++) {
      if (cur == null) return fallback;
      cur = cur[parts[i]];
    }
    return cur == null ? fallback : cur;
  };
  var isOut = function (scope) {
    var s = String(scope || '').trim().toLowerCase();
    return s === '대외' || s === 'out' || s === 'external';
  };

  // ---------- shared parts ----------
  function header(c, page) {
    var nav = c.nav || {};
    var items = [
      { id: 'about', href: 'about.html', label: nav.about || '소개' },
      { id: 'activities', href: 'activities.html', label: nav.activities || '활동' },
      { id: 'team', href: 'team.html', label: nav.teamContact || '조직도 · 연락처' }
    ];
    var links = items.map(function (it) {
      var cur = it.id === page ? ' aria-current="page"' : '';
      return '<a href="' + it.href + '"' + cur + '>' + esc(it.label) + '</a>';
    }).join('');
    return (
      '<header class="site-header"><div class="wrap">' +
        '<a class="logo" href="index.html" aria-label="' + esc(get(c, 'site.name', '')) + ' 홈">' +
          '<img src="' + esc(get(c, 'site.logo', 'assets/logo.jpg')) + '" alt="' + esc(get(c, 'site.name', '')) + ' 로고">' +
        '</a>' +
        '<nav class="nav" aria-label="주요 메뉴">' + links + '</nav>' +
        '<a class="btn btn-dark btn-sm" href="team.html#contact">' + esc(get(c, 'site.joinButton', '가입 문의')) + '</a>' +
      '</div></header>'
    );
  }

  function footer(c) {
    var nav = c.nav || {};
    var contact = c.contact || {};
    var right = [contact.email, contact.instagram ? 'Instagram ' + contact.instagram : '']
      .filter(Boolean).map(esc).join(' · ');
    return (
      '<footer class="site-footer"><div class="wrap">' +
        '<div class="ft">' +
          '<span class="wordmark">' + esc(get(c, 'site.wordmark', '')) + '<span>.</span></span>' +
          '<nav class="fnav" aria-label="푸터 메뉴">' +
            '<a href="about.html">' + esc(nav.about || '소개') + '</a>' +
            '<a href="activities.html">' + esc(nav.activities || '활동') + '</a>' +
            '<a href="team.html">' + esc(nav.team || '조직도') + '</a>' +
            '<a href="team.html#contact">' + esc(nav.contact || '연락처') + '</a>' +
          '</nav>' +
        '</div>' +
        '<div class="fb"><span>' + esc(get(c, 'site.footerLeft', '')) + '</span><span>' + right + '</span></div>' +
      '</div></footer>'
    );
  }

  function pageHead(sec) {
    return (
      '<section class="page-head"><div class="wrap">' +
        (sec.label ? '<span class="eyebrow">' + esc(sec.label) + '</span>' : '') +
        '<h1 class="h1">' + esc(sec.title) + '</h1>' +
        (sec.intro ? '<p class="lead">' + esc(sec.intro) + '</p>' : '') +
      '</div></section>'
    );
  }

  function photo(src, alt) {
    return src ? '<div class="photo"><img src="' + esc(src) + '" alt="' + esc(alt) + '" loading="lazy"></div>' : '';
  }

  function kvList(rows, cls) {
    if (!has(rows)) return '';
    return '<dl class="' + cls + '">' + list(rows).map(function (r) {
      return '<div><dt>' + esc(r.label) + '</dt><dd>' + esc(r.value) + '</dd></div>';
    }).join('') + '</dl>';
  }

  // ---------- home ----------
  function home(c) {
    var h = c.home || {};
    var hl = h.titleHighlight || '';
    var lines = list(h.titleLines).map(function (line) {
      var s = esc(line);
      if (hl) {
        var e = esc(hl);
        var i = s.indexOf(e);
        if (i >= 0) s = s.slice(0, i) + '<span class="hl">' + e + '</span>' + s.slice(i + e.length);
      }
      return s;
    }).join('<br>');

    var facts = has(h.facts)
      ? '<div class="wrap facts-wrap">' + kvList(h.facts, 'facts') + '</div>'
      : '<div class="facts-wrap"></div>';

    var w = h.whatWeDo || {};
    var works = list(w.items).map(function (it, i) {
      var partners = '';
      if (has(it.partners)) {
        partners =
          '<div class="partners">' +
            '<span class="partners-label">' + esc(it.partnersLabel || '협력 단체') + '</span>' +
            '<div class="chips">' + list(it.partners).map(function (p) {
              var name = typeof p === 'string' ? p : p.name;
              var logo = typeof p === 'string' ? '' : p.logo;
              return '<span class="partner">' +
                (logo ? '<img src="' + esc(logo) + '" alt="' + esc(name) + '">' : esc(name)) +
              '</span>';
            }).join('') + '</div>' +
          '</div>';
      }
      return (
        '<div class="work">' +
          '<span class="num">' + pad(i + 1) + '</span>' +
          '<div class="body"><strong>' + esc(it.title) + '</strong><p>' + esc(it.desc) + '</p>' + partners + '</div>' +
        '</div>'
      );
    }).join('');

    var p = h.projects || {};
    var projects = has(p.items)
      ? '<section class="section"><div class="wrap">' +
          '<div class="sec-head"><h2 class="h2">' + esc(p.title) + '</h2>' +
          (p.linkText ? '<a class="link-line" href="activities.html">' + esc(p.linkText) + '</a>' : '') + '</div>' +
          '<div class="grid3">' + list(p.items).map(function (it) {
            return '<article class="proj">' + photo(it.image, it.title) +
              '<span class="meta">' + esc([it.type, it.year].filter(Boolean).join(' · ')) + '</span>' +
              '<strong>' + esc(it.title) + '</strong></article>';
          }).join('') + '</div>' +
        '</div></section>'
      : '';

    var r = h.recruit || {};
    var recruit = r.title
      ? '<section class="recruit"><div class="wrap">' +
          '<div class="left"><h2>' + esc(r.title) + '</h2>' + kvList(r.rows, 'kv') + '</div>' +
          (r.button ? '<a class="btn btn-dark btn-lg" href="team.html#contact">' + esc(r.button) + '</a>' : '') +
        '</div></section>'
      : '';

    var b = h.buttons || {};
    return (
      '<section class="hero">' +
        '<div class="wrap"><div class="hero-row">' +
          '<h1>' + lines + '</h1>' +
          '<div class="hero-side">' +
            (h.intro ? '<p>' + esc(h.intro) + '</p>' : '') +
            '<div class="btns">' +
              (b.primary ? '<a class="btn btn-dark" href="about.html">' + esc(b.primary) + '</a>' : '') +
              (b.secondary ? '<a class="btn btn-line" href="activities.html">' + esc(b.secondary) + '</a>' : '') +
            '</div>' +
          '</div>' +
        '</div></div>' +
        '<div class="wrap beat"><svg aria-hidden="true" viewBox="0 0 1136 120">' +
          '<path class="line" pathLength="1000" d="M10 92 H500 L526 112 L574 12 L614 92 H1126" fill="none" stroke="var(--accent)" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"></path>' +
          '<path class="signal" pathLength="1000" d="M10 92 H500 L526 112 L574 12 L614 92 H1126" fill="none" stroke="#0E1112" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"></path>' +
          '<circle cx="10" cy="92" r="8" fill="#F3F4F2" stroke="#0E1112" stroke-width="4"></circle>' +
          '<circle cx="1126" cy="92" r="8" fill="#F3F4F2" stroke="var(--accent)" stroke-width="4"></circle>' +
        '</svg></div>' +
        facts +
      '</section>' +
      (has(w.items)
        ? '<section class="section alt"><div class="wrap">' +
            '<div class="sec-head"><h2 class="h2">' + esc(w.title) + '</h2>' +
            (w.linkText ? '<a class="link-line" href="activities.html">' + esc(w.linkText) + '</a>' : '') + '</div>' +
            '<div class="grid2">' + works + '</div>' +
          '</div></section>'
        : '') +
      projects +
      recruit
    );
  }

  // ---------- about ----------
  function about(c) {
    var a = c.about || {};
    var fields = list(a.fields).map(function (f, i) {
      return (
        '<div class="field">' +
          '<div class="field-top">' +
            '<div class="t"><span class="idx">' + pad(i + 1) + '</span><strong>' + esc(f.title) + '</strong></div>' +
            (has(f.tags) ? '<div class="tags">' + list(f.tags).map(function (t) { return '<span>' + esc(t) + '</span>'; }).join('') + '</div>' : '') +
          '</div>' +
          (has(f.items) ? '<ul class="bul">' + list(f.items).map(function (t) { return '<li>' + esc(t) + '</li>'; }).join('') + '</ul>' : '') +
        '</div>'
      );
    }).join('');

    return (
      pageHead(a) +
      '<section class="section"><div class="wrap overview">' +
        '<div class="logo-box"><img src="' + esc(get(c, 'site.logo', 'assets/logo.jpg')) + '" alt="' + esc(get(c, 'site.name', '')) + ' 로고"></div>' +
        '<div class="ov"><h2 class="h2">' + esc(a.overviewTitle || '개요') + '</h2>' + kvList(a.overview, 'dl') + '</div>' +
      '</div></section>' +
      (has(a.fields)
        ? '<section class="section alt"><div class="wrap">' +
            '<div class="sec-head"><h2 class="h2">' + esc(a.fieldsTitle) + '</h2></div>' +
            '<div class="grid2">' + fields + '</div>' +
          '</div></section>'
        : '') +
      (has(a.schedule)
        ? '<section class="section"><div class="wrap">' +
            '<div class="sec-head"><h2 class="h2">' + esc(a.scheduleTitle) + '</h2></div>' +
            '<ol class="steps">' + list(a.schedule).map(function (s) {
              return '<li><span class="meta">' + esc(s.term) + '</span><strong>' + esc(s.title) + '</strong></li>';
            }).join('') + '</ol>' +
          '</div></section>'
        : '')
    );
  }

  // ---------- activities ----------
  function activities(c) {
    var a = c.activities || {};
    var items = list(a.items);
    var tabs = a.tabs || {};
    var nIn = items.filter(function (i) { return !isOut(i.scope); }).length;
    var nOut = items.length - nIn;
    var tab = function (id, label, n, on) {
      return '<button type="button" class="tab" data-filter="' + id + '" aria-pressed="' + (on ? 'true' : 'false') + '">' +
        esc(label) + ' <span class="n">' + n + '</span></button>';
    };
    var cards = items.map(function (i) {
      var out = isOut(i.scope);
      return (
        '<article class="act" data-scope="' + (out ? 'out' : 'in') + '">' +
          photo(i.image, i.title) +
          '<div class="row"><span class="scope' + (out ? ' out' : '') + '">' + esc(i.scope) + '</span>' +
            (i.when ? '<span class="meta">' + esc(i.when) + '</span>' : '') + '</div>' +
          '<strong>' + esc(i.title) + '</strong>' +
          (i.desc ? '<p>' + esc(i.desc) + '</p>' : '') +
        '</article>'
      );
    }).join('');

    var cols = list(a.recordsColumns);
    var col = function (k, d) { return esc(cols[k] || d); };
    var records = has(a.records)
      ? '<section class="section alt"><div class="wrap">' +
          '<div class="sec-head"><h2 class="h2">' + esc(a.recordsTitle) + '</h2></div>' +
          '<div class="table-wrap"><table class="records"><thead><tr>' +
            '<th scope="col">' + col(0, '연도') + '</th><th scope="col">' + col(1, '구분') + '</th>' +
            '<th scope="col">' + col(2, '활동명') + '</th><th scope="col">' + col(3, '참여 팀') + '</th>' +
            '<th scope="col">' + col(4, '결과') + '</th>' +
          '</tr></thead><tbody>' + list(a.records).map(function (r) {
            return '<tr><td class="y">' + esc(r.year) + '</td><td class="sub">' + esc(r.type) + '</td>' +
              '<td class="name">' + esc(r.name) + '</td><td class="sub">' + esc(r.team) + '</td><td>' + esc(r.result) + '</td></tr>';
          }).join('') + '</tbody></table></div>' +
        '</div></section>'
      : '';

    return (
      pageHead(a) +
      (items.length
        ? '<section class="section" style="padding-top:56px"><div class="wrap">' +
            '<div class="tabs" role="group" aria-label="활동 분류">' +
              tab('all', tabs.all || '전체', items.length, true) +
              (nIn ? tab('in', tabs.in || '교내 활동', nIn, false) : '') +
              (nOut ? tab('out', tabs.out || '대외활동', nOut, false) : '') +
            '</div>' +
            '<div class="grid3" id="acts">' + cards + '</div>' +
          '</div></section>'
        : '') +
      records
    );
  }

  function bindTabs(root) {
    var buttons = root.querySelectorAll('.tab');
    var cards = root.querySelectorAll('.act');
    buttons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var f = btn.getAttribute('data-filter');
        buttons.forEach(function (b) { b.setAttribute('aria-pressed', b === btn ? 'true' : 'false'); });
        cards.forEach(function (card) { card.hidden = !(f === 'all' || card.getAttribute('data-scope') === f); });
      });
    });
  }

  // ---------- team ----------
  function team(c) {
    var t = c.team || {};
    var ct = c.contact || {};
    var person = function (p, lead) {
      if (!p || !p.name) return '';
      return '<div class="person' + (lead ? ' lead' : '') + '">' +
        '<span class="role">' + esc(p.role) + '</span><strong>' + esc(p.name) + '</strong>' +
        (p.email ? '<a class="mail" href="mailto:' + esc(p.email) + '">' + esc(p.email) + '</a>' : '') +
      '</div>';
    };
    var adv = t.advisor && t.advisor.name
      ? '<div class="advisor"><div class="dash" aria-hidden="true"></div><div class="box">' +
          '<span class="role">' + esc(t.advisor.role || '지도교수') + '</span><strong>' + esc(t.advisor.name) + '</strong></div></div>'
      : '';
    var depts = list(t.departments);
    var leaderLabel = t.leaderLabel || '팀장';
    var deptHtml = depts.length
      ? '<div class="vline" aria-hidden="true"></div>' +
        '<div class="depts' + (depts.length === 1 ? ' single' : '') + '" style="--n:' + depts.length + '">' +
          depts.map(function (d) {
            return '<div class="dept"><div class="box"><strong>' + esc(d.name) + '</strong>' +
              (d.desc ? '<span class="d">' + esc(d.desc) + '</span>' : '') +
              (d.leader ? '<span class="l">' + esc(leaderLabel) + ' ' + esc(d.leader) + '</span>' : '') +
            '</div></div>';
          }).join('') +
        '</div>'
      : '';

    var contactRows = [];
    if (ct.email) contactRows.push('<div><dt>이메일</dt><dd><a href="mailto:' + esc(ct.email) + '">' + esc(ct.email) + '</a></dd></div>');
    if (ct.instagram) contactRows.push('<div><dt>인스타그램</dt><dd>' +
      (ct.instagramUrl ? '<a href="' + esc(ct.instagramUrl) + '" target="_blank" rel="noopener">' + esc(ct.instagram) + '</a>' : esc(ct.instagram)) + '</dd></div>');
    if (ct.kakao) contactRows.push('<div><dt>카카오톡</dt><dd>' + esc(ct.kakao) + '</dd></div>');
    if (ct.room) contactRows.push('<div><dt>동아리방</dt><dd>' + esc(ct.room) + '</dd></div>');

    var types = list(t.formTypes).map(function (o) { return '<option>' + esc(o) + '</option>'; }).join('');

    return (
      pageHead(t) +
      '<section class="section" aria-label="' + esc(t.title) + '"><div class="wrap org">' +
        '<div class="org-top"><div class="spacer" aria-hidden="true"></div>' + person(t.president, true) +
          (adv || '<div class="spacer" aria-hidden="true"></div>') + '</div>' +
        (t.vicePresident && t.vicePresident.name ? '<div class="vline" aria-hidden="true"></div>' + person(t.vicePresident, false) : '') +
        deptHtml +
      '</div></section>' +
      '<section class="section contact" id="contact" aria-labelledby="contact-title"><div class="wrap">' +
        '<div class="info"><h2 class="h2" id="contact-title">' + esc(t.contactTitle || '연락처') + '</h2>' +
          '<dl class="dl">' + contactRows.join('') + '</dl></div>' +
        (ct.email
          ? '<form class="form" id="contact-form" novalidate>' +
              '<h3>' + esc(t.formTitle || '문의하기') + '</h3>' +
              '<div class="two"><label>이름<input type="text" name="name" autocomplete="name" required></label>' +
              '<label>소속<input type="text" name="org"></label></div>' +
              '<label>이메일<input type="email" name="email" autocomplete="email" required></label>' +
              (types ? '<label>문의 유형<select name="type">' + types + '</select></label>' : '') +
              '<label>내용<textarea name="message" rows="5" required></textarea></label>' +
              (t.formNote ? '<p class="note">' + esc(t.formNote) + '</p>' : '') +
              '<button type="submit" class="btn btn-dark">보내기</button>' +
            '</form>'
          : '') +
      '</div></section>'
    );
  }

  function bindForm(root, c) {
    var form = root.querySelector('#contact-form');
    if (!form) return;
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var v = function (n) { var el = form.elements[n]; return el ? el.value.trim() : ''; };
      if (!v('name') || !v('message')) {
        (form.elements[!v('name') ? 'name' : 'message']).focus();
        return;
      }
      var subject = '[' + get(c, 'site.name', '') + ' 문의] ' + (v('type') || '') + ' - ' + v('name');
      var body = '이름: ' + v('name') + '\n소속: ' + v('org') + '\n이메일: ' + v('email') + '\n문의 유형: ' + v('type') + '\n\n' + v('message');
      window.location.href = 'mailto:' + encodeURIComponent(get(c, 'contact.email', '')) +
        '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
    });
  }

  // ---------- boot ----------
  var PAGES = { home: home, about: about, activities: activities, team: team };
  var TITLES = { home: '', about: 'nav.about', activities: 'nav.activities', team: 'nav.team' };

  function render(c, page) {
    var fn = PAGES[page] || home;
    return header(c, page) + '<main id="main">' + fn(c) + '</main>' + footer(c);
  }

  function boot() {
    var app = document.getElementById('app');
    var page = document.body.getAttribute('data-page') || 'home';
    fetch('content.json', { cache: 'no-cache' })
      .then(function (r) { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
      .then(function (c) {
        if (get(c, 'site.accent')) document.documentElement.style.setProperty('--accent', c.site.accent);
        var name = get(c, 'site.name', '');
        var sub = TITLES[page] ? get(c, TITLES[page], '') : '';
        document.title = sub ? sub + ' — ' + name : name;
        app.innerHTML = render(c, page);
        if (page === 'activities') bindTabs(app);
        if (page === 'team') bindForm(app, c);
        if (location.hash) {
          var target = document.getElementById(location.hash.slice(1));
          if (target) target.scrollIntoView();
        }
      })
      .catch(function (err) {
        var local = location.protocol === 'file:';
        app.innerHTML =
          '<div class="load-error"><strong>content.json을 불러오지 못했습니다.</strong><br>' +
          (local
            ? '파일을 더블클릭해서 열면 브라우저 보안 정책 때문에 내용을 읽을 수 없습니다. 사이트 폴더에서 <code>python3 -m http.server 8000</code>을 실행한 뒤 <code>http://localhost:8000</code>으로 열어 주세요.'
            : 'content.json의 쉼표나 따옴표가 빠지지 않았는지 확인해 주세요. (' + esc(err.message) + ')') +
          '</div>';
      });
  }

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { render: render };
  } else {
    boot();
  }
})();
