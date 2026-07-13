window.pages = window.pages || {};

window.pages.renderDashboard = function() {
  const user = window.auth.currentUser || { name: 'Admin', role: 'admin' };
  
  return `
    <div class="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-10">
      
      <!-- Greeting Section -->
      <div class="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h1 class="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-white/70 tracking-tight mb-2">
            Selamat Datang, ${user.name.split(' ')[0]}
          </h1>
          <p class="text-sm md:text-base text-white/60 font-medium">
            Berikut adalah ringkasan aktivitas HRMS Hidayatullah hari ini.
          </p>
        </div>
        <div class="text-right hidden md:block">
          <div class="text-xs font-bold tracking-widest text-primary uppercase mb-1">Status Sistem</div>
          <div class="flex items-center gap-2 text-sm text-white/80 bg-white/5 px-4 py-2 rounded-full border border-white/10 shadow-lg backdrop-blur-md">
            <span class="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
            Online & Sinkron
          </div>
        </div>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        <!-- Card 1: Total Pegawai -->
        <div class="bg-white/5 backdrop-blur-xl p-6 rounded-3xl border border-white/10 shadow-xl hover:-translate-y-1 hover:shadow-2xl hover:shadow-blue-500/20 hover:border-blue-500/30 transition-all duration-300 group">
          <div class="flex items-start justify-between">
            <div>
              <p class="text-[11px] font-bold tracking-widest text-white/50 uppercase mb-1">Total Pegawai</p>
              <h3 class="text-3xl font-black text-white drop-shadow-sm" id="stat-total">-</h3>
            </div>
            <div class="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/30 group-hover:scale-110 transition-transform">
              <i data-lucide="users" class="w-6 h-6 text-white"></i>
            </div>
          </div>
        </div>
        
        <!-- Card 2: Hadir Hari Ini -->
        <div class="bg-white/5 backdrop-blur-xl p-6 rounded-3xl border border-white/10 shadow-xl hover:-translate-y-1 hover:shadow-2xl hover:shadow-primary/20 hover:border-primary/30 transition-all duration-300 group">
          <div class="flex items-start justify-between">
            <div>
              <p class="text-[11px] font-bold tracking-widest text-white/50 uppercase mb-1">Hadir Hari Ini</p>
              <h3 class="text-3xl font-black text-white drop-shadow-sm" id="stat-hadir">-</h3>
            </div>
            <div class="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#84cc16] to-[#10b981] flex items-center justify-center shadow-lg shadow-primary/30 group-hover:scale-110 transition-transform">
              <i data-lucide="user-check" class="w-6 h-6 text-white"></i>
            </div>
          </div>
        </div>
        
        <!-- Card 3: Terlambat -->
        <div class="bg-white/5 backdrop-blur-xl p-6 rounded-3xl border border-white/10 shadow-xl hover:-translate-y-1 hover:shadow-2xl hover:shadow-red-500/20 hover:border-red-500/30 transition-all duration-300 group">
          <div class="flex items-start justify-between">
            <div>
              <p class="text-[11px] font-bold tracking-widest text-white/50 uppercase mb-1">Terlambat</p>
              <h3 class="text-3xl font-black text-white drop-shadow-sm" id="stat-telat">-</h3>
            </div>
            <div class="w-12 h-12 rounded-2xl bg-gradient-to-br from-red-400 to-rose-600 flex items-center justify-center shadow-lg shadow-red-500/30 group-hover:scale-110 transition-transform">
              <i data-lucide="clock" class="w-6 h-6 text-white"></i>
            </div>
          </div>
        </div>
        
        <!-- Card 4: Izin Pending -->
        <div class="bg-white/5 backdrop-blur-xl p-6 rounded-3xl border border-white/10 shadow-xl hover:-translate-y-1 hover:shadow-2xl hover:shadow-amber-500/20 hover:border-amber-500/30 transition-all duration-300 group">
          <div class="flex items-start justify-between">
            <div>
              <p class="text-[11px] font-bold tracking-widest text-white/50 uppercase mb-1">Izin Pending</p>
              <h3 class="text-3xl font-black text-white drop-shadow-sm" id="stat-izin">-</h3>
            </div>
            <div class="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/30 group-hover:scale-110 transition-transform">
              <i data-lucide="clipboard-list" class="w-6 h-6 text-white"></i>
            </div>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <!-- Live Log Table -->
        <div class="lg:col-span-2 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 flex flex-col h-[450px] shadow-2xl relative overflow-hidden">
          
          <!-- Subtle background glow -->
          <div class="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[80px] -z-10 pointer-events-none"></div>

          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 shrink-0 z-10">
            <div class="flex items-center gap-4">
              <div class="w-12 h-12 rounded-2xl bg-black/20 border border-white/10 text-white flex items-center justify-center shadow-inner">
                <div class="w-3 h-3 bg-red-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.8)]"></div>
              </div>
              <div>
                <h3 class="text-lg font-bold text-white tracking-tight">Log Absensi Live</h3>
                <p class="text-xs text-white/50">Auto-refresh tiap 30 detik</p>
              </div>
            </div>
            <button onclick="window.pages.downloadCSV()" id="btnDl" class="px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-bold rounded-xl transition-all duration-300 flex items-center gap-2 shadow-lg backdrop-blur-sm">
              <i data-lucide="download" class="w-4 h-4"></i> Ekspor CSV
            </button>
          </div>
          
          <div class="flex-1 overflow-auto rounded-2xl bg-black/20 border border-white/5 z-10">
            <table class="w-full text-sm text-left">
              <thead class="text-xs text-white/40 uppercase bg-black/40 backdrop-blur-md sticky top-0 z-20">
                <tr>
                  <th class="px-5 py-4 font-bold tracking-wider">Waktu</th>
                  <th class="px-5 py-4 font-bold tracking-wider">Nama / Unit</th>
                  <th class="px-5 py-4 font-bold tracking-wider">Jenis</th>
                  <th class="px-5 py-4 font-bold tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody id="tabelLog" class="divide-y divide-white/5">
                <tr><td colspan="4" class="text-center py-12 text-white/40 font-medium">Memuat data live...</td></tr>
              </tbody>
            </table>
          </div>
        </div>
        
        <!-- Izin Pending -->
        <div class="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 flex flex-col h-[450px] shadow-2xl relative overflow-hidden">
          
          <!-- Subtle background glow -->
          <div class="absolute bottom-0 left-0 w-64 h-64 bg-amber-500/10 rounded-full blur-[80px] -z-10 pointer-events-none"></div>

          <div class="flex items-center gap-4 mb-6 shrink-0 z-10">
            <div class="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/30 text-amber-400 flex items-center justify-center shadow-[0_0_15px_rgba(245,158,11,0.2)]">
              <i data-lucide="inbox" class="w-6 h-6"></i>
            </div>
            <div>
              <h3 class="text-lg font-bold text-white tracking-tight">Persetujuan Izin</h3>
              <p class="text-xs text-amber-400/80 font-medium" id="pendingCount">0 menunggu</p>
            </div>
          </div>
          
          <div class="flex-1 overflow-auto space-y-3 z-10 pr-2" id="tabelPending">
            <div class="text-center py-12 text-white/40 font-medium text-sm">Tidak ada pengajuan izin</div>
          </div>
        </div>

      </div>

    </div>
  `;
};

window.pages.initDashboard = function() {
  const adminEmail = window.auth.currentUser.email;

  // Render Live Log
  async function loadTableLog() {
    try {
      const d = await window.api.getTodayLogAdmin(adminEmail);
      const tb = document.getElementById('tabelLog');
      
      if(d.success === false) { 
        tb.innerHTML = '<tr><td colspan="4" class="text-center py-8 text-destructive">Gagal memuat log</td></tr>';
        return; 
      }
      if(!d.length) { 
        tb.innerHTML='<tr><td colspan="4" class="text-center py-8 text-muted-foreground">Belum ada data</td></tr>'; 
        return; 
      }
      
      let hadirCount = 0;
      let telatCount = 0;
      
      tb.innerHTML = d.map(r => {
        if(r.status === "Tepat Waktu") hadirCount++;
        if(r.status === "Terlambat") { hadirCount++; telatCount++; }
        
        const bc = (r.status === "Terlambat" || r.status === "Pulang Cepat") 
            ? "bg-red-500/20 text-red-400 border border-red-500/30 shadow-[0_0_10px_rgba(239,68,68,0.2)]" 
            : "bg-[#84cc16]/20 text-[#a3e635] border border-[#84cc16]/30 shadow-[0_0_10px_rgba(132,204,22,0.2)]";
        const jc = r.jenis === "Masuk" 
            ? "bg-white/10 text-white border border-white/20" 
            : "bg-blue-500/20 text-blue-400 border border-blue-500/30";
            
        return `
          <tr class="hover:bg-white/5 transition-colors group cursor-default">
            <td class="px-5 py-4 whitespace-nowrap text-xs text-white/60 group-hover:text-white/80 transition-colors">${r.waktu}</td>
            <td class="px-5 py-4">
              <div class="font-bold text-white group-hover:text-primary transition-colors">${r.nama}</div>
              <div class="text-xs text-white/50 truncate max-w-[150px]">${r.unit}</div>
            </td>
            <td class="px-5 py-4"><span class="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${jc}">${r.jenis}</span></td>
            <td class="px-5 py-4"><span class="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${bc}">${r.status}</span></td>
          </tr>
        `;
      }).join('');
      
      document.getElementById('stat-hadir').innerText = hadirCount;
      document.getElementById('stat-telat').innerText = telatCount;
      
    } catch(e) {
      console.error(e);
    }
  }

  // Render Pending Izin
  async function loadIzinPending() {
    try {
      const d = await window.api.getIzinPendingAdmin(adminEmail);
      const tb = document.getElementById('tabelPending');
      
      document.getElementById('pendingCount').textContent = d.length + ' menunggu';
      document.getElementById('stat-izin').innerText = d.length;
      
      if(!d.length){ 
        tb.innerHTML = '<div class="text-center py-12 text-white/40 font-medium text-sm">Tidak ada pengajuan izin</div>'; 
        return; 
      }
      
      tb.innerHTML = d.map(r => `
        <div class="bg-black/20 hover:bg-black/40 rounded-2xl p-4 border border-white/5 hover:border-white/10 transition-all duration-300 text-sm shadow-inner group">
          <div class="flex justify-between items-start mb-3">
            <div>
              <div class="font-bold text-white text-base group-hover:text-amber-400 transition-colors">${r.nama}</div>
              <div class="text-xs text-white/50">${r.waktu} • ${r.unit}</div>
            </div>
            <span class="px-2.5 py-1 rounded-lg text-[10px] font-black bg-amber-500/20 text-amber-400 uppercase tracking-widest border border-amber-500/30 shadow-[0_0_10px_rgba(245,158,11,0.2)]">${r.jenis}</span>
          </div>
          <p class="text-sm text-white/70 bg-white/5 p-3 rounded-xl mb-3 italic">"${r.ket || '-'}"</p>
          <div class="flex gap-3">
            <button onclick="window.pages.prosesIzin(${r.rowIndex}, 'Disetujui')" class="flex-1 py-2 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/30 rounded-xl text-xs font-bold transition-all hover:-translate-y-0.5 hover:shadow-[0_0_15px_rgba(16,185,129,0.3)]">Setujui</button>
            <button onclick="window.pages.prosesIzin(${r.rowIndex}, 'Ditolak')" class="flex-1 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30 rounded-xl text-xs font-bold transition-all hover:-translate-y-0.5 hover:shadow-[0_0_15px_rgba(239,68,68,0.3)]">Tolak</button>
          </div>
        </div>
      `).join('');
    } catch(e) {
      console.error(e);
    }
  }
  
  async function loadStats() {
    try {
      const p = await window.api.getPegawaiListAdmin(adminEmail);
      document.getElementById('stat-total').innerText = p.length || 0;
    } catch(e) {}
  }

  window.pages.prosesIzin = async function(rowIndex, status) {
    window.ui.showLoading("Memproses...");
    try {
      const res = await window.api.prosesIzin({ rowIndex, status, adminEmail });
      window.ui.hideLoading();
      window.ui.showToast(status === 'Disetujui' ? '✅' : '❌', res.message, status === 'Disetujui');
      loadIzinPending();
    } catch(e) {
      window.ui.hideLoading();
      window.ui.showToast('⚠️', 'Gagal memproses', false);
    }
  };
  
  window.pages.downloadCSV = async function() {
    const btn = document.getElementById('btnDl');
    const oldText = btn.innerHTML;
    btn.innerHTML = '<i data-lucide="loader-2" class="w-4 h-4 animate-spin"></i> Menyiapkan...';
    try {
      const data = await window.api.getAllLogAdmin(adminEmail);
      let csv = 'data:text/csv;charset=utf-8,' + data.map(r => r.map(c => '"'+c+'"').join(',')).join('\\r\\n');
      let a = document.createElement('a');
      a.setAttribute('href', encodeURI(csv));
      a.setAttribute('download', 'Laporan_Absensi_Hidayatullah.csv');
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch(e) {
      window.ui.showToast('⚠️', 'Gagal mengunduh CSV', false);
    } finally {
      btn.innerHTML = oldText;
      if (window.lucide) window.lucide.createIcons();
    }
  };

  loadTableLog();
  loadIzinPending();
  loadStats();
  
  let refreshInterval = setInterval(() => {
    if(window.router.currentRoute !== 'dashboard') {
      clearInterval(refreshInterval);
      return;
    }
    loadTableLog();
    loadIzinPending();
  }, 30000);
  
  if (window.lucide) window.lucide.createIcons();
};
