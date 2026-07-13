window.pages = window.pages || {};

window.pages.renderAttendance = function() {
  const user = window.auth.currentUser;
  
  return `
    <div class="max-w-3xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      <!-- Welcome Card -->
      <div class="glass rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-6">
        <div class="flex items-center gap-4 w-full">
          <div class="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-emerald-400 flex items-center justify-center shadow-lg shadow-primary/20 shrink-0">
            <span class="text-2xl text-white font-bold">${user.name.charAt(0).toUpperCase()}</span>
          </div>
          <div class="flex-1 min-w-0">
            <h2 class="text-xl font-bold text-foreground truncate">${user.name}</h2>
            <p class="text-sm text-muted-foreground truncate">${user.unit}</p>
          </div>
          <div class="px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 text-xs font-bold shrink-0">
            Aktif
          </div>
        </div>
      </div>

      <!-- Clock & Location -->
      <div class="glass rounded-2xl p-8 text-center space-y-4">
        <div>
          <div id="att-clock" class="text-5xl md:text-6xl font-black tracking-tight text-foreground bg-clip-text text-transparent bg-gradient-to-b from-foreground to-muted-foreground">
            00:00:00
          </div>
          <div id="att-date" class="text-sm font-medium text-muted-foreground mt-2">Memuat tanggal...</div>
          <div id="att-hijri" class="text-xs font-semibold italic text-primary mt-1"></div>
        </div>
        
        <div class="h-px w-full bg-border/50"></div>
        
        <div class="flex items-center justify-center gap-2 text-xs text-muted-foreground">
          <div id="att-loc-dot" class="w-2 h-2 rounded-full bg-red-400 animate-pulse"></div>
          <span id="att-loc-text">Mendapatkan lokasi GPS...</span>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="grid grid-cols-2 gap-4">
        <button onclick="handleAbsen('Masuk')" class="flex flex-col items-center justify-center gap-3 p-6 rounded-2xl bg-gradient-to-br from-emerald-500 to-primary text-white shadow-lg shadow-primary/30 hover:shadow-primary/50 hover:-translate-y-1 transition-all active:scale-95 group">
          <div class="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center border border-white/30 group-hover:scale-110 transition-transform">
            <i data-lucide="log-in" class="w-7 h-7"></i>
          </div>
          <div class="text-center">
            <div class="font-bold text-lg">Absen Masuk</div>
            <div class="text-xs text-emerald-100">Klik saat tiba</div>
          </div>
        </button>
        
        <button onclick="handleAbsen('Pulang')" class="flex flex-col items-center justify-center gap-3 p-6 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-400 text-white shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:-translate-y-1 transition-all active:scale-95 group">
          <div class="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center border border-white/30 group-hover:scale-110 transition-transform">
            <i data-lucide="log-out" class="w-7 h-7"></i>
          </div>
          <div class="text-center">
            <div class="font-bold text-lg">Absen Pulang</div>
            <div class="text-xs text-blue-100">Klik saat pulang</div>
          </div>
        </button>
      </div>

      <button onclick="window.ui.openModal('modal-izin')" class="w-full py-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-600 font-bold hover:bg-amber-500/20 transition-colors flex items-center justify-center gap-2">
        <i data-lucide="clipboard-edit" class="w-5 h-5"></i>
        Ajukan Izin / Sakit / Pulang Awal
      </button>

      <!-- History Mini -->
      <div class="glass rounded-2xl p-6">
        <h3 class="text-xs font-bold tracking-wider text-muted-foreground uppercase mb-4">Riwayat Terakhir</h3>
        <div id="att-riwayat-list" class="space-y-3">
          <div class="text-center text-sm text-muted-foreground py-4">Memuat riwayat...</div>
        </div>
      </div>

    </div>

    <!-- Izin Modal Template is in index.html -->
  `;
};

window.pages.initAttendance = function() {
  // Clock logic
  const days = ["Minggu","Senin","Selasa","Rabu","Kamis","Jumat","Sabtu"];
  const months = ["Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember"];
  
  let clockInterval = setInterval(() => {
    if(window.router.currentRoute !== 'attendance') {
      clearInterval(clockInterval);
      return;
    }
    const now = new Date();
    document.getElementById('att-clock').textContent = [now.getHours(),now.getMinutes(),now.getSeconds()].map(x=>String(x).padStart(2,'0')).join(':');
    try {
      const mFormatter = new Intl.DateTimeFormat('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
      const hFormatter = new Intl.DateTimeFormat('id-ID-u-ca-islamic-umalqura', { day: 'numeric', month: 'long', year: 'numeric' });
      document.getElementById('att-date').textContent = mFormatter.format(now) + ' M';
      let hDate = hFormatter.format(now);
      if (hDate.endsWith('H') || hDate.endsWith('AH')) { hDate = hDate.replace(/\s*(AH|H)$/, ''); }
      document.getElementById('att-hijri').textContent = hDate + ' H';
    } catch(e) {
      document.getElementById('att-date').textContent = days[now.getDay()] + ', ' + now.getDate() + ' ' + months[now.getMonth()] + ' ' + now.getFullYear() + ' M';
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
        document.getElementById('att-loc-text').textContent = 'GPS aktif · Akurasi ' + Math.round(pos.coords.accuracy) + 'm';
        document.getElementById('att-loc-dot').classList.replace('bg-red-400', 'bg-emerald-400');
      }, 
      err => {
        document.getElementById('att-loc-text').textContent = 'GPS ditolak — aktifkan lokasi!';
        document.getElementById('att-loc-dot').classList.replace('bg-emerald-400', 'bg-red-400');
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
    
    if(!r.length) {
      el.innerHTML = '<div class="text-center text-sm text-muted-foreground py-4">Belum ada riwayat hari ini</div>';
      return;
    }
    
    el.innerHTML = r.map(x => {
      const dotColor = x.isIzin ? 'bg-amber-400' : (x.jenis.includes('Masuk') ? 'bg-primary' : 'bg-blue-400');
      const statusColor = x.isIzin ? 'text-amber-500' : (x.status === 'Tepat Waktu' ? 'text-emerald-500' : 'text-red-400');
      
      return `
        <div class="flex items-center justify-between p-3 rounded-xl bg-secondary/50 border border-border/50">
          <div class="flex items-center gap-3">
            <div class="w-2 h-2 rounded-full ${dotColor}"></div>
            <div>
              <div class="text-sm font-semibold text-foreground">${x.jenis}</div>
              <div class="text-xs text-muted-foreground">${x.waktu}</div>
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
