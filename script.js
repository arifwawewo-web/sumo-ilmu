let BYE = null, H = [], SR = 0, P = [], phase = 'swiss', M = [], mi = 0, D = null, qp = 0, QO = [], ac = null, WN = 2, LN = 2, revealed = false, SLOTS = 0, SEEDS = [], SEEDL = [], PO = [], SEQ = [], KK = 8, BRD = {}, BYT = '', SHEETROWS = [], CURBANK = null;
const VARIANTS = [
  {
    n: 'Original',
    l: 'assets/characters/L_Original.png',
    r: 'assets/characters/R_Original.png'
  },
  {
    n: 'Blaze',
    l: 'assets/characters/L_Blaze.png',
    r: 'assets/characters/R_Blaze.png'
  },
  {
    n: 'Volt',
    l: 'assets/characters/L_Volt.png',
    r: 'assets/characters/R_Volt.png'
  },
  {
    n: 'Nova',
    l: 'assets/characters/L_Nova.png',
    r: 'assets/characters/R_Nova.png'
  },
  {
    n: 'Gold',
    l: 'assets/characters/L_Gold.png',
    r: 'assets/characters/R_Gold.png'
  },
  {
    n: 'Shadow',
    l: 'assets/characters/L_Shadow.png',
    r: 'assets/characters/R_Shadow.png'
  },
  {
    n: 'Zenith',
    l: 'assets/characters/L_Zenith.png',
    r: 'assets/characters/R_Zenith.png'
  }
];
const BRC = {
  BW: 176,
  DX: 214,
  X0: 14,
  SP: 76,
  BH: 46
};

// Util kecil: acak array, escape HTML, elemen by id
const esc = s => String(s).replace(/[&<>"]/g, c => ({
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;'
}[c]));
const $ = id => document.getElementById(id), sh = a => a.map(x => [
    Math.random(),
    x
  ]).sort((a, b) => a[0] - b[0]).map(x => x[1]);

// =========================================================
// SUARA & EFEK LAYAR (Web Audio, flash, partikel percikan)
// =========================================================
function snd(f, d = 0.12, t = 'square') {
  try {
    ac = ac || new AudioContext();
    const o = ac.createOscillator(), g = ac.createGain();
    o.type = t;
    o.frequency.value = f;
    g.gain.value = 0.08;
    o.connect(g);
    g.connect(ac.destination);
    o.start();
    g.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + d);
    o.stop(ac.currentTime + d);
  } catch (e) {
  }
}
let INTROTO = [];
function iswell(f1, f2, d) {
  try {
    ac = ac || new AudioContext();
    const o = ac.createOscillator(), g = ac.createGain();
    o.type = 'sine';
    o.frequency.setValueAtTime(f1, ac.currentTime);
    o.frequency.linearRampToValueAtTime(f2, ac.currentTime + d);
    g.gain.setValueAtTime(0, ac.currentTime);
    g.gain.linearRampToValueAtTime(0.05, ac.currentTime + d * 0.4);
    g.gain.linearRampToValueAtTime(0, ac.currentTime + d);
    o.connect(g);
    g.connect(ac.destination);
    o.start();
    o.stop(ac.currentTime + d);
  } catch (e) {
  }
}
function iLine(txt, t, hold) {
  INTROTO.push(setTimeout(() => {
    const d = document.createElement('div');
    d.className = 'iline';
    d.innerHTML = esc(txt) + '<span class="ilu"></span>';
    $('ilines').appendChild(d);
    requestAnimationFrame(() => d.classList.add('show'));
    iswell(280, 340, 0.9);
    INTROTO.push(setTimeout(() => {
      d.classList.remove('show');
      d.classList.add('out');
      INTROTO.push(setTimeout(() => d.remove(), 650));
    }, hold));
  }, t));
}
function runIntro() {
  iLine('Siap menguji ketangkasanmu?', 500, 2000);
  iLine('Satu dorongan bisa menentukan segalanya.', 3000, 2100);
  iLine('Beranikah kau melangkah ke arena?', 5600, 2000);
  INTROTO.push(setTimeout(() => {
    iswell(180, 90, 1.4);
    $('ititlediv').classList.add('show');
  }, 8000));
  INTROTO.push(setTimeout(() => $('ititle').classList.add('show'), 8350));
  INTROTO.push(setTimeout(() => $('isub').classList.add('show'), 8950));
  INTROTO.push(setTimeout(() => $('itap').classList.add('show'), 9500));
}

// =========================================================
// LAYAR INTRO SINEMATIK
// =========================================================
function leaveIntroF() {
  const el = document.getElementById('introf');
  if (!el)
    return;
  INTROTO.forEach(clearTimeout);
  snd(500, 0.3, 'triangle');
  el.classList.add('leave');
  setTimeout(() => el.remove(), 700);
}

// Tombol fullscreen (pojok kanan atas)
function toggleFS() {
  const d = document;
  if (!d.fullscreenElement) {
    (d.documentElement.requestFullscreen || function () {
    }).call(d.documentElement).catch(() => {
    });
  } else {
    (d.exitFullscreen || function () {
    }).call(d);
  }
}
function syncFS() {
  const on = !!document.fullscreenElement;
  const b = $('fsbtn');
  if (b)
    b.textContent = on ? '\u26F6' : '\u26F6';
}
document.addEventListener('fullscreenchange', syncFS);
function flash() {
  const f = $('flash');
  f.style.opacity = '.32';
  setTimeout(() => f.style.opacity = '0', 110);
}
function spark(cx, cy, color, n, sc) {
  n = n || 16;
  sc = sc || 1;
  for (let i = 0; i < n; i++) {
    const d = document.createElement('div');
    d.className = 'spark';
    d.style.left = cx + 'px';
    d.style.top = cy + 'px';
    d.style.background = color;
    d.style.color = color;
    d.style.opacity = '1';
    d.style.transition = 'transform .55s ease-out,opacity .55s';
    document.body.appendChild(d);
    const ang = Math.random() * 6.283, dist = (35 + Math.random() * 80) * sc;
    requestAnimationFrame(() => {
      d.style.transform = `translate(${ Math.cos(ang) * dist }px,${ Math.sin(ang) * dist }px)`;
      d.style.opacity = '0';
    });
    setTimeout(() => d.remove(), 600);
  }
}

// =========================================================
// NAVIGASI ANTAR LAYAR (setup, board, duel, dsb.)
// =========================================================
function show(id) {
  document.querySelectorAll('.scr').forEach(s => s.classList.remove('on'));
  $(id).classList.add('on');
  document.body.classList.toggle('wcb', phase == 'wc');
}
for (let i = 4; i <= 30; i++)
  $('cnt').add(new Option(i + ' peserta' + (i % 2 ? ' (ganjil)' : ''), i));
$('cnt').value = 8;
function oddNote() {
  $('odd').textContent = $('cnt').value % 2 ? 'Jumlah ganjil: 1 peserta tiap ronde mendapat WO (menang otomatis).' : '';
}

// Parser CSV sederhana (mendukung tanda kutip & koma di dalam sel)
function parseCSV(t) {
  const rows = [];
  let row = [], cur = '', q = false;
  for (let i = 0; i < t.length; i++) {
    const c = t[i];
    if (q) {
      if (c == '"') {
        if (t[i + 1] == '"') {
          cur += '"';
          i++;
        } else
          q = false;
      } else
        cur += c;
    } else {
      if (c == '"')
        q = true;
      else if (c == ',') {
        row.push(cur);
        cur = '';
      } else if (c == '\n' || c == '\r') {
        if (c == '\r' && t[i + 1] == '\n')
          i++;
        row.push(cur);
        cur = '';
        rows.push(row);
        row = [];
      } else
        cur += c;
    }
  }
  if (cur.length || row.length) {
    row.push(cur);
    rows.push(row);
  }
  return rows.filter(r => r.length > 1 || (r[0] || '').trim());
}

// =========================================================
// BANK SOAL — ambil & filter dari Google Sheets (CSV)
// =========================================================
async function loadSheet() {
  const url = $('sheetUrl').value.trim();
  $('startBtn').disabled = true;
  SHEETROWS = [];
  $('filterWrap').style.display = 'none';
  $('bankCount').textContent = '';
  if (!url) {
    $('sheetStatus').textContent = '\u274C Isi link CSV spreadsheet dulu.';
    return;
  }
  $('sheetStatus').textContent = '\u23F3 Memuat bank soal dari Google Sheets...';
  try {
    const res = await fetch(url);
    if (!res.ok)
      throw new Error('HTTP ' + res.status);
    const text = await res.text();
    const rows = parseCSV(text);
    if (rows.length < 2)
      throw new Error('Data kosong');
    const head = rows[0].map(h => (h || '').trim().toLowerCase()), idx = n => head.indexOf(n);
    const iK = idx('kelas'), iS2 = idx('semester'), iM = idx('materi'), iQ = idx('soal'), iA = idx('a'), iB = idx('b'), iC = idx('c'), iD = idx('d');
    if (iQ < 0 || iA < 0 || iB < 0 || iC < 0 || iD < 0)
      throw new Error('Kolom Soal/A/B/C/D tidak ditemukan di header');
    SHEETROWS = rows.slice(1).map(r => ({
      kelas: iK >= 0 ? (r[iK] || '').trim() : '',
      semester: iS2 >= 0 ? (r[iS2] || '').trim() : '',
      materi: iM >= 0 ? (r[iM] || '').trim() : '',
      q: [
        r[iQ],
        r[iA],
        r[iB],
        r[iC],
        r[iD]
      ].map(x => (x || '').trim())
    })).filter(d => d.q[0] && d.q[1]);
    if (!SHEETROWS.length)
      throw new Error('Tidak ada baris soal yang valid');
    $('sheetStatus').textContent = `✅ ${ SHEETROWS.length } soal termuat dari spreadsheet`;
    const kelasList = [...new Set(SHEETROWS.map(d => d.kelas).filter(Boolean))].sort((a, b) => a.localeCompare(b, 'id', { numeric: true }));
    $('fKelas').innerHTML = '<option value="" disabled selected>-- Pilih Kelas --</option>' + kelasList.map(k => `<option value="${ k }">Kelas ${ k }</option>`).join('');
    onKelasChange();
    $('filterWrap').style.display = 'flex';
  } catch (e) {
    $('sheetStatus').textContent = '\u274C Gagal memuat bank soal (' + e.message + '). Perbaiki link lalu klik Muat Ulang.';
    SHEETROWS = [];
    $('filterWrap').style.display = 'none';
    $('startBtn').disabled = true;
  }
}
function onKelasChange() {
  const k = $('fKelas').value, pool = k ? SHEETROWS.filter(d => d.kelas == k) : [];
  const semList = [...new Set(pool.map(d => d.semester).filter(Boolean))].sort((a, b) => a.localeCompare(b, 'id', { numeric: true }));
  $('fSemester').innerHTML = '<option value="" disabled selected>-- Pilih Semester --</option>' + semList.map(sm => `<option value="${ sm }">Semester ${ sm }</option>`).join('');
  onSemesterChange();
}
function onSemesterChange() {
  const k = $('fKelas').value, sm = $('fSemester').value, pool = k && sm ? SHEETROWS.filter(d => d.kelas == k && d.semester == sm) : [];
  const materiList = [...new Set(pool.map(d => d.materi).filter(Boolean))].sort((a, b) => a.localeCompare(b, 'id'));
  $('fMateri').innerHTML = '<option value="" disabled selected>-- Pilih Materi --</option>' + materiList.map(m => `<option value="${ m }">${ m }</option>`).join('');
  onMateriChange();
}
function curPool() {
  const k = $('fKelas').value, sm = $('fSemester').value, m = $('fMateri').value;
  if (!k || !sm || !m)
    return null;
  return SHEETROWS.filter(d => d.kelas == k && d.semester == sm && d.materi == m);
}
function onMateriChange() {
  const k = $('fKelas').value, sm = $('fSemester').value, m = $('fMateri').value;
  if (!k || !sm || !m) {
    $('bankCount').innerHTML = '<span style="color:#f5b93a">\uD83D\uDC49 Pilih Kelas, Semester, dan Materi dulu untuk memulai.</span>';
    $('startBtn').disabled = true;
    return;
  }
  const pool = curPool();
  if (!pool.length) {
    $('bankCount').innerHTML = '<span style="color:#ff6b6b">\u26A0️ Soal untuk Kelas ' + k + ' &middot; Semester ' + sm + ' &middot; ' + m + ' belum tersedia di spreadsheet.</span>';
    $('startBtn').disabled = true;
    return;
  }
  if (pool.length < 3) {
    $('bankCount').innerHTML = '<span style="color:#ff6b6b">\u26A0️ Baru ' + pool.length + ' soal untuk pilihan ini, minimal 3. Tambahkan soal di spreadsheet.</span>';
    $('startBtn').disabled = true;
    return;
  }
  $('bankCount').innerHTML = `📚 ${ pool.length } soal siap dipakai`;
  $('startBtn').disabled = false;
}

// =========================================================
// MULAI TURNAMEN — bentuk daftar peserta & acak giliran awal
// =========================================================
function startT() {
  const pool = curPool();
  if (!pool || pool.length < 3) {
    alert('Pilih Kelas dan Materi yang punya minimal 3 soal dulu.');
    return;
  }
  const n = $('names').value.split('\n').map(s => s.trim()).filter(Boolean), c = +$('cnt').value;
  WN = LN = c >= 16 ? 3 : 2;
  revealed = false;
  H = [];
  SR = 0;
  phase = 'swiss';
  M = [];
  mi = 0;
  BYE = null;
  BYT = '';
  PO = [];
  SEQ = [];
  P = [];
  for (let i = 0; i < c; i++)
    P.push({
      n: n[i] || 'Peserta ' + (i + 1),
      w: 0,
      l: 0,
      st: 'swiss',
      rc: VARIANTS[Math.floor(Math.random() * VARIANTS.length)]
    });
  CURBANK = pool.map(d => d.q);
  QO = sh(CURBANK.map((_, i) => i));
  qp = 0;
  shuffleAnim();
}

// =========================================================
// LOGIKA TURNAMEN — Swiss Stage, Wildcard, Upper/Lower Bracket
// =========================================================
function pairUp(a) {
  a = sh(a).sort((x, y) => y.w - y.l - (x.w - x.l));
  let bye = null;
  if (a.length % 2) {
    for (let i = a.length - 1; i >= 0; i--)
      if (!a[i].bye) {
        bye = a.splice(i, 1)[0];
        break;
      }
    if (!bye)
      bye = a.pop();
    bye.bye = (bye.bye || 0) + 1;
  }
  const r = [];
  for (let i = 0; i < a.length; i += 2)
    r.push([
      a[i],
      a[i + 1]
    ]);
  return {
    r,
    bye
  };
}
function pairRandom(a) {
  a = sh(a);
  let bye = null;
  if (a.length % 2)
    bye = a.pop();
  const r = [];
  for (let i = 0; i < a.length; i += 2)
    r.push([
      a[i],
      a[i + 1]
    ]);
  return {
    r,
    bye
  };
}

// Animasi kocok nama sebelum Swiss Stage 1 dimulai
function shuffleAnim() {
  show('shuffle');
  $('shBoard').innerHTML = sh(P).map(p => `<span class="ch swiss shf">${ p.n }</span>`).join('');
  let i = 0;
  const iv = setInterval(() => snd(300 + i++ % 6 * 40, 0.08), 160);
  setTimeout(() => {
    clearInterval(iv);
    snd(700, 0.3, 'triangle');
    round();
  }, 1600);
}

// Menentukan ronde berikutnya sesuai fase turnamen saat ini
function round() {
  let pool, b;
  BYT = '';
  if (phase == 'swiss') {
    pool = P.filter(p => p.st == 'swiss');
    if (!pool.length)
      return endSwiss();
    ({
      r: M,
      bye: b
    } = pairUp(pool));
    if (b) {
      b.w++;
      if (b.w >= WN)
        b.st = 'q';
    }
    SR++;
    M.forEach(m => {
      m.box = m[0].w + '-' + m[0].l;
      m.br = 'swiss';
      H.push(m);
    });
    $('ph').textContent = 'Swiss Stage';
    $('rule').textContent = `Menang ${ WN }x lolos Playoff • Kalah ${ LN }x masuk Wildcard`;
  } else if (phase == 'wc') {
    pool = P.filter(p => p.st == 'wc');
    const need = pool.length - SLOTS;
    if (need <= 0) {
      pool.forEach(p => p.st = 'po');
      return startPO(SEEDS.concat(sh(pool)));
    }
    const d = Math.min(Math.floor(pool.length / 2), need);
    pool = sh(pool);
    M = [];
    for (let i = 0; i < d; i++)
      M.push([
        pool[2 * i],
        pool[2 * i + 1]
      ]);
    M.forEach(m => {
      m.br = 'wc';
      H.push(m);
    });
    BYT = pool.slice(2 * d).map(p => p.n).join(', ');
    $('ph').textContent = '\u26A1 Wildcard';
    $('rule').textContent = `Sistem gugur — ${ SLOTS } pemenang terakhir masuk Playoff`;
  } else {
    const g = SEQ.find(gr => gr.some(t => !t.done));
    if (!g)
      return;
    M = g.map(t => {
      const m = [
        res(t.a),
        res(t.b)
      ];
      m.t = t;
      m.br = t.br;
      return m;
    });
    const t0 = g[0];
    $('ph').textContent = t0.br == 'ub' ? '\uD83D\uDD35 Upper Bracket \u2022 Ronde ' + t0.r : t0.br == 'lb' ? '\uD83D\uDFE3 Lower Bracket \u2022 Ronde ' + t0.r : '\uD83C\uDFC6 GRAND FINAL';
    $('rule').textContent = t0.br == 'ub' ? 'Kalah = turun ke Lower Bracket (belum gugur)' : t0.br == 'lb' ? 'Kalah = langsung tersingkir' : 'Juara Upper Bracket vs Juara Lower Bracket';
  }
  BYE = b;
  mi = 0;
  draw();
}

// Swiss Stage selesai -> tentukan siapa lolos & siapa ke Wildcard
function endSwiss() {
  const Q = P.filter(p => p.st == 'q').sort((a, b) => b.w - b.l - (a.w - a.l) || Math.random() - 0.5), W = P.filter(p => p.st == 'wc');
  let K = 4;
  while (K < Q.length)
    K *= 2;
  K = Math.min(K, 16);
  let cap = 4;
  while (cap * 2 <= P.length)
    cap *= 2;
  K = Math.min(K, cap);
  const direct = Q.slice(0, K);
  Q.slice(K).forEach(p => p.st = 'out');
  direct.forEach(p => p.st = 'po');
  SLOTS = K - direct.length;
  SEEDS = direct;
  if (SLOTS <= 0) {
    W.forEach(p => p.st = 'out');
    return startPO(direct);
  }
  if (W.length <= SLOTS) {
    W.forEach(p => p.st = 'po');
    return startPO(direct.concat(W));
  }
  phase = 'wc';
  round();
}

// Mulai fase Playoff (bangun bagan Upper/Lower Bracket)
function startPO(seeds) {
  phase = 'po';
  SEEDL = seeds;
  KK = seeds.length;
  PO = buildTpl(KK);
  round();
}
function res(src) {
  return src.s ? SEEDL[src.s - 1] : src.w ? src.w.win : src.l.lose;
}

// Membangun struktur bagan double-elimination (ukuran K peserta)
function buildTpl(K) {
  const n = Math.log2(K), T = [], mk = (br, r, i, a, b) => {
      const t = {
        br,
        r,
        i,
        a,
        b,
        done: 0
      };
      T.push(t);
      return t;
    };
  let ord = [1];
  for (let s = 2; s <= K; s *= 2) {
    const nx = [];
    ord.forEach(x => nx.push(x, s + 1 - x));
    ord = nx;
  }
  const UB = [], LB = [];
  UB[1] = [];
  for (let i = 0; i < K / 2; i++)
    UB[1].push(mk('ub', 1, i, { s: ord[2 * i] }, { s: ord[2 * i + 1] }));
  for (let r = 2; r <= n; r++) {
    UB[r] = [];
    for (let i = 0; i < K / Math.pow(2, r); i++)
      UB[r].push(mk('ub', r, i, { w: UB[r - 1][2 * i] }, { w: UB[r - 1][2 * i + 1] }));
  }
  LB[1] = [];
  for (let i = 0; i < K / 4; i++)
    LB[1].push(mk('lb', 1, i, { l: UB[1][2 * i] }, { l: UB[1][2 * i + 1] }));
  for (let j = 2; j <= 2 * (n - 1); j++) {
    LB[j] = [];
    const pv = LB[j - 1];
    if (j % 2 == 0) {
      const k = j / 2;
      for (let i = 0; i < pv.length; i++)
        LB[j].push(mk('lb', j, i, { l: UB[k + 1][pv.length - 1 - i] }, { w: pv[i] }));
    } else
      for (let i = 0; i < pv.length / 2; i++)
        LB[j].push(mk('lb', j, i, { w: pv[2 * i] }, { w: pv[2 * i + 1] }));
  }
  const lbL = LB[2 * (n - 1)][0];
  lbL.last = 1;
  const gf = mk('gf', 1, 0, { w: UB[n][0] }, { w: lbL });
  SEQ = [];
  SEQ.push(UB[1]);
  if (n >= 2)
    SEQ.push(UB[2]);
  SEQ.push(LB[1]);
  for (let r = 3; r <= n; r++) {
    SEQ.push(UB[r]);
    const j = 2 * (r - 2);
    SEQ.push(LB[j]);
    SEQ.push(LB[j + 1]);
  }
  for (let j = 1; j <= 2 * (n - 1); j++)
    if (!SEQ.includes(LB[j]))
      SEQ.push(LB[j]);
  SEQ.push([gf]);
  let id = 1;
  SEQ.forEach(g => g.forEach(t => t.id = id++));
  const {BW, DX, X0, SP, BH} = BRC, ubTop = 46;
  UB[1].forEach((m, i) => m.y = ubTop + i * SP);
  for (let r = 2; r <= n; r++)
    UB[r].forEach((m, i) => m.y = (UB[r - 1][2 * i].y + UB[r - 1][2 * i + 1].y) / 2);
  const sepY = UB[1][UB[1].length - 1].y + BH + 18, lbTop = sepY + 54;
  LB[1].forEach((m, i) => m.y = lbTop + i * SP);
  for (let j = 2; j <= 2 * (n - 1); j++)
    LB[j].forEach((m, i) => m.y = j % 2 == 0 ? LB[j - 1][i].y : (LB[j - 1][2 * i].y + LB[j - 1][2 * i + 1].y) / 2);
  for (let r = 1; r <= n; r++)
    UB[r].forEach(m => m.c = r - 1);
  for (let j = 1; j <= 2 * (n - 1); j++)
    LB[j].forEach(m => m.c = j - 1);
  const gc = Math.max(n - 1, 2 * (n - 1) - 1) + 1;
  gf.c = gc;
  gf.y = (UB[n][0].y + lbL.y) / 2;
  BRD = {
    W: X0 + gc * DX + BW + 14,
    H: LB[1][LB[1].length - 1].y + BH + 22,
    sepY
  };
  return T;
}
function draw() {
  if (phase == 'swiss' && SR === 1 && !revealed) {
    revealPairs();
    return;
  }
  renderBoard();
}
function revealPairs() {
  show('shuffle');
  const box = $('shBoard');
  box.innerHTML = '';
  const list = M.slice();
  let idx = 0;
  function next() {
    if (idx >= list.length) {
      if (BYE) {
        const d = document.createElement('div');
        d.className = 'pcard';
        d.innerHTML = `<b>${ BYE.n }</b><span class="wo">WO — lolos otomatis</span>`;
        box.appendChild(d);
        requestAnimationFrame(() => d.classList.add('in'));
        snd(600, 0.2, 'triangle');
      }
      setTimeout(() => {
        revealed = true;
        renderBoard();
      }, 1400);
      return;
    }
    const m = list[idx];
    const d = document.createElement('div');
    d.className = 'pcard';
    d.innerHTML = `<b>${ m[0].n }</b><span>VS</span><b>${ m[1].n }</b>`;
    box.appendChild(d);
    requestAnimationFrame(() => d.classList.add('in'));
    snd(480 + idx * 18, 0.15);
    idx++;
    setTimeout(next, 650);
  }
  next();
}

// =========================================================
// MENGGAMBAR BAGAN (Swiss grid, Wildcard, Upper/Lower Bracket)
// =========================================================
function renderBoard() {
  show('board');
  $('board').classList.toggle('pob', phase == 'po' || phase == 'done');
  $('pairs').innerHTML = M.map((m, i) => `<div class="pair ${ i == mi ? 'now' : '' } ${ i < mi ? 'done' : '' }">${ m.t ? `<small style="display:block;color:#fffa;font-size:.55em">${ m.t.br == 'gf' ? 'GRAND FINAL' : 'MATCH ' + m.t.id }</small>` : '' }${ m[0].n } <span style="color:var(--gold)">VS</span> ${ m[1].n }</div>`).join('') + (BYE ? `<div class="pair" style="background:#9b5cf655">${ BYE.n } — WO ✅ menang otomatis</div>` : '') + (BYT ? `<div class="pair" style="background:#9b5cf655;font-size:.75em">${ BYT } — lolos otomatis ronde ini</div>` : '');
  if (phase == 'swiss')
    swissBoard();
  else if (phase == 'wc')
    wcBoard();
  else
    poBoard();
  P.forEach(p => p.mv = 0);
  $('go').style.display = M.length && phase != 'done' ? 'inline-block' : 'none';
  $('endbar').style.display = phase == 'done' ? 'flex' : 'none';
}
const chip = p => `<span class="ch ${ p.st } ${ p.mv ? 'new' : '' }">${ p.n }</span>`;
const rowH = m => {
  const w = m.win, np = (p, sc, r) => `<span class="np ${ w === p ? 'wn' : w ? 'ls' : '' }">${ r ? `<i>${ sc }</i><u>${ p.n }</u>` : `<u>${ p.n }</u><i>${ sc }</i>` }</span>`;
  return `<div class="mr ${ M[mi] === m && !m.done ? 'cur' : '' }">${ np(m[0], m.done ? m.sa : 0, 0) }<em>VS</em>${ np(m[1], m.done ? m.sb : 0, 1) }</div>`;
};
const lst = (a, c, t) => `<div class="bx ${ c }"><div class="bt">${ t } • ${ a.length }</div><div class="cw">${ a.map(chip).join('') || '<small>Belum ada</small>' }</div></div>`;
function swissBoard() {
  const bx = (k, t) => {
    const ms = H.filter(m => m.br == 'swiss' && m.box == k);
    const wt = P.filter(p => p.st == 'swiss' && p.w + '-' + p.l == k && !M.some(mm => !mm.done && (mm[0] === p || mm[1] === p)));
    return `<div class="bx"><div class="bt">${ t }${ ms.length ? ' \u2022 ' + ms.length + ' duel' : '' }</div>${ ms.map(rowH).join('') || (wt.length ? '' : '<div class="mr" style="opacity:.5">Belum ada</div>') }${ wt.length ? `<div class="cw"><small>⏳ Menunggu lawan:</small>${ wt.map(chip).join('') }</div>` : '' }</div>`;
  };
  const cols = [], maxSum = WN - 1 + (LN - 1);
  for (let s = 0; s <= maxSum; s++) {
    let boxes = '';
    for (let w = Math.min(s, WN - 1); w >= 0; w--) {
      const l = s - w;
      if (l < 0 || l > LN - 1)
        continue;
      boxes += bx(w + '-' + l, w + '-' + l);
    }
    if (boxes)
      cols.push(`<div>${ boxes }<div class="plate">Swiss Stage ${ s + 1 }</div></div>`);
  }
  const resCol = `<div>${ lst(P.filter(p => p.w >= WN), 'win', '\u2705 Lolos Playoff') }${ lst(P.filter(p => p.l >= LN), 'wcg', '\u26A1 Wildcard (kesempatan kedua)') }<div style="font-size:.8em;opacity:.85;margin:-4px 0 8px">Rebutan slot Playoff yang belum terisi. Kalau slot sudah penuh, Wildcard tidak main.</div><div class="plate">Hasil Swiss</div></div>`;
  $('bk').innerHTML = `<div class="bk" style="grid-template-columns:repeat(${ cols.length + 1 },1fr)">${ cols.join('') }${ resCol }</div>`;
}
function wcBoard() {
  const a = H.filter(m => m.br == 'wc'), al = P.filter(p => p.st == 'wc');
  $('bk').innerHTML = `<div class="bk" style="grid-template-columns:1fr 1fr"><div class="bx wcg"><div class="bt">⚡ Wildcard • ${ a.length } duel</div>${ a.map(rowH).join('') || '<div class="mr" style="opacity:.5">Belum ada</div>' }</div>${ lst(al, 'wcg', 'Masih bertahan') }</div><div style="font-size:20px;margin:6px">Memperebutkan <b style="color:var(--gold)">${ SLOTS }</b> slot terakhir Playoff</div>`;
}
function poBoard() {
  if (!PO.length) {
    $('bk').innerHTML = '';
    return;
  }
  const {BW, DX, X0} = BRC, {
      W,
      H: HH,
      sepY
    } = BRD, cur = M[mi] && M[mi].t, nm = t => t.length > 15 ? t.slice(0, 14) + '\u2026' : t;
  const px = t => X0 + t.c * DX, slotY = (t, k) => t.y + (k ? 35 : 11);
  let ln = '', bx = '';
  PO.forEach(t => [
    t.a,
    t.b
  ].forEach((src, k) => {
    if (!src.w)
      return;
    const f = src.w, x1 = px(f) + BW, y1 = f.y + 23, x2 = px(t), y2 = slotY(t, k), xm = x2 - 14, col = t.br == 'lb' || t.br == 'gf' && k ? '#4fb3d9' : '#f5b93a';
    ln += `<path d="M${ x1 } ${ y1 }H${ xm }V${ y2 }H${ x2 }" fill="none" stroke="${ col }" stroke-width="2" opacity="${ f.done ? 1 : 0.35 }"/>`;
  }));
  PO.forEach(t => {
    const x = px(t), y = t.y, lb = t.br == 'lb', gf = t.br == 'gf', fill = lb ? '#2a7fa8' : gf ? '#ffd25a' : '#c9a24a', tx = lb ? '#fff' : '#2a1c00';
    const ph = src => src.w ? 'PEMENANG MATCH ' + src.w.id : src.l ? 'KALAH MATCH ' + src.l.id : '';
    const row = (k, src, sc) => {
      const p = res(src), yy = y + k * 24, win = t.done && t.win === p, los = t.done && t.lose === p;
      return `<g opacity="${ los ? 0.45 : 1 }"><rect x="${ x }" y="${ yy }" width="${ BW }" height="22" rx="5" fill="${ fill }"${ win ? ' stroke="#fff" stroke-width="2.5"' : '' }/>` + (p ? `<text x="${ x + 8 }" y="${ yy + 16 }" font-size="13" font-weight="800" fill="${ tx }">${ esc(nm(p.n)) }</text>` : `<text x="${ x + 8 }" y="${ yy + 15 }" font-size="9.5" font-weight="700" fill="${ tx }" opacity=".6">${ ph(src) }</text>`) + (t.done ? `<rect x="${ x + BW - 26 }" y="${ yy }" width="26" height="22" rx="5" fill="#0007"/><text x="${ x + BW - 13 }" y="${ yy + 16 }" text-anchor="middle" font-size="13" font-weight="900" fill="#fff">${ sc }</text>` : '') + '</g>';
    };
    const rdy = M.some(m => m.t === t) && !t.done;
    bx += `<text x="${ x }" y="${ y - 5 }" font-size="11" font-weight="800" fill="${ lb ? '#8fd3ee' : '#f0d68a' }">${ gf ? 'GRAND FINAL' : 'MATCH ' + t.id }</text>` + (rdy ? `<rect class="${ t === cur ? 'hl' : '' }" x="${ x - 4 }" y="${ y - 3 }" width="${ BW + 8 }" height="52" rx="8" fill="none" stroke="${ t === cur ? '#fff' : '#ffffff88' }" stroke-width="${ t === cur ? 3 : 1.5 }" stroke-dasharray="${ t === cur ? '' : '4 3' }"/>` : '') + row(0, t.a, t.sa) + row(1, t.b, t.sb);
  });
  $('bk').innerHTML = `<svg id="brk" viewBox="0 0 ${ W } ${ HH }" preserveAspectRatio="xMidYMin meet" font-family="Trebuchet MS,Segoe UI,Arial,sans-serif"><text x="${ X0 }" y="16" font-size="15" font-weight="900" letter-spacing="3" fill="#f5b93a">UPPER BRACKET</text><line x1="0" x2="${ W }" y1="${ sepY }" y2="${ sepY }" stroke="#ffffff66" stroke-dasharray="7 6"/><text x="${ X0 }" y="${ sepY + 24 }" font-size="15" font-weight="900" letter-spacing="3" fill="#4fb3d9">LOWER BRACKET</text>${ ln }${ bx }</svg>`;
}

// =========================================================
// JALANNYA SATU DUEL (VS -> Ronde -> soal -> dorongan -> menang)
// =========================================================
function nextDuel() {
  const m = M[mi];
  startDuel(m[0], m[1]);
}

// Layar VS sebelum duel + pasang karakter sesuai varian siswa
function startDuel(a, b) {
  D = {
    a,
    b,
    sa: 0,
    sb: 0,
    pos: 0,
    n: 0,
    act: false,
    wr: [
      0,
      0
    ],
    lk: [
      0,
      0
    ]
  };
  $('vl').textContent = a.n;
  $('vr').textContent = b.n;
  $('nl').textContent = a.n;
  $('nr').textContent = b.n;
  const rl = a.rc || VARIANTS[0], rr = b.rc || VARIANTS[0];
  $('iml').src = rl.l;
  $('imr').src = rr.r;
  $('nl').innerHTML = esc(a.n) + '<small style="display:block;font-weight:700;font-size:.55em;opacity:.85">SEMA-5 ' + rl.n + '</small>';
  $('nr').innerHTML = esc(b.n) + '<small style="display:block;font-weight:700;font-size:.55em;opacity:.85">SEMA-5 ' + rr.n + '</small>';
  $('sl').style.transform = $('sr').style.transform = '';
  $('sl').classList.remove('fly');
  $('sr').classList.remove('fly');
  $('vs').classList.add('on');
  snd(180, 0.4, 'sawtooth');
  setTimeout(() => {
    $('vs').classList.remove('on');
    show('duel');
    nextQ();
  }, 1700);
}

// Banner "RONDE N" lalu "MULAI!" sebelum tiap soal
function showRoundBanner(n, cb) {
  const el = $('roundcall'), t1 = document.createElement('div');
  t1.className = 'rc-text rc-round';
  t1.textContent = 'RONDE ' + n;
  el.appendChild(t1);
  requestAnimationFrame(() => t1.classList.add('show'));
  snd(220, 0.16, 'triangle');
  setTimeout(() => snd(330, 0.16, 'triangle'), 110);
  setTimeout(() => {
    t1.classList.remove('show');
    t1.classList.add('rc-out');
    setTimeout(() => {
      t1.remove();
      const t2 = document.createElement('div');
      t2.className = 'rc-text rc-fight';
      t2.textContent = 'MULAI!';
      el.appendChild(t2);
      requestAnimationFrame(() => t2.classList.add('show'));
      snd(90, 0.22, 'sawtooth');
      flash();
      setTimeout(() => {
        t2.classList.remove('show');
        t2.classList.add('rc-out');
        setTimeout(() => {
          t2.remove();
          cb();
        }, 220);
      }, 380);
    }, 240);
  }, 700);
}
function nextQ() {
  D.n++;
  D.act = false;
  $('q').textContent = '';
  $('bl').innerHTML = '';
  $('br').innerHTML = '';
  $('info').textContent = '';
  const q = CURBANK[QO[qp++ % QO.length]];
  D.wr = [
    0,
    0
  ];
  D.lk = [
    0,
    0
  ];
  showRoundBanner(D.n, () => {
    buildQ(q);
  });
}

// Tampilkan soal & tombol jawaban (dipanggil setelah banner selesai)
function buildQ(q) {
  $('q').textContent = q[0];
  $('info').textContent = 'Soal ' + D.n + ' dari 5 \u2022 duluan 3 poin';
  pips();
  [
    'bl',
    'br'
  ].forEach((id, s) => {
    const o = sh(q.slice(1).map((t, i) => ({
      t,
      ok: i == 0
    })));
    $(id).innerHTML = '';
    o.forEach((x, i) => {
      const b = document.createElement('button');
      b.className = 'opt' + (x.t.length > 55 ? ' vlong' : x.t.length > 32 ? ' long' : '');
      b.textContent = x.t;
      b.dataset.ok = x.ok ? 1 : 0;
      b.draggable = false;
      b.oncontextmenu = e => e.preventDefault();
      b.onpointerdown = e => {
        e.preventDefault();
        press(s, b);
      };
      $(id).appendChild(b);
    });
  });
  D.act = true;
}

// Siswa menekan jawaban: benar -> dorong, salah -> terkunci 3 detik
function press(s, b) {
  if (!D || !D.act || D.lk[s])
    return;
  if (b.dataset.ok == '1') {
    D.act = false;
    push(s);
  } else {
    D.lk[s] = 1;
    D.wr[s] = 1;
    snd(120, 0.25, 'sawtooth');
    const bs = [...b.parentNode.children];
    bs.forEach(x => x.disabled = true);
    if (D.wr[0] && D.wr[1]) {
      D.act = false;
      $('info').textContent = 'Dua-duanya salah! Soal baru...';
      setTimeout(() => {
        D.n--;
        nextQ();
      }, 1000);
    } else
      setTimeout(() => {
        D.lk[s] = 0;
        bs.forEach(x => x.disabled = false);
      }, 3000);
  }
}

// Bar HP (stamina) tiap pemain
function hpSet(id, rem) {
  const el = $(id), pct = Math.max(0, rem) / 3 * 100;
  el.style.width = pct + '%';
  el.classList.remove('mid', 'low');
  if (rem <= 1)
    el.classList.add('low');
  else if (rem == 2)
    el.classList.add('mid');
}
function pips() {
  hpSet('hpl', 3 - D.sb);
  hpSet('hpr', 3 - D.sa);
}

// Overlay "Nama MENDORONG!" sebagai jeda saat ada yang dapat poin
function showPush(side, name, cb) {
  const el = $('pushcall');
  const ar = document.createElement('div');
  ar.className = 'pc-arrow ' + (side ? 'r' : 'l');
  ar.style.background = side ? 'linear-gradient(90deg,transparent,#ff7a2e)' : 'linear-gradient(90deg,#2fbf71,transparent)';
  el.appendChild(ar);
  const msg = name + ' MENDORONG! \uD83D\uDCA5';
  const t = document.createElement('div');
  t.className = 'pc-txt' + (msg.length > 18 ? ' pclong' : '');
  t.style.color = side ? 'var(--o)' : 'var(--g)';
  t.textContent = msg;
  el.appendChild(t);
  requestAnimationFrame(() => {
    ar.classList.add('show');
    t.classList.add('show');
  });
  setTimeout(() => {
    ar.classList.remove('show');
    t.classList.remove('show');
    t.classList.add('pc-out');
    setTimeout(() => {
      ar.remove();
      t.remove();
      cb();
    }, 260);
  }, 680);
}
function push(s) {
  s ? D.sb++ : D.sa++;
  D.pos = (D.sa - D.sb) / 3;
  pips();
  const px = D.pos * 90;
  $('sl').style.transform = $('sr').style.transform = `translateX(${ px }px)`;
  const nm = s ? D.b.n : D.a.n;
  $('info').textContent = nm + ' DORONG! \uD83D\uDCA5';
  snd(520, 0.15);
  setTimeout(() => snd(760, 0.15), 90);
  flash();
  const svgR = document.querySelector('#duel .arena').getBoundingClientRect();
  spark(svgR.left + svgR.width * (s ? 0.32 : 0.68), svgR.top + svgR.height * 0.72, s ? '#ff7a2e' : '#2fbf71');
  const g = $('duel');
  g.classList.remove('shake');
  void g.offsetWidth;
  g.classList.add('shake');
  showPush(s, nm, () => {
    if (D.sa >= 3 || D.sb >= 3)
      endDuel();
    else
      nextQ();
  });
}

// Duel selesai: lempar yang kalah keluar ring, lanjut ke ronde berikutnya
function endDuel() {
  D.act = false;
  const w = D.pos > 0 ? D.a : D.b, l = D.pos > 0 ? D.b : D.a, loserEl = $(D.pos > 0 ? 'sr' : 'sl');
  loserEl.style.setProperty('--fx', (D.pos > 0 ? 300 : -300) + 'px');
  loserEl.style.setProperty('--fr', (D.pos > 0 ? 540 : -540) + 'deg');
  loserEl.classList.add('fly');
  snd(90, 0.6, 'sawtooth');
  flash();
  const svgR2 = document.querySelector('#duel .arena').getBoundingClientRect();
  spark(svgR2.left + svgR2.width / 2, svgR2.top + svgR2.height * 0.65, '#f5b93a', 34);
  $('info').textContent = '\uD83C\uDFC5 ' + w.n + ' MENANG!';
  setTimeout(() => {
    const cm = M[mi];
    cm.sa = D.sa;
    cm.sb = D.sb;
    cm.win = w;
    cm.done = 1;
    if (cm.t) {
      const t = cm.t;
      t.win = w;
      t.lose = l;
      t.done = 1;
      t.sa = D.sa;
      t.sb = D.sb;
      if (t.br != 'ub')
        l.st = 'out';
      if (t.br == 'gf') {
        champion(w, l, (PO.find(x => x.last) || {}).lose);
        return;
      }
    } else
      apply(w, l);
    mi++;
    if (mi >= M.length) {
      round();
    } else
      draw();
  }, 2300);
}

// Catat hasil menang/kalah ke status peserta sesuai fase turnamen
function apply(w, l) {
  w.mv = l.mv = 1;
  if (phase == 'swiss') {
    w.w++;
    l.l++;
    if (w.w >= WN)
      w.st = 'q';
    if (l.l >= LN)
      l.st = 'wc';
  } else if (phase == 'wc') {
    l.st = 'out';
  } else if (phase == 'ub') {
    l.st = 'lb';
  } else if (phase == 'lb') {
    l.st = 'out';
  } else {
    l.st = 'out';
  }
}

// =========================================================
// LAYAR JUARA SINEMATIK
// =========================================================
function champion(p, r, t) {
  phase = 'done';
  M = [];
  BYE = null;
  BYT = '';
  const c = $('cine');
  $('cname').textContent = p.n;
  $('cpod').innerHTML = (r ? `<div class="pod"><small>🥈 Juara 2</small>${ esc(r.n) }</div>` : '') + `<div class="pod g"><small>🥇 Juara 1</small>${ esc(p.n) }</div>` + (t ? `<div class="pod"><small>🥉 Juara 3</small>${ esc(t.n) }</div>` : '');
  c.classList.remove('rev');
  c.classList.add('on');
  let k = 0, gap = 430;
  const roll = () => {
    if (k >= 16)
      return;
    snd(60 + k * 7, 0.12, 'sawtooth');
    k++;
    gap = Math.max(80, gap * 0.87);
    setTimeout(roll, gap);
  };
  setTimeout(roll, 900);
  setTimeout(reveal, 4400);
}
function reveal() {
  const c = $('cine');
  flash();
  c.classList.add('rev', 'shk');
  setTimeout(() => c.classList.remove('shk'), 600);
  snd(65, 0.9, 'sawtooth');
  [
    523,
    659,
    784,
    1047,
    1319
  ].forEach((f, i) => setTimeout(() => snd(f, 0.5, 'triangle'), i * 140));
  for (let i = 0; i < 11; i++)
    setTimeout(() => spark(60 + Math.random() * (innerWidth - 120), 60 + Math.random() * innerHeight * 0.6, [
      '#f5b93a',
      '#2fbf71',
      '#ff7a2e',
      '#9b5cf6',
      '#ffffff'
    ][i % 5], 36, 2.6), 300 + i * 380);
  for (let i = 0; i < 110; i++) {
    const d = document.createElement('div');
    d.className = 'cf';
    d.style.left = Math.random() * 100 + 'vw';
    d.style.background = [
      '#f5b93a',
      '#2fbf71',
      '#ff7a2e',
      '#9b5cf6'
    ][i % 4];
    d.style.animationDuration = 2 + Math.random() * 3 + 's';
    d.style.animationDelay = Math.random() * 2.5 + 's';
    document.body.appendChild(d);
    setTimeout(() => d.remove(), 8000);
  }
}
function backCine() {
  $('cine').classList.add('on', 'rev');
}
function hideCine() {
  $('cine').classList.remove('on', 'rev');
  $('ph').textContent = '\uD83C\uDFC6 Bagan Akhir';
  $('rule').textContent = '';
  renderBoard();
}

// =========================================================
// EVENT LISTENER GLOBAL (mulai otomatis, keyboard, proteksi hold)
// =========================================================
window.addEventListener('DOMContentLoaded', () => {
  try {
    loadSheet();
  } catch (e) {
  }
  try {
    runIntro();
  } catch (e) {
  }
});
document.addEventListener('contextmenu', e => {
  if (e.target.closest('.opt,.big,#fsbtn'))
    e.preventDefault();
});
document.addEventListener('dragstart', e => e.preventDefault());
document.addEventListener('keydown', e => {
  if (!D || !D.act || !$('duel').classList.contains('on'))
    return;
  const kl = 'qwer', kr = 'uiop', k = e.key.toLowerCase();
  let i = kl.indexOf(k), s = 0;
  if (i < 0) {
    i = kr.indexOf(k);
    s = 1;
  }
  if (i < 0)
    return;
  const b = $(s ? 'br' : 'bl').children[i];
  if (b)
    press(s, b);
});