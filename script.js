let BYE = [], DUELBUSY = false, VIEW = null, CUR_PH = '', CUR_RULE = '', H = [], SR = 0, P = [], phase = 'swiss', M = [], mi = 0, D = null, qp = 0, QO = [], ac = null, WN = 2, LN = 2, revealed = false, SHEETROWS = [], CURBANK = null;
let SEQ = [], DE = null, UBCHAMP = null, UBRUNNER = null, LBCHAMP = null, LBRUNNER = null;
const BRC = { BW: 176, DX: 214, SP: 76, BH: 46 };
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
  $('odd').textContent = $('cnt').value % 2 ? 'Jumlah ganjil: ada peserta yang mendapat WO (menang otomatis) di tiap ronde.' : 'Jika ada kelompok skor yang jumlahnya ganjil, 1 peserta di kelompok itu mendapat WO.';
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
  BYE = [];
  DUELBUSY = false;
  VIEW = null;
  SEQ = [];
  DE = null;
  UBCHAMP = null;
  UBRUNNER = null;
  LBCHAMP = null;
  LBRUNNER = null;
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
  // Pasangan HANYA dibuat di dalam kelompok rekor yang persis sama (mis. 2-0 hanya lawan 2-0).
  // Kelompok yang jumlahnya ganjil: 1 peserta di kelompok itu mendapat WO (menang otomatis).
  const key = p => p.w + '-' + p.l;
  const grp = {};
  sh(a).forEach(p => (grp[key(p)] = grp[key(p)] || []).push(p));
  const keys = Object.keys(grp).sort((x, y) => {
    const [xw, xl] = x.split('-').map(Number), [yw, yl] = y.split('-').map(Number);
    return (yw - yl) - (xw - xl) || yw - xw;
  });
  const rematches = list => {
    let c = 0;
    for (let i = 0; i < list.length; i += 2)
      if ((list[i].opp || []).includes(list[i + 1]))
        c++;
    return c;
  };
  const r = [], byes = [];
  keys.forEach(k => {
    let g = grp[k];
    if (g.length % 2) {
      // WO diberikan ke yang paling jarang kena WO (urutan sudah diacak)
      g = g.slice().sort((x, y) => (x.bye || 0) - (y.bye || 0));
      const b = g.shift();
      b.bye = (b.bye || 0) + 1;
      byes.push(b);
    }
    // hindari rematch (lawan yang sama) sebisa mungkin
    let best = g, bc = rematches(g);
    for (let t = 0; t < 40 && bc > 0; t++) {
      const c = sh(g), cc = rematches(c);
      if (cc < bc) {
        best = c;
        bc = cc;
      }
    }
    for (let i = 0; i < best.length; i += 2)
      r.push([best[i], best[i + 1]]);
  });
  return { r, byes };
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
  const prevStage = stageOf(phase);
  let pool, b = [];
  if (phase == 'swiss') {
    pool = P.filter(p => p.st == 'swiss');
    if (!pool.length)
      return endSwiss();
    ({ r: M, byes: b } = pairUp(pool));
    b.forEach(x => {
      x.w++;
      if (x.w >= WN)
        x.st = 'q';
    });
    // tidak ada yang bisa bertanding di ronde ini (semua sendirian di kelompoknya) -> langsung lanjut
    if (!M.length)
      return round();
    SR++;
    M.forEach(m => {
      m.box = m[0].w + '-' + m[0].l;
      m.br = 'swiss';
      H.push(m);
    });
    $('ph').textContent = 'Swiss Stage';
    $('rule').textContent = `Menang ${ WN }x lolos Playoff \u2022 Kalah ${ LN }x masuk Wildcard \u2022 Lawan hanya dari rekor menang-kalah yang sama`;
  } else if (phase == 'wc' || phase == 'brk') {
    const g = SEQ.find(gr => gr.some(t => !t.done));
    if (!g) {
      UBCHAMP = DE.ub[DE.n][0].win;
      UBRUNNER = DE.ub[DE.n][0].lose;
      LBCHAMP = res(DE.lbChampSrc);
      LBRUNNER = DE.lbFinalMatch ? DE.lbFinalMatch.lose : null;
      phase = 'gf';
      return round();
    }
    phase = g[0].br == 'wc' ? 'wc' : 'brk';
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
    if (t0.br == 'wc') {
      $('ph').textContent = '\u26A1 Wildcard \u2022 Ronde ' + t0.r;
      $('rule').textContent = `Babak Wildcard: peserta saling adu \u2022 ${ DE.W } pemenang terakhir lolos ke Playoff (Lower Bracket) \u2022 Kalah = tersingkir`;
    } else if (t0.br == 'ub') {
      $('ph').textContent = '\uD83D\uDD35 Upper Bracket \u2022 Ronde ' + t0.r;
      $('rule').textContent = 'Kalah = turun ke Lower Bracket (belum gugur)';
    } else {
      $('ph').textContent = '\uD83D\uDFE3 Lower Bracket \u2022 Ronde ' + t0.r;
      $('rule').textContent = 'Kalah di sini = langsung tersingkir dari turnamen';
    }
  } else {
    if (!UBCHAMP || !LBCHAMP)
      return champion(UBCHAMP || LBCHAMP || P[0]);
    M = [[
        UBCHAMP,
        LBCHAMP
      ]];
    M[0].br = 'gf';
    H.push(M[0]);
    $('ph').textContent = '\uD83C\uDFC6 GRAND FINAL';
    $('rule').textContent = 'Juara Upper Bracket vs Juara Lower Bracket';
  }
  BYE = b;
  mi = 0;
  if (stageOf(phase) != prevStage)
    VIEW = null;
  CUR_PH = $('ph').textContent;
  CUR_RULE = $('rule').textContent;
  draw();
}

// Swiss Stage selesai.
//  - Upper Bracket (UB): peserta lolos dengan rekor terbaik. Ukuran bagan: 8 jika peserta awal >= 16, selain itu 4
//    (menyesuaikan kalau yang lolos lebih sedikit).
//  - WILDCARD: peserta wildcard (+ yang lolos tapi tidak muat di UB) ADU DULU. Pemenang terakhir = K/2 orang
//    (4 jika peserta >= 16, selain itu 2) masuk Lower Bracket.
//  - Lower Bracket (LB): slot pertamanya diisi yang kalah di UB Ronde 1 vs pemenang Wildcard.
function endSwiss() {
  const c = P.length;
  const Q = sh(P.filter(p => p.st == 'q')).sort((a, b) => a.l - b.l);
  const WCs = sh(P.filter(p => p.st == 'wc')).sort((a, b) => b.w - b.l - (a.w - a.l));
  const target = c >= 16 ? 8 : 4;
  let K = 2;
  while (K * 2 <= Math.min(target, Q.length))
    K *= 2;
  const pool = Q.concat(WCs);
  const ubSeeds = pool.slice(0, K);
  const wcPool = pool.slice(K);
  ubSeeds.forEach(p => p.st = 'ub');
  wcPool.forEach(p => p.st = 'wc');
  DE = buildDoubleElim(ubSeeds, wcPool, K / 2);
  phase = DE.wc.length ? 'wc' : 'brk';
  VIEW = null;
  round();
}

// Bagan: Wildcard -> (pemenang) Lower Bracket R1; Upper Bracket memakai seeding standar.
// Urutan main (SEQ): Wildcard dulu, lalu UB R1, LB R1, UB R2, LB R2, LB R3, ... sehingga match Lower
// yang butuh peserta dari Upper baru bisa main setelah match Upper yang mengisinya selesai.
// Nomor match (t.id) mengikuti urutan main. Slot kosong menampilkan "Pemenang/Kalah Match N".
function buildDoubleElim(ubSeeds, wcPool, W) {
  const K = ubSeeds.length, n = Math.log2(K), T = [];
  const { BW, DX, SP, BH } = BRC;
  const mk = (br, r, i, a, b) => {
    const t = { br, r, i, a, b, done: 0 };
    T.push(t);
    return t;
  };

  // 1) WILDCARD: sisakan tepat W pemenang. Yang peringkatnya terbaik dapat bye bila jumlah ganjil / tidak perlu main.
  const WC = [];
  let cur = wcPool.map(p => ({ p }));
  for (let wr = 1; cur.length > W; wr++) {
    const k = Math.min(cur.length >> 1, cur.length - W);
    const byeN = cur.length - 2 * k, byes = cur.slice(0, byeN), play = cur.slice(byeN);
    const grp = [];
    for (let i = 0; i < k; i++)
      grp.push(mk('wc', wr, i, play[i], play[2 * k - 1 - i]));
    grp.forEach((t, i) => {
      const ys = [t.a, t.b].filter(s => s.w && s.w.br == 'wc').map(s => s.w.y);
      t.y = ys.length ? ys.reduce((x, y) => x + y, 0) / ys.length : BH / 2 + i * SP;
    });
    grp.slice().sort((x, y) => x.y - y.y).forEach((t, i, arr) => {
      if (i && t.y < arr[i - 1].y + SP)
        t.y = arr[i - 1].y + SP;
    });
    WC.push(grp);
    cur = byes.concat(grp.map(t => ({ w: t })));
  }
  const lowerPool = cur;

  // 2) UPPER BRACKET
  let ord = [1];
  for (let s = 2; s <= K; s *= 2) {
    const nx = [];
    ord.forEach(x => nx.push(x, s + 1 - x));
    ord = nx;
  }
  const UB = [];
  UB[1] = [];
  for (let i = 0; i < K / 2; i++)
    UB[1].push(mk('ub', 1, i, { s: ord[2 * i], seeds: ubSeeds }, { s: ord[2 * i + 1], seeds: ubSeeds }));
  for (let r = 2; r <= n; r++) {
    UB[r] = [];
    for (let i = 0; i < K / Math.pow(2, r); i++)
      UB[r].push(mk('ub', r, i, { w: UB[r - 1][2 * i] }, { w: UB[r - 1][2 * i + 1] }));
  }
  UB[1].forEach((m, i) => m.y = BH / 2 + i * SP);
  for (let r = 2; r <= n; r++)
    UB[r].forEach((m, i) => m.y = (UB[r - 1][2 * i].y + UB[r - 1][2 * i + 1].y) / 2);

  // 3) LOWER BRACKET: R1 = kalah UB R1 vs pemenang wildcard (kalau slot wildcard kurang, yang kalah UB lolos WO)
  const LB = [];
  LB[1] = [];
  let prevSrc = [], prevY = [];
  for (let i = 0; i < K / 2; i++) {
    const y = BH / 2 + i * SP;
    if (i < lowerPool.length) {
      const t = mk('lb', 1, i, { l: UB[1][i] }, lowerPool[i]);
      t.y = y;
      LB[1].push(t);
      prevSrc.push({ w: t });
    } else
      prevSrc.push({ l: UB[1][i] });
    prevY.push(y);
  }
  let lbRound = 2, ubRound = 2, lbFinalMatch = LB[1].length ? LB[1][LB[1].length - 1] : null;
  while (prevSrc.length > 1 || ubRound <= n) {
    if (prevSrc.length > 1) {
      const reduced = [], ry = [];
      LB[lbRound] = [];
      for (let i = 0; i < prevSrc.length; i += 2) {
        const t = mk('lb', lbRound, i / 2, prevSrc[i], prevSrc[i + 1]);
        t.y = (prevY[i] + prevY[i + 1]) / 2;
        LB[lbRound].push(t);
        reduced.push({ w: t });
        ry.push(t.y);
        lbFinalMatch = t;
      }
      prevSrc = reduced;
      prevY = ry;
      lbRound++;
    }
    if (ubRound <= n) {
      const merged = [], my = [];
      LB[lbRound] = [];
      for (let i = 0; i < prevSrc.length; i++) {
        const t = mk('lb', lbRound, i, prevSrc[i], { l: UB[ubRound][i] });
        t.y = prevY[i];
        LB[lbRound].push(t);
        merged.push({ w: t });
        my.push(t.y);
        lbFinalMatch = t;
      }
      prevSrc = merged;
      prevY = my;
      lbRound++;
      ubRound++;
    }
  }

  // 4) Urutan main + nomor match + posisi kolom
  const wcc = WC.length;
  T.forEach(t => t.c = t.br == 'lb' ? wcc + t.r - 1 : t.r - 1);
  SEQ = [
    ...WC,
    UB[1],
    LB[1]
  ];
  for (let r = 2; r <= n; r++) {
    SEQ.push(UB[r]);
    SEQ.push(LB[2 * r - 2] || []);
    SEQ.push(LB[2 * r - 1] || []);
  }
  let id = 1;
  SEQ.forEach(g => g.forEach(t => {
    t.id = id++;
  }));
  const lowY = T.filter(t => t.br != 'ub').map(t => t.y);
  return {
    T,
    ub: UB,
    lb: LB,
    wc: WC,
    n,
    W,
    wcCols: wcc,
    lowerPool,
    lbRound,
    lbChampSrc: prevSrc[0],
    lbFinalMatch,
    ubHeight: UB[1][UB[1].length - 1].y + BH,
    lbHeight: (lowY.length ? Math.max(...lowY) : 0) + BH
  };
}
function res(src) {
  if (src.p)
    return src.p;
  if (src.s)
    return src.seeds[src.s - 1];
  if (src.w)
    return src.w.win;
  return src.l.lose;
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
      BYE.forEach(bp => {
        const d = document.createElement('div');
        d.className = 'pcard';
        d.innerHTML = `<b>${ esc(bp.n) }</b><span class="wo">WO — lolos otomatis</span>`;
        box.appendChild(d);
        requestAnimationFrame(() => d.classList.add('in'));
        snd(600, 0.2, 'triangle');
      });
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
// Pilih tampilan babak: 'swiss' (grup), 'wc' (wildcard), 'brk' (playoff). VIEW = null berarti ikut babak yang sedang berjalan.
function stageOf(ph) {
  return ph == 'swiss' ? 'swiss' : ph == 'wc' ? 'wc' : 'brk';
}
function setView(v) {
  VIEW = v == stageOf(phase) ? null : v;
  renderBoard();
}
function renderBoard() {
  show('board');
  const cur = stageOf(phase), view = VIEW || cur, live = view == cur;
  $('board').classList.toggle('pob', view != 'swiss');
  // Tab untuk melihat kembali babak sebelumnya / pratinjau babak berikutnya
  const tabs = phase == 'swiss' || !DE ? [] : [
    [
      'swiss',
      '\uD83D\uDCCA Grup Swiss'
    ],
    DE.wc.length ? [
      'wc',
      '\u26A1 Wildcard'
    ] : null,
    [
      'brk',
      '\uD83C\uDFC6 Playoff'
    ]
  ].filter(Boolean);
  $('tabs').innerHTML = tabs.map(([k, t]) => `<button class="tab ${ view == k ? 'on' : '' }" onclick="setView('${ k }')">${ t }${ k == cur && phase != 'done' ? ' \u2022 sekarang' : '' }</button>`).join('');
  if (live) {
    $('ph').textContent = CUR_PH;
    $('rule').textContent = CUR_RULE;
  } else {
    $('ph').textContent = view == 'swiss' ? '\uD83D\uDCCA Grup Swiss' : view == 'wc' ? '\u26A1 Wildcard' : '\uD83C\uDFC6 Playoff';
    $('rule').textContent = 'Mode lihat \u2022 tidak mengubah jalannya turnamen \u2022 tekan tab "sekarang" untuk kembali';
  }
  $('pairs').innerHTML = !live ? '' : M.map((m, i) => `<div class="pair ${ i == mi ? 'now' : '' } ${ i < mi ? 'done' : '' }">${ m.t ? '<b>Match ' + m.t.id + '</b> \u2022 ' : '' }${ esc(m[0].n) } <span style="color:var(--gold)">VS</span> ${ esc(m[1].n) }</div>`).join('') + BYE.map(bp => `<div class="pair" style="background:#9b5cf655">${ esc(bp.n) } \u2014 WO \u2705 menang otomatis</div>`).join('');
  if (view == 'swiss')
    swissBoard();
  else if (view == 'wc')
    wcBoard();
  else
    poBoard();
  P.forEach(p => p.mv = 0);
  $('go').style.display = live && M.length && phase != 'done' ? 'inline-block' : 'none';
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
  const wcSlot = P.length >= 16 ? 4 : 2;
  const resCol = `<div>${ lst(P.filter(p => p.w >= WN), 'win', '\u2705 Lolos Playoff') }${ lst(P.filter(p => p.l >= LN), 'wcg', '\u26A1 Wildcard (kesempatan kedua)') }<div style="font-size:.8em;opacity:.85;margin:-4px 0 8px">Peserta Wildcard saling adu dulu. ${ wcSlot } pemenang terakhir masuk Lower Bracket.</div><div class="plate">Hasil Swiss</div></div>`;
  $('bk').innerHTML = `<div class="bk" style="grid-template-columns:repeat(${ cols.length + 1 },1fr)">${ cols.join('') }${ resCol }</div>`;
}
// ---- Bantuan menggambar match di bagan SVG ----
const svgNm = s => s.length > 15 ? s.slice(0, 14) + '\u2026' : s;
// Keterangan slot yang belum terisi: dari match mana pemainnya datang
const srcLbl = s => s.w ? 'Pemenang Match ' + s.w.id : s.l ? 'Kalah Match ' + s.l.id : '';
function matchSVG(t, x, y) {
  const fill = t.br == 'ub' ? '#c9a24a' : t.br == 'wc' ? '#8a5cd6' : '#2a7fa8', tx = t.br == 'ub' ? '#2a1c00' : '#fff', BW = BRC.BW;
  const row = (k, src, sc) => {
    const p = res(src), yy = y + k * 24, win = t.done && t.win === p, los = t.done && t.lose === p;
    return `<g opacity="${ los ? 0.45 : 1 }"><rect x="${ x }" y="${ yy }" width="${ BW }" height="22" rx="5" fill="${ fill }"${ win ? ' stroke="#fff" stroke-width="2.5"' : '' }/>` + (p ? `<text x="${ x + 8 }" y="${ yy + 16 }" font-size="13" font-weight="800" fill="${ tx }">${ esc(svgNm(p.n)) }</text>` : `<text x="${ x + 8 }" y="${ yy + 15 }" font-size="10.5" font-weight="700" fill="${ tx }" opacity=".85">${ esc(srcLbl(src)) }</text>`) + (t.done ? `<rect x="${ x + BW - 26 }" y="${ yy }" width="26" height="22" rx="5" fill="#0007"/><text x="${ x + BW - 13 }" y="${ yy + 16 }" text-anchor="middle" font-size="13" font-weight="900" fill="#fff">${ sc }</text>` : '') + '</g>';
  };
  const rdy = M.some(m => m.t === t) && !t.done;
  return `<text x="${ x }" y="${ y - 5 }" font-size="11" font-weight="800" fill="${ fill }">MATCH ${ t.id }</text>` + (rdy ? `<rect class="${ M[mi] && M[mi].t === t ? 'hl' : '' }" x="${ x - 4 }" y="${ y - 3 }" width="${ BW + 8 }" height="52" rx="8" fill="none" stroke="#fff" stroke-width="2"/>` : '') + row(0, t.a, t.sa) + row(1, t.b, t.sb);
}

// Babak WILDCARD: peserta wildcard saling adu, pemenang terakhir (maks. 4) lolos ke Playoff (Lower Bracket)
function wcBoard() {
  const { BW, DX, BH } = BRC, X0 = 14, Y0 = 40;
  const T = DE.T.filter(t => t.br == 'wc');
  const px = t => X0 + (t.r - 1) * DX, yOf = t => Y0 + t.y;
  const sx = X0 + DE.wcCols * DX, pool = DE.lowerPool, SL = 34;
  let ln = '', bx = '', sl = '';
  T.forEach(t => [
    t.a,
    t.b
  ].forEach((src, k) => {
    const f = src.w;
    if (!f)
      return;
    ln += `<path d="M${ px(f) + BW } ${ yOf(f) + 11 }H${ px(t) - 14 }V${ yOf(t) + (k ? 35 : 11) }H${ px(t) }" fill="none" stroke="#8a5cd6" stroke-width="2" opacity="${ f.done ? 1 : 0.35 }"/>`;
  }));
  T.forEach(t => bx += matchSVG(t, px(t), yOf(t)));
  pool.forEach((src, i) => {
    const y = Y0 + i * SL, p = res(src);
    if (src.w)
      ln += `<path d="M${ px(src.w) + BW } ${ yOf(src.w) + 11 }H${ sx - 14 }V${ y + 11 }H${ sx }" fill="none" stroke="#2fbf71" stroke-width="2" opacity="${ src.w.done ? 1 : 0.35 }"/>`;
    sl += `<rect x="${ sx }" y="${ y }" width="${ BW }" height="22" rx="5" fill="#2e9b5f"/>` + (p ? `<text x="${ sx + 8 }" y="${ y + 16 }" font-size="13" font-weight="800" fill="#fff">${ esc(svgNm(p.n)) }</text>` : `<text x="${ sx + 8 }" y="${ y + 15 }" font-size="10.5" font-weight="700" fill="#fff" opacity=".85">${ esc(srcLbl(src)) }</text>`);
  });
  const ys = T.map(t => yOf(t) + BH).concat([Y0 + pool.length * SL]);
  const totalW = sx + BW + 24, totalH = Math.max(...ys) + 16;
  $('bk').innerHTML = `<svg id="brk" viewBox="0 0 ${ totalW } ${ totalH }" preserveAspectRatio="xMidYMin meet" font-family="Trebuchet MS,Segoe UI,Arial,sans-serif"><text x="${ X0 }" y="20" font-size="15" font-weight="900" letter-spacing="3" fill="#b08cff">\u26A1 WILDCARD</text><text x="${ sx }" y="20" font-size="15" font-weight="900" letter-spacing="3" fill="#4fd48c">\u2705 LOLOS PLAYOFF (${ DE.W } SLOT)</text>${ ln }${ bx }${ sl }</svg>`;
}

// Menggambar bagan ganda (DE): Upper Bracket di atas, Lower Bracket di bawah (menerima
// siswa yang kalah di Upper + pemenang Wildcard), Grand Final di kanan menyambungkan
// juara keduanya. Garis dari Upper turun ke Lower menandakan siswa yang "turun kelas".
function poBoard() {
  if (!DE) {
    $('bk').innerHTML = '';
    return;
  }
  const {BW, DX} = BRC, X0 = 26, wcc = 0, PT = DE.T.filter(t => t.br != 'wc');
  const lowY = PT.filter(t => t.br == 'lb').map(t => t.y), lbH = (lowY.length ? Math.max(...lowY) : 0) + BRC.BH;
  const nm = s => s.length > 15 ? s.slice(0, 14) + '\u2026' : s;
  const px = t => X0 + (t.r - 1) * DX;
  const UB_Y0 = 36, sepY = UB_Y0 + DE.ubHeight + 16, LB_Y0 = sepY + 54;
  const yOf = t => (t.br == 'ub' ? UB_Y0 : LB_Y0) + t.y;
  const colorOf = t => t.br == 'ub' ? '#c9a24a' : t.br == 'wc' ? '#8a5cd6' : '#2a7fa8';
  const textOf = t => t.br == 'ub' ? '#2a1c00' : '#fff';
  // Keterangan slot yang belum terisi: dari match mana pemainnya datang
  const lbl = s => s.w ? 'Pemenang Match ' + s.w.id : s.l ? 'Kalah Match ' + s.l.id : '';
  let ln = '', bx = '';
  PT.forEach(t => [
    t.a,
    t.b
  ].forEach((src, k) => {
    const f = src.w || src.l;
    if (!f || f.br == 'wc')
      return;
    const x1 = px(f) + BW, y1 = yOf(f) + 11, x2 = px(t), y2 = yOf(t) + (k ? 35 : 11), xm = x2 - 14;
    ln += `<path d="M${ x1 } ${ y1 }H${ xm }V${ y2 }H${ x2 }" fill="none" stroke="${ colorOf(t) }" stroke-width="2" opacity="${ f.done ? 1 : 0.35 }"/>`;
  }));
  PT.forEach(t => bx += matchSVG(t, px(t), yOf(t)));
  const ubFinal = DE.ub[DE.n][0], lbFinal = DE.lbFinalMatch;
  const maxX = Math.max(...PT.map(t => px(t) + BW));
  const gx = maxX + 36, gy = lbFinal ? (yOf(ubFinal) + yOf(lbFinal)) / 2 : yOf(ubFinal);
  const gfRow = (k, p, sc, isWin, wait) => {
    const yy = gy + k * 24;
    return `<g opacity="${ p && phase == 'done' && !isWin ? 0.45 : 1 }"><rect x="${ gx }" y="${ yy }" width="${ BW }" height="22" rx="5" fill="#ffd25a"${ isWin ? ' stroke="#fff" stroke-width="2.5"' : '' }/>` + (p ? `<text x="${ gx + 8 }" y="${ yy + 16 }" font-size="13" font-weight="800" fill="#2a1c00">${ esc(nm(p.n)) }</text>` : `<text x="${ gx + 8 }" y="${ yy + 15 }" font-size="10.5" font-weight="700" fill="#2a1c00" opacity=".75">${ esc(wait) }</text>`) + (sc !== undefined ? `<rect x="${ gx + BW - 26 }" y="${ yy }" width="26" height="22" rx="5" fill="#0007"/><text x="${ gx + BW - 13 }" y="${ yy + 16 }" text-anchor="middle" font-size="13" font-weight="900" fill="#fff">${ sc }</text>` : '') + '</g>';
  };
  const gfm = H.find(m => m.br == 'gf');
  const gfReady = phase == 'gf';
  const ubWait = 'Pemenang Match ' + ubFinal.id;
  const lbWait = lbFinal ? 'Pemenang Match ' + lbFinal.id : 'Juara Lower Bracket';
  const ln1 = `<path d="M${ px(ubFinal) + BW } ${ yOf(ubFinal) + 11 }H${ gx - 14 }V${ gy + 11 }H${ gx }" fill="none" stroke="#ffd25a" stroke-width="2" opacity="${ UBCHAMP ? 1 : 0.35 }"/>`;
  const ln2 = lbFinal ? `<path d="M${ px(lbFinal) + BW } ${ yOf(lbFinal) + 11 }H${ gx - 14 }V${ gy + 35 }H${ gx }" fill="none" stroke="#ffd25a" stroke-width="2" opacity="${ LBCHAMP ? 1 : 0.35 }"/>` : '';
  const gfBox = `<text x="${ gx }" y="${ gy - 5 }" font-size="11" font-weight="800" fill="#ffd25a">GRAND FINAL</text>` + (gfReady ? `<rect class="${ M[0] && M[0].br == 'gf' ? 'hl' : '' }" x="${ gx - 4 }" y="${ gy - 3 }" width="${ BW + 8 }" height="52" rx="8" fill="none" stroke="#fff" stroke-width="2"/>` : '') + gfRow(0, UBCHAMP, gfm && gfm.sa, gfm && gfm.win === UBCHAMP, ubWait) + gfRow(1, LBCHAMP, gfm && gfm.sb, gfm && gfm.win === LBCHAMP, lbWait);
  const totalW = gx + BW + 24, totalH = Math.max(LB_Y0 + lbH, gy + 60);
  const wcLabel = wcc ? `<text x="${ X0 }" y="${ sepY + 24 }" font-size="15" font-weight="900" letter-spacing="3" fill="#b08cff">\u26A1 WILDCARD</text>` : '';
  $('bk').innerHTML = `<svg id="brk" viewBox="0 0 ${ totalW } ${ totalH }" preserveAspectRatio="xMidYMin meet" font-family="Trebuchet MS,Segoe UI,Arial,sans-serif"><text x="${ X0 }" y="20" font-size="15" font-weight="900" letter-spacing="3" fill="#f5b93a">UPPER BRACKET</text><line x1="0" x2="${ totalW }" y1="${ sepY }" y2="${ sepY }" stroke="#ffffff66" stroke-dasharray="7 6"/>${ wcLabel }<text x="${ X0 + wcc * DX }" y="${ sepY + 24 }" font-size="15" font-weight="900" letter-spacing="3" fill="#4fb3d9">LOWER BRACKET</text>${ ln }${ bx }${ ln1 }${ ln2 }${ gfBox }</svg>`;
}

// =========================================================
// JALANNYA SATU DUEL (VS -> Ronde -> soal -> dorongan -> menang)
// =========================================================
function nextDuel() {
  if (DUELBUSY || !M[mi])
    return;
  DUELBUSY = true;
  const m = M[mi];
  startDuel(m[0], m[1]);
}

// Layar VS sebelum duel + pasang karakter sesuai varian siswa
const START_LIVES = 3;
const WIN_POINTS = 5;
function heartsHTML(n) {
  let s = '';
  for (let i = 0; i < START_LIVES; i++)
    s += i < n ? '\u2764\uFE0F' : '<span class="dead">\u2764\uFE0F</span>';
  return s;
}
function startDuel(a, b) {
  D = {
    a,
    b,
    sa: 0,
    sb: 0,
    pos: 0,
    n: 0,
    act: false,
    lives: [START_LIVES, START_LIVES],
    wr: [
      0,
      0
    ],
    lk: [
      0,
      0
    ]
  };
  $('lvl').innerHTML = heartsHTML(START_LIVES);
  $('lvr').innerHTML = heartsHTML(START_LIVES);
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
  $('info').textContent = 'Soal ' + D.n + ' \u2022 duluan ' + WIN_POINTS + ' poin \u2022 3 nyawa';
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
    D.lives[s]--;
    $(s ? 'lvr' : 'lvl').innerHTML = heartsHTML(D.lives[s]);
    if (D.lives[s] <= 0) {
      D.act = false;
      snd(70, 0.5, 'sawtooth');
      $('info').textContent = (s ? D.b.n : D.a.n) + ' KEHABISAN NYAWA! \uD83D\uDC80';
      setTimeout(() => {
        D.pos = s ? 1 : -1;
        endDuel(true);
      }, 900);
      return;
    }
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
  const el = $(id), pct = Math.max(0, rem) / WIN_POINTS * 100;
  el.style.width = pct + '%';
  el.classList.remove('mid', 'low');
  if (rem <= Math.ceil(WIN_POINTS * 0.2))
    el.classList.add('low');
  else if (rem <= Math.ceil(WIN_POINTS * 0.5))
    el.classList.add('mid');
}
function pips() {
  hpSet('hpl', WIN_POINTS - D.sb);
  hpSet('hpr', WIN_POINTS - D.sa);
}

// Animasi dorongan: karakter yang menjawab benar membesar & menyerang ke arah lawan.
// Jeda sekitar 2 detik sebelum lanjut — animasi karakternya sendiri yang menunjukkan
// siapa mendorong siapa, tanpa teks overlay besar.
const PUSH_PAUSE_MS = 2000;
function push(s) {
  s ? D.sb++ : D.sa++;
  D.pos = (D.sa - D.sb) / WIN_POINTS;
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
  // dir: arah menyerang. s=1 (kanan menjawab benar) -> menyerang ke kiri (negatif).
  const dir = s ? -1 : 1;
  const atkImg = s ? $('imr') : $('iml');
  const hitImg = s ? $('iml') : $('imr');
  atkImg.style.setProperty('--lunge', dir * 42 + 'px');
  atkImg.classList.remove('atk');
  void atkImg.offsetWidth;
  atkImg.classList.add('atk');
  setTimeout(() => {
    hitImg.style.setProperty('--flinch', dir * 16 + 'px');
    hitImg.style.setProperty('--rot', dir * 7 + 'deg');
    hitImg.classList.remove('hit');
    void hitImg.offsetWidth;
    hitImg.classList.add('hit');
    snd(140, 0.2, 'sawtooth');
  }, 320);
  setTimeout(() => {
    atkImg.classList.remove('atk');
    hitImg.classList.remove('hit');
  }, PUSH_PAUSE_MS);
  setTimeout(() => {
    if (D.sa >= WIN_POINTS || D.sb >= WIN_POINTS)
      endDuel();
    else
      nextQ();
  }, PUSH_PAUSE_MS);
}

// Duel selesai: lempar yang kalah keluar ring, lanjut ke ronde berikutnya.
// ko=true berarti pemenangnya ditentukan karena lawan kehabisan nyawa (bukan poin).
function endDuel(ko) {
  D.act = false;
  const w = D.pos > 0 ? D.a : D.b, l = D.pos > 0 ? D.b : D.a, loserEl = $(D.pos > 0 ? 'sr' : 'sl');
  loserEl.style.setProperty('--fx', (D.pos > 0 ? 300 : -300) + 'px');
  loserEl.style.setProperty('--fr', (D.pos > 0 ? 540 : -540) + 'deg');
  loserEl.classList.add('fly');
  snd(90, 0.6, 'sawtooth');
  flash();
  const svgR2 = document.querySelector('#duel .arena').getBoundingClientRect();
  spark(svgR2.left + svgR2.width / 2, svgR2.top + svgR2.height * 0.65, '#f5b93a', 34);
  $('info').textContent = ko ? '\uD83D\uDC80 KO! ' + w.n + ' MENANG!' : '\uD83C\uDFC5 ' + w.n + ' MENANG!';
  setTimeout(() => applyResult(w, l), 2300);
}

// Simpan hasil duel ke bagan lalu lanjut ke duel/ronde berikutnya
function applyResult(w, l) {
  DUELBUSY = false;
  const cm = M[mi];
  cm.sa = D.sa;
  cm.sb = D.sb;
  cm.win = w;
  cm.done = 1;
  if (phase == 'gf') {
    champion(w, l);
    return;
  }
  if (cm.t) {
    cm.t.win = w;
    cm.t.lose = l;
    cm.t.done = 1;
    cm.t.sa = D.sa;
    cm.t.sb = D.sb;
    l.st = cm.t.br == 'ub' ? 'lb' : 'out';
  } else
    apply(w, l);
  mi++;
  if (mi >= M.length) {
    round();
  } else
    draw();
}

// Catat hasil menang/kalah ke status peserta sesuai fase turnamen
function apply(w, l) {
  (w.opp = w.opp || []).push(l);
  (l.opp = l.opp || []).push(w);
  w.mv = l.mv = 1;
  w.w++;
  l.l++;
  if (w.w >= WN)
    w.st = 'q';
  if (l.l >= LN)
    l.st = 'wc';
}

// =========================================================
// LAYAR JUARA SINEMATIK
// =========================================================
function champion(p, r, t) {
  phase = 'done';
  M = [];
  BYE = [];
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
