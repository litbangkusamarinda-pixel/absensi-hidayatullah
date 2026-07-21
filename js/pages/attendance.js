window.pages = window.pages || {};

window.pages.renderAttendance = function() {
  const user = window.auth.currentUser;
  
  return `
    <div class="absolute inset-0 bg-[#102B22] font-sans overflow-y-auto z-50">
      <div class="min-h-screen p-4 md:p-6 lg:p-8">
        <div class="max-w-md mx-auto space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
        
        <!-- Header -->
        <div class="text-center pt-6 pb-2">
          <div class="w-14 h-14 mx-auto mb-2 bg-white/5 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/10 shadow-lg">
             <img src="Logo_hidayatullah.webp" alt="Logo Hidayatullah" class="w-10 h-10 object-contain drop-shadow-md" onerror="this.outerHTML='<i data-lucide=\\'building-2\\' class=\\'w-7 h-7 text-white\\'></i>'">
          </div>
          <h1 class="text-2xl font-bold text-white mb-1 tracking-tight">Absensi <span class="text-transparent bg-clip-text bg-gradient-to-r from-[#14B88A] to-[#A3E635] drop-shadow-[0_0_10px_rgba(163,230,53,0.4)]">Digital</span></h1>
          <p class="text-xs text-white/60">Yayasan Pondok Pesantren Hidayatullah Samarinda</p>
        </div>

        <!-- User Card -->
        <div class="bg-white/5 backdrop-blur-md rounded-3xl p-4 flex items-center justify-between gap-4 border border-white/10 shadow-lg">
          <div class="flex items-center gap-4 w-full">
            <div class="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#14B88A] to-[#22c55e] flex items-center justify-center shadow-lg shrink-0">
              <i data-lucide="user" class="w-6 h-6 text-white/80"></i>
            </div>
            <div class="flex-1 min-w-0">
              <h2 class="text-lg font-bold text-white truncate">${user.name}</h2>
              <p class="text-xs text-white/70 truncate">${user.unit}</p>
            </div>
            <div class="px-4 py-1.5 rounded-full bg-[#A3E635]/10 border border-[#A3E635]/30 text-[#A3E635] shadow-[0_0_10px_rgba(163,230,53,0.2)] text-xs font-bold shrink-0">
              Aktif
            </div>
          </div>
        </div>

        <!-- Clock & Location -->
        <div class="bg-white/5 backdrop-blur-md rounded-3xl p-6 md:p-8 text-center space-y-3 border border-white/10 shadow-lg mt-2">
          <div>
            <div id="att-clock" class="text-6xl font-bold tracking-tight text-white drop-shadow-[0_0_15px_rgba(163,230,53,0.4)]">
              00:00:00
            </div>
            <div id="att-date" class="text-sm font-medium text-white/80 mt-2">Memuat tanggal...</div>
            <div id="att-hijri" class="text-sm font-bold italic text-[#14B88A] mt-1"></div>
          </div>
          
          <div class="h-px w-full bg-white/10 my-4"></div>
          
          <div class="flex items-center justify-center gap-2 text-xs text-white/60">
            <div id="att-loc-dot" class="w-2 h-2 rounded-full bg-red-400 animate-pulse"></div>
            <span id="att-loc-text">Mendapatkan lokasi GPS...</span>
          </div>
          
          <button onclick="window.refreshLocation()" class="mt-3 mx-auto px-4 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 text-xs font-medium flex items-center justify-center gap-2 transition-colors">
            <i data-lucide="refresh-cw" class="w-3 h-3"></i> Perbarui Lokasi
          </button>
        </div>

        <!-- Title PILIH JENIS ABSENSI -->
        <div class="text-center pt-4 pb-2">
          <span class="text-[10px] font-bold tracking-widest text-white/40 uppercase">Pilih Jenis Absensi</span>
        </div>

        <!-- Status & Action Buttons -->
        <div id="att-status-message" class="text-center p-6 rounded-3xl bg-white/5 border border-white/10 text-white/80 text-sm shadow-lg">
          <i data-lucide="satellite" class="w-8 h-8 mx-auto mb-3 opacity-50 animate-bounce"></i>
          <div class="font-bold">Sedang Mencari GPS...</div>
          <div class="text-xs text-white/50 mt-1">Pastikan GPS Anda aktif dan akurat</div>
        </div>

        <div id="att-action-buttons" class="grid grid-cols-2 gap-4 hidden">
          <!-- Absen Masuk -->
          <button onclick="handleAbsen('Masuk')" class="relative overflow-hidden flex flex-col items-center justify-center gap-5 p-6 rounded-3xl bg-gradient-to-tr from-[#14B88A] to-[#A3E635] text-white shadow-lg shadow-[#A3E635]/30 hover:shadow-[0_0_25px_rgba(163,230,53,0.4)] hover:scale-105 transition-all duration-300 active:scale-95 group border border-[#A3E635]/40">
            <div class="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
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

        <button id="att-btn-izin" onclick="window.ui.openModal('modal-izin')" class="w-full py-4 mt-4 rounded-2xl bg-white/5 border border-white/10 text-white/80 font-bold hover:bg-white/10 transition-colors flex items-center justify-center gap-2">
          <i data-lucide="clipboard-edit" class="w-5 h-5"></i>
          Ajukan Izin / Sakit
        </button>

        ${(user.jabatan && user.jabatan.toLowerCase().includes('kepala sekolah')) ? `
        <button onclick="window.ui.openModal('modal-persetujuan-izin'); window.pages.loadIzinPendingKepsek();" class="w-full py-4 mt-4 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold hover:opacity-90 transition-all shadow-lg flex items-center justify-center gap-2 border border-amber-400/30">
          <i data-lucide="check-circle" class="w-5 h-5"></i>
          Persetujuan Izin (Kepsek)
        </button>
        ` : ''}

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
      if (window.watchId) navigator.geolocation.clearWatch(window.watchId);
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
  window.watchId = null;
  
  window.targetLat = null;
  window.targetLon = null;
  window.maxRadius = 35; // Fallback
  
  window.gpsSamples = [];
  window.ignoredFirstGps = false;
  window.isHoliday = false;

  function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371e3;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }
  window.showHolidayMessage = function() {
    const textEl = document.getElementById('att-loc-text');
    const dotEl = document.getElementById('att-loc-dot');
    const msgEl = document.getElementById('att-status-message');
    const buttonsEl = document.getElementById('att-action-buttons');
    const btnIzin = document.getElementById('att-btn-izin');
    
    if(textEl) textEl.textContent = 'Hari Libur';
    if(dotEl) {
        dotEl.classList.remove('bg-emerald-400', 'bg-blue-400', 'bg-amber-400');
        dotEl.classList.add('bg-red-400');
    }
    if(buttonsEl) buttonsEl.classList.add('hidden');
    if(btnIzin) btnIzin.classList.add('hidden');
    if(msgEl) {
        msgEl.classList.remove('hidden');
        msgEl.innerHTML = '<i data-lucide="calendar-off" class="w-8 h-8 mx-auto mb-3 text-red-400/80"></i><div class="font-bold text-red-400">Hari Libur</div><div class="text-xs text-white/60 mt-1">Selamat menikmati Quality Time bersama keluarga tercinta. Semoga Allah melimpahkan keberkahan, kesehatan, dan kebahagiaan untuk Anda sekeluarga. 🤲</div>';
        if(window.lucide) window.lucide.createIcons();
    }
  };

  window.showBypassMessage = function(type) {
    const textEl = document.getElementById('att-loc-text');
    const dotEl = document.getElementById('att-loc-dot');
    const msgEl = document.getElementById('att-status-message');
    const buttonsEl = document.getElementById('att-action-buttons');
    const btnIzin = document.getElementById('att-btn-izin');
    
    if(textEl) textEl.textContent = 'Status: ' + type;
    if(dotEl) {
        dotEl.classList.remove('bg-emerald-400', 'bg-blue-400', 'bg-red-400');
        dotEl.classList.add('bg-amber-400');
    }
    if(buttonsEl) buttonsEl.classList.add('hidden');
    if(btnIzin) btnIzin.classList.add('hidden');
    if(msgEl) {
        msgEl.classList.remove('hidden');
        msgEl.innerHTML = `<i data-lucide="info" class="w-8 h-8 mx-auto mb-3 text-amber-400/80"></i><div class="font-bold text-amber-400">Status: ${type}</div><div class="text-xs text-white/60 mt-1">Anda saat ini tercatat sedang ${type}. Absensi lokasi dinonaktifkan hari ini.</div>`;
        if(window.lucide) window.lucide.createIcons();
    }
  };

  window.refreshLocation = function() {
    if (window.isHoliday) {
      window.showHolidayMessage();
      return;
    }
    if (window.isBypassed) {
      window.showBypassMessage(window.bypassType);
      return;
    }

    window.ui.showToast('🔄', 'Memperbarui lokasi...', true);
    window.gpsSamples = [];
    window.ignoredFirstGps = false;
    
    // Tampilkan pesan loading secara instan pada UI
    const textEl = document.getElementById('att-loc-text');
    if(textEl) textEl.textContent = 'Mendapatkan lokasi GPS...';
    
    const dotEl = document.getElementById('att-loc-dot');
    if(dotEl) dotEl.classList.replace('bg-emerald-400', 'bg-red-400');
    
    const msgEl = document.getElementById('att-status-message');
    if(msgEl) {
        msgEl.classList.remove('hidden');
        msgEl.innerHTML = '<i data-lucide="satellite" class="w-8 h-8 mx-auto mb-3 opacity-50 animate-bounce"></i><div class="font-bold">Sedang Mencari GPS...</div><div class="text-xs text-white/50 mt-1">Pastikan GPS Anda aktif dan akurat</div>';
        if(window.lucide) window.lucide.createIcons();
    }
    
    const buttonsEl = document.getElementById('att-action-buttons');
    if(buttonsEl) buttonsEl.classList.add('hidden');

    getLocation();
  };

  function getLocation() {
    if (!navigator.geolocation) { 
      window.ui.showToast('⚠️','Browser tidak mendukung GPS.',false); 
      return; 
    }
    
    if (window.watchId) navigator.geolocation.clearWatch(window.watchId);

    window.watchId = navigator.geolocation.watchPosition(
      pos => {
        // Abaikan koordinat pertama karena biasanya dari cache
        if (!window.ignoredFirstGps) {
           window.ignoredFirstGps = true;
           
           const textEl = document.getElementById('att-loc-text');
           const msgEl = document.getElementById('att-status-message');
           
           if(textEl) textEl.textContent = 'Menemukan sinyal awal...';
           if(msgEl) {
               msgEl.innerHTML = '<i data-lucide="satellite" class="w-8 h-8 mx-auto mb-3 text-blue-300 opacity-80 animate-pulse"></i><div class="font-bold text-blue-300">Sedang Mencari GPS...</div><div class="text-xs text-white/50 mt-1">Menghubungkan ke satelit terdekat...</div>';
               if(window.lucide) window.lucide.createIcons();
           }
           return;
        }

        const accuracy = Math.round(pos.coords.accuracy);
        // Memberikan kelonggaran akurasi agar tidak terjebak loop (fallback logic pindah ke backend)
        const MIN_ACCURACY = 150;

        const textEl = document.getElementById('att-loc-text');
        const dotEl = document.getElementById('att-loc-dot');
        const buttonsEl = document.getElementById('att-action-buttons');
        const msgEl = document.getElementById('att-status-message');

        // Jika koordinat target belum dapat, tunggu dulu
        if (window.targetLat === null || window.targetLon === null) return;

        // Cek akurasi terlebih dahulu
        if (accuracy > MIN_ACCURACY) {
            window.gpsSamples = []; // Reset array jika akurasi memburuk tiba-tiba
            
            if(textEl) textEl.textContent = `Akurasi ${accuracy}m · Sedang mengkalibrasi...`;
            if(dotEl) {
                dotEl.classList.remove('bg-emerald-400', 'bg-blue-400', 'bg-red-400');
                dotEl.classList.add('bg-amber-400');
            }

            if(buttonsEl) buttonsEl.classList.add('hidden');
            if(msgEl) {
                msgEl.classList.remove('hidden');
                msgEl.innerHTML = `<i data-lucide="crosshair" class="w-8 h-8 mx-auto mb-3 text-amber-400/80 animate-pulse"></i><div class="font-bold text-amber-400">Meningkatkan Akurasi GPS...</div><div class="text-xs text-white/60 mt-1">Akurasi saat ini: ${accuracy}m (Target: &le;${MIN_ACCURACY}m)</div>`;
                if(window.lucide) window.lucide.createIcons();
            }
            return;
        }

        // Kumpulkan sampel (Rolling window of 5)
        window.gpsSamples.push({lat: pos.coords.latitude, lon: pos.coords.longitude});
        if (window.gpsSamples.length > 5) {
            window.gpsSamples.shift(); // Buang yang paling lama
        }

        if (window.gpsSamples.length < 5) {
            if(textEl) textEl.textContent = `Akurasi ${accuracy}m · Mengambil sampel (${window.gpsSamples.length}/5)`;
            if(dotEl) {
                dotEl.classList.remove('bg-emerald-400', 'bg-amber-400', 'bg-red-400');
                dotEl.classList.add('bg-blue-400');
            }

            if(buttonsEl) buttonsEl.classList.add('hidden');
            if(msgEl) {
                msgEl.classList.remove('hidden');
                msgEl.innerHTML = `<i data-lucide="satellite" class="w-8 h-8 mx-auto mb-3 text-blue-400/80 animate-pulse"></i><div class="font-bold text-blue-400">Mengkalibrasi Lokasi...</div><div class="text-xs text-white/60 mt-1">Mengambil data titik koordinat ke-${window.gpsSamples.length}</div>`;
                if(window.lucide) window.lucide.createIcons();
            }
            return; // Tunggu sampai 5 sampel penuh
        }

        // Kalau sudah mencapai 5 sampel, hitung rata-rata
        let avgLat = window.gpsSamples.reduce((sum, val) => sum + val.lat, 0) / 5;
        let avgLon = window.gpsSamples.reduce((sum, val) => sum + val.lon, 0) / 5;
        
        window.userLat = avgLat; 
        window.userLon = avgLon;

        // Hitung jarak berdasarkan titik rata-rata
        const distance = Math.round(calculateDistance(window.userLat, window.userLon, window.targetLat, window.targetLon));
        
        if(textEl) textEl.textContent = `Akurasi ${accuracy}m · Jarak ${distance}m`;
        if(dotEl) {
            dotEl.classList.remove('bg-red-400', 'bg-amber-400', 'bg-blue-400');
            dotEl.classList.add('bg-emerald-400');
        }

        // Cek radius
        if (distance <= window.maxRadius) {
            if(buttonsEl) buttonsEl.classList.remove('hidden');
            if(msgEl) msgEl.classList.add('hidden');
        } else {
            if(buttonsEl) buttonsEl.classList.add('hidden');
            if(msgEl) {
                msgEl.classList.remove('hidden');
                msgEl.innerHTML = '<i data-lucide="map-pin-off" class="w-8 h-8 mx-auto mb-3 text-red-400/80"></i><div class="font-bold text-red-400">Di Luar Area Absen</div><div class="text-xs text-white/60 mt-1">Jarak Anda: ' + distance + 'm (Maks: ' + window.maxRadius + 'm)</div>';
                if(window.lucide) window.lucide.createIcons();
            }
        }
      }, 
      err => {
        const textEl = document.getElementById('att-loc-text');
        if(textEl) textEl.textContent = 'GPS error — aktifkan & izinkan lokasi!';
        const dotEl = document.getElementById('att-loc-dot');
        if(dotEl) dotEl.classList.replace('bg-emerald-400', 'bg-red-400');

        const buttonsEl = document.getElementById('att-action-buttons');
        const msgEl = document.getElementById('att-status-message');
        if(buttonsEl) buttonsEl.classList.add('hidden');
        if(msgEl) {
            msgEl.classList.remove('hidden');
            msgEl.innerHTML = '<i data-lucide="alert-circle" class="w-8 h-8 mx-auto mb-3 text-red-400/80"></i><div class="font-bold text-red-400">Gagal Membaca GPS</div><div class="text-xs text-white/60 mt-1">Pastikan izin lokasi diberikan</div>';
            if(window.lucide) window.lucide.createIcons();
        }
      }, 
      {enableHighAccuracy:true, maximumAge:0, timeout:15000}
    );
  }
  
  async function initLocationTracker() {
    try {
      const days = ["Minggu","Senin","Selasa","Rabu","Kamis","Jumat","Sabtu"];
      const currentDay = days[new Date().getDay()];
      const currentUserUnit = window.auth.currentUser.unit;
      
      try {
        const specialHours = await window.api.getJadwalHari();
        const todaySpecial = specialHours.find(h => h.unit === currentUserUnit && h.hari === currentDay);
        if (todaySpecial) {
            var liburVal = todaySpecial.libur;
            if (liburVal === true || String(liburVal).toUpperCase() === 'TRUE' || String(liburVal).toUpperCase() === 'YA') {
                window.isHoliday = true;
            }
        }
      } catch (err) {
        console.error("Gagal load jadwal khusus", err);
      }

      if (window.isHoliday) {
        window.showHolidayMessage();
        return;
      }
      
      try {
        const bypassCheck = await window.api.checkTodayBypass(window.auth.currentUser.email);
        if (bypassCheck && bypassCheck.isBypassed) {
            window.isBypassed = true;
            window.bypassType = bypassCheck.type;
            window.showBypassMessage(window.bypassType);
            return;
        }
      } catch (err) {
        console.error("Gagal load status bypass", err);
      }

      const units = await window.api.getUnitListAdmin(''); // Fetch unit data
      const myUnit = units.find(u => u.unit === currentUserUnit);
      if (myUnit) {
        window.targetLat = parseFloat(myUnit.lat);
        window.targetLon = parseFloat(myUnit.lon);
        window.maxRadius = parseFloat(myUnit.radius) || 35;
      }
      getLocation();
    } catch(e) {
      console.error("Gagal load data unit", e);
      getLocation(); // Tetap panggil walau gagal, nanti jaraknya error (NaN) tapi gps jalan
    }
  }
  initLocationTracker();

  // Absen Logic
  window.isSubmittingAbsen = false;
  window.handleAbsen = async function(jenis) {
    if (window.isSubmittingAbsen) return;

    if (window.isHoliday) {
      window.ui.showToast('⚠️', 'Hari ini libur, absen dinonaktifkan.', false);
      return;
    }
    
    if(!window.userLat) { 
      window.ui.showToast('📍','GPS belum siap. Tunggu sebentar.',false); 
      getLocation(); 
      return; 
    }
    
    window.isSubmittingAbsen = true;
    window.ui.showLoading("Memproses absensi...");
    try {
      const res = await window.api.processAttendance({
        email: window.auth.currentUser.email,
        lat: window.userLat,
        lon: window.userLon,
        jenisAbsen: jenis
      });
      window.ui.hideLoading();
      window.isSubmittingAbsen = false;
      
      // Update global toast styling if possible, or just use the default
      window.ui.showToast(res.success ? '✅' : '🚫', res.message, res.success);
      if(res.success) {
        simpanRiwayatLokal(`Absen ${jenis}`, res.message.includes('Terlambat') || res.message.includes('Cepat') ? 'Terlambat' : 'Tepat Waktu', false);
        renderRiwayatLokal();
      }
    } catch(e) {
      window.ui.hideLoading();
      window.isSubmittingAbsen = false;
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
  
  // ═══ Logic Persetujuan Kepala Sekolah ═══
  window.pages.loadIzinPendingKepsek = async function() {
    const listEl = document.getElementById('list-persetujuan-izin');
    if(!listEl) return;
    
    listEl.innerHTML = '<div class="text-center text-sm text-white/50 py-4">Memuat data...</div>';
    
    try {
      const emailKepsek = window.auth.currentUser.email;
      // Using admin API because it fetches the data. If the backend needs adjustment for Kepala Sekolah, it should be done there.
      const d = await window.api.getIzinPendingAdmin(emailKepsek); 
      
      if (!d || !d.length) { 
        listEl.innerHTML = `
          <div class="empty-state py-8 text-center">
            <i data-lucide="inbox" class="w-8 h-8 mx-auto mb-2 text-white/20"></i>
            <div class="text-xs text-white/50">Tidak ada pengajuan izin menunggu</div>
          </div>`;
        if (window.lucide) window.lucide.createIcons();
        return; 
      }
      
      listEl.innerHTML = d.map(r => `
        <div class="bg-white/5 hover:bg-white/10 rounded-2xl p-4 border border-white/10 transition-all text-sm group relative overflow-hidden">
          <div class="flex justify-between items-start mb-3">
            <div>
              <div class="font-bold text-white text-[14px]">${r.nama}</div>
              <div class="text-[11px] text-white/50">${r.waktu} • ${r.unit}</div>
            </div>
            <span class="px-2 py-1 rounded-md bg-amber-400/10 text-amber-400 text-[10px] font-bold border border-amber-400/20">${r.jenis}</span>
          </div>
          <div class="text-[12px] text-white/70 bg-black/20 p-3 rounded-xl mb-4 italic border border-white/5">"${r.ket || '-'}"</div>
          <div class="flex gap-2">
            <button onclick="window.pages.prosesIzinKepsek(${r.rowIndex}, 'Disetujui')" class="flex-1 py-2.5 bg-[#22C55E]/10 hover:bg-[#22C55E]/20 text-[#4ADE80] border border-[#22C55E]/20 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1"><i data-lucide="check" class="w-3.5 h-3.5"></i> Setujui</button>
            <button onclick="window.pages.prosesIzinKepsek(${r.rowIndex}, 'Ditolak')" class="flex-1 py-2.5 bg-[#EF4444]/10 hover:bg-[#EF4444]/20 text-[#F87171] border border-[#EF4444]/20 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1"><i data-lucide="x" class="w-3.5 h-3.5"></i> Tolak</button>
          </div>
        </div>
      `).join('');
      if (window.lucide) window.lucide.createIcons();
    } catch(e) {
      console.error(e);
      listEl.innerHTML = '<div class="text-center text-sm text-red-400 py-4">Gagal memuat data</div>';
    }
  };

  window.pages.prosesIzinKepsek = async function(rowIndex, status) {
    if (!confirm(`Apakah Anda yakin ingin memberikan status "${status}" pada pengajuan ini?`)) return;
    
    window.ui.showLoading("Memproses...");
    try {
      const payload = { rowIndex, status, adminEmail: window.auth.currentUser.email };
      const res = await window.api.prosesIzin(payload);
      window.ui.hideLoading();
      window.ui.showToast(res.success ? '✅' : '⚠️', res.message, res.success);
      
      if(res.success) {
        window.pages.loadIzinPendingKepsek();
      }
    } catch(e) {
      window.ui.hideLoading();
      window.ui.showToast('❌', e.message, false);
    }
  };

  if (window.lucide) window.lucide.createIcons();
};

