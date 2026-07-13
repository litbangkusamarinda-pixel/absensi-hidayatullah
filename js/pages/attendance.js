window.pages = window.pages || {};

window.pages.renderAttendance = function() {
  const user = window.auth.currentUser;
  
  return `
    <div class="absolute inset-0 bg-[#0a3d2e] font-sans overflow-y-auto z-50">
      <div class="min-h-screen p-4 md:p-6 lg:p-8">
        <div class="max-w-md mx-auto space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
        
        <!-- Header -->
        <div class="text-center pt-6 pb-2">
          <div class="w-14 h-14 mx-auto mb-2 bg-white/5 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/10 shadow-lg">
             <img src="icon.png" alt="Logo Hidayatullah" class="w-10 h-10 object-contain drop-shadow-md" onerror="this.outerHTML='<i data-lucide=\\'building-2\\' class=\\'w-7 h-7 text-white\\'></i>'">
          </div>
          <h1 class="text-2xl font-bold text-white mb-1 tracking-tight">Absensi <span class="text-[#a3e635]">Digital</span></h1>
          <p class="text-xs text-white/60">Yayasan Pondok Pesantren Hidayatullah Samarinda</p>
        </div>

        <!-- User Card -->
        <div class="bg-white/5 backdrop-blur-md rounded-3xl p-4 flex items-center justify-between gap-4 border border-white/10 shadow-lg">
          <div class="flex items-center gap-4 w-full">
            <div class="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#84cc16] to-[#22c55e] flex items-center justify-center shadow-lg shrink-0">
              <i data-lucide="user" class="w-6 h-6 text-white/80"></i>
            </div>
            <div class="flex-1 min-w-0">
              <h2 class="text-lg font-bold text-white truncate">${user.name}</h2>
              <p class="text-xs text-white/70 truncate">${user.unit}</p>
            </div>
            <div class="px-4 py-1.5 rounded-full bg-[#84cc16]/20 border border-[#84cc16]/30 text-[#a3e635] text-xs font-bold shrink-0">
              Aktif
            </div>
          </div>
        </div>

        <!-- Clock & Location -->
        <div class="bg-white/5 backdrop-blur-md rounded-3xl p-6 md:p-8 text-center space-y-3 border border-white/10 shadow-lg mt-2">
          <div>
            <div id="att-clock" class="text-6xl font-bold tracking-tight text-white drop-shadow-md">
              00:00:00
            </div>
            <div id="att-date" class="text-sm font-medium text-white/80 mt-2">Memuat tanggal...</div>
            <div id="att-hijri" class="text-sm font-bold italic text-[#a3e635] mt-1"></div>
          </div>
          
          <div class="h-px w-full bg-white/10 my-4"></div>
          
          <div class="flex items-center justify-center gap-2 text-xs text-white/60">
            <div id="att-loc-dot" class="w-2 h-2 rounded-full bg-red-400 animate-pulse"></div>
            <span id="att-loc-text">Mendapatkan lokasi GPS...</span>
          </div>
        </div>

        <!-- Title PILIH JENIS ABSENSI -->
        <div class="text-center pt-4 pb-2">
          <span class="text-[10px] font-bold tracking-widest text-white/40 uppercase">Pilih Jenis Absensi</span>
        </div>

        <!-- Action Buttons -->
        <div class="grid grid-cols-2 gap-4">
          <!-- Absen Masuk -->
          <button onclick="handleAbsen('Masuk')" class="flex flex-col items-center justify-center gap-5 p-6 rounded-3xl bg-gradient-to-tr from-[#84cc16] to-[#10b981] text-white shadow-lg shadow-[#84cc16]/30 hover:scale-105 transition-transform active:scale-95 group border border-[#84cc16]/20">
            <div class="relative w-14 h-14 flex items-center justify-center mt-2">
              <div class="absolute inset-0 rounded-full border border-white/20 scale-[1.3] transition-transform group-hover:scale-[1.4]"></div>
              <div class="absolute inset-0 rounded-full border border-white/10 scale-[1.6] transition-transform group-hover:scale-[1.7]"></div>
              <div class="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm z-10 border border-white/30">
                 <i data-lucide="log-in" class="w-6 h-6"></i>
              </div>
            </div>
            <div class="text-center mb-1">
              <div class="font-bold text-[15px]">Absen Masuk</div>
              <div class="text-[11px] text-white/80 mt-1">Klik saat tiba</div>
            </div>
          </button>
          
          <!-- Absen Pulang -->
          <button onclick="handleAbsen('Pulang')" class="flex flex-col items-center justify-center gap-5 p-6 rounded-3xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-900/30 hover:scale-105 transition-transform active:scale-95 group border border-blue-400/20">
            <div class="relative w-14 h-14 flex items-center justify-center mt-2">
              <div class="absolute inset-0 rounded-full border border-white/20 scale-[1.3] transition-transform group-hover:scale-[1.4]"></div>
              <div class="absolute inset-0 rounded-full border border-white/10 scale-[1.6] transition-transform group-hover:scale-[1.7]"></div>
              <div class="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm z-10 border border-white/30">
                 <i data-lucide="log-out" class="w-6 h-6"></i>
              </div>
            </div>
            <div class="text-center mb-1">
              <div class="font-bold text-[15px]">Absen Pulang</div>
              <div class="text-[11px] text-white/80 mt-1">Klik saat pulang</div>
            </div>
          </button>
        </div>

        <button onclick="window.ui.openModal('modal-izin')" class="w-full py-4 mt-4 rounded-2xl bg-white/5 border border-white/10 text-white/80 font-bold hover:bg-white/10 transition-colors flex items-center justify-center gap-2">
          <i data-lucide="clipboard-edit" class="w-5 h-5"></i>
          Ajukan Izin / Sakit
        </button>

        <!-- History Mini -->
        <div class="bg-white/5 backdrop-blur-md rounded-3xl p-6 border border-white/10 mt-4 mb-8">
          <h3 class="text-[10px] font-bold tracking-widest text-white/40 uppercase mb-4">Riwayat Terakhir</h3>
          <div id="att-riwayat-list" class="space-y-3">
            <div class="text-center text-sm text-white/50 py-4">Memuat riwayat...</div>
          </div>
        </div>

      </div>
      </div>
    </div>
  `;
};

window.pages.initAttendance = function() {
  // Clock logic
  const days = ["Minggu","Senin","Selasa","Rabu","Kamis","Jumat","Sabtu"];
  const months = ["Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember"];
  
  let clockInterval = setInterval(() => {
    if(window.router && window.router.currentRoute !== 'attendance') {
      clearInterval(clockInterval);
      return;
    }
    const now = new Date();
    const clockEl = document.getElementById('att-clock');
    if(clockEl) {
       clockEl.textContent = [now.getHours(),now.getMinutes(),now.getSeconds()].map(x=>String(x).padStart(2,'0')).join(':');
    }
    try {
      const mFormatter = new Intl.DateTimeFormat('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
      const hFormatter = new Intl.DateTimeFormat('id-ID-u-ca-islamic-umalqura', { day: 'numeric', month: 'long', year: 'numeric' });
      const dateEl = document.getElementById('att-date');
      if(dateEl) dateEl.textContent = mFormatter.format(now) + ' M';
      
      let hDate = hFormatter.format(now);
      if (hDate.endsWith('H') || hDate.endsWith('AH')) { hDate = hDate.replace(/\s*(AH|H)$/, ''); }
      const hijriEl = document.getElementById('att-hijri');
      if(hijriEl) hijriEl.textContent = hDate + ' H';
    } catch(e) {
      const dateEl = document.getElementById('att-date');
      if(dateEl) dateEl.textContent = days[now.getDay()] + ', ' + now.getDate() + ' ' + months[now.getMonth()] + ' ' + now.getFullYear() + ' M';
    }
  }, 1000);

  // GPS Location
  window.userLat = null;
  window.userLon = null;
  
  function getLocation() {
    if (!navigator.geolocation) { 
      window.ui.showToast('⚠️','Browser tidak mendukung GPS.',false); 
      return; 
    }
    navigator.geolocation.getCurrentPosition(
      pos => {
        window.userLat = pos.coords.latitude; 
        window.userLon = pos.coords.longitude;
        const textEl = document.getElementById('att-loc-text');
        if(textEl) textEl.textContent = 'GPS aktif · Akurasi ' + Math.round(pos.coords.accuracy) + 'm';
        const dotEl = document.getElementById('att-loc-dot');
        if(dotEl) dotEl.classList.replace('bg-red-400', 'bg-emerald-400');
      }, 
      err => {
        const textEl = document.getElementById('att-loc-text');
        if(textEl) textEl.textContent = 'GPS ditolak — aktifkan lokasi!';
        const dotEl = document.getElementById('att-loc-dot');
        if(dotEl) dotEl.classList.replace('bg-emerald-400', 'bg-red-400');
      }, 
      {enableHighAccuracy:true, maximumAge:0, timeout:15000}
    );
  }
  getLocation();

  // Absen Logic
  window.handleAbsen = async function(jenis) {
    if(!window.userLat) { 
      window.ui.showToast('📍','GPS belum siap. Tunggu sebentar.',false); 
      getLocation(); 
      return; 
    }
    window.ui.showLoading("Memproses absensi...");
    try {
      const res = await window.api.processAttendance({
        email: window.auth.currentUser.email,
        lat: window.userLat,
        lon: window.userLon,
        jenisAbsen: jenis
      });
      window.ui.hideLoading();
      
      // Update global toast styling if possible, or just use the default
      window.ui.showToast(res.success ? '✅' : '🚫', res.message, res.success);
      if(res.success) {
        simpanRiwayatLokal(`Absen ${jenis}`, res.message.includes('Terlambat') || res.message.includes('Cepat') ? 'Terlambat' : 'Tepat Waktu', false);
        renderRiwayatLokal();
      }
    } catch(e) {
      window.ui.hideLoading();
      window.ui.showToast('⚠️','Kesalahan koneksi.',false);
    }
  };

  // Local History Management
  function simpanRiwayatLokal(jenis, status, isIzin) {
    const email = window.auth.currentUser.email;
    let r = JSON.parse(localStorage.getItem('rv_'+email) || '[]');
    const now = new Date();
    r.unshift({
      jenis, 
      status, 
      waktu: now.toLocaleDateString('id-ID')+' '+now.toLocaleTimeString('id-ID',{hour:'2-digit',minute:'2-digit'}), 
      isIzin
    });
    localStorage.setItem('rv_'+email, JSON.stringify(r.slice(0, 5))); // Keep last 5
  }

  function renderRiwayatLokal() {
    const email = window.auth.currentUser.email;
    const r = JSON.parse(localStorage.getItem('rv_'+email) || '[]');
    const el = document.getElementById('att-riwayat-list');
    if(!el) return;
    
    if(!r.length) {
      el.innerHTML = '<div class="text-center text-sm text-white/50 py-4">Belum ada riwayat hari ini</div>';
      return;
    }
    
    el.innerHTML = r.map(x => {
      const dotColor = x.isIzin ? 'bg-amber-400' : (x.jenis.includes('Masuk') ? 'bg-emerald-400' : 'bg-blue-400');
      const statusColor = x.isIzin ? 'text-amber-400' : (x.status === 'Tepat Waktu' ? 'text-emerald-400' : 'text-red-400');
      
      return `
        <div class="flex items-center justify-between p-3 rounded-2xl bg-white/5 border border-white/10">
          <div class="flex items-center gap-3">
            <div class="w-2 h-2 rounded-full ${dotColor}"></div>
            <div>
              <div class="text-sm font-semibold text-white">${x.jenis}</div>
              <div class="text-[11px] text-white/60">${x.waktu}</div>
            </div>
          </div>
          <div class="text-xs font-bold ${statusColor}">${x.status}</div>
        </div>
      `;
    }).join('');
  }
  
  renderRiwayatLokal();
  
  if (window.lucide) window.lucide.createIcons();
};

