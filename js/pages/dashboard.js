window.pages = window.pages || {};

window.pages.renderDashboard = function() {
  return `
    <div class="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div class="glass p-5 rounded-2xl flex items-center gap-4">
          <div class="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center shrink-0">
            <i data-lucide="users" class="w-6 h-6"></i>
          </div>
          <div>
            <p class="text-sm text-muted-foreground font-medium">Total Pegawai</p>
            <h3 class="text-2xl font-bold text-foreground" id="stat-total">-</h3>
          </div>
        </div>
        
        <div class="glass p-5 rounded-2xl flex items-center gap-4">
          <div class="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
            <i data-lucide="user-check" class="w-6 h-6"></i>
          </div>
          <div>
            <p class="text-sm text-muted-foreground font-medium">Hadir Hari Ini</p>
            <h3 class="text-2xl font-bold text-foreground" id="stat-hadir">-</h3>
          </div>
        </div>
        
        <div class="glass p-5 rounded-2xl flex items-center gap-4">
          <div class="w-12 h-12 rounded-xl bg-red-500/10 text-red-600 flex items-center justify-center shrink-0">
            <i data-lucide="clock" class="w-6 h-6"></i>
          </div>
          <div>
            <p class="text-sm text-muted-foreground font-medium">Terlambat</p>
            <h3 class="text-2xl font-bold text-foreground" id="stat-telat">-</h3>
          </div>
        </div>
        
        <div class="glass p-5 rounded-2xl flex items-center gap-4">
          <div class="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0">
            <i data-lucide="clipboard-list" class="w-6 h-6"></i>
          </div>
          <div>
            <p class="text-sm text-muted-foreground font-medium">Izin Pending</p>
            <h3 class="text-2xl font-bold text-foreground" id="stat-izin">-</h3>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <!-- Live Log Table -->
        <div class="lg:col-span-2 glass rounded-2xl p-6 flex flex-col h-[400px]">
          <div class="flex items-center justify-between mb-4 shrink-0">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-xl bg-red-500/10 text-red-500 flex items-center justify-center">
                <div class="w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse"></div>
              </div>
              <div>
                <h3 class="font-bold text-foreground">Log Absensi Live</h3>
                <p class="text-xs text-muted-foreground">Auto-refresh tiap 30 detik</p>
              </div>
            </div>
            <button onclick="window.pages.downloadCSV()" id="btnDl" class="px-3 py-1.5 bg-primary text-primary-foreground text-xs font-medium rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2">
              <i data-lucide="download" class="w-4 h-4"></i> Ekspor CSV
            </button>
          </div>
          
          <div class="flex-1 overflow-auto rounded-xl border border-border/50 bg-background/50">
            <table class="w-full text-sm text-left">
              <thead class="text-xs text-muted-foreground uppercase bg-secondary/50 sticky top-0 z-10">
                <tr>
                  <th class="px-4 py-3 font-medium">Waktu</th>
                  <th class="px-4 py-3 font-medium">Nama / Unit</th>
                  <th class="px-4 py-3 font-medium">Jenis</th>
                  <th class="px-4 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody id="tabelLog" class="divide-y divide-border/50">
                <tr><td colspan="4" class="text-center py-8 text-muted-foreground">Memuat data...</td></tr>
              </tbody>
            </table>
          </div>
        </div>
        
        <!-- Izin Pending -->
        <div class="glass rounded-2xl p-6 flex flex-col h-[400px]">
          <div class="flex items-center gap-3 mb-4 shrink-0">
            <div class="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
              <i data-lucide="inbox" class="w-5 h-5"></i>
            </div>
            <div>
              <h3 class="font-bold text-foreground">Menunggu Persetujuan</h3>
              <p class="text-xs text-muted-foreground" id="pendingCount">0 pengajuan</p>
            </div>
          </div>
          
          <div class="flex-1 overflow-auto space-y-3" id="tabelPending">
            <div class="text-center py-8 text-muted-foreground text-sm">Memuat data...</div>
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
            ? "bg-red-500/10 text-red-600 border border-red-500/20" 
            : "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20";
        const jc = r.jenis === "Masuk" 
            ? "bg-primary/10 text-primary border border-primary/20" 
            : "bg-blue-500/10 text-blue-600 border border-blue-500/20";
            
        return `
          <tr class="hover:bg-secondary/30 transition-colors">
            <td class="px-4 py-3 whitespace-nowrap text-xs text-muted-foreground">${r.waktu}</td>
            <td class="px-4 py-3">
              <div class="font-medium text-foreground">${r.nama}</div>
              <div class="text-xs text-muted-foreground truncate max-w-[120px]">${r.unit}</div>
            </td>
            <td class="px-4 py-3"><span class="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${jc}">${r.jenis}</span></td>
            <td class="px-4 py-3"><span class="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${bc}">${r.status}</span></td>
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
      
      document.getElementById('pendingCount').textContent = d.length + ' pengajuan';
      document.getElementById('stat-izin').innerText = d.length;
      
      if(!d.length){ 
        tb.innerHTML = '<div class="text-center py-8 text-muted-foreground text-sm">Tidak ada pengajuan</div>'; 
        return; 
      }
      
      tb.innerHTML = d.map(r => `
        <div class="bg-secondary/50 rounded-xl p-3 border border-border/50 text-sm">
          <div class="flex justify-between items-start mb-2">
            <div>
              <div class="font-bold text-foreground">${r.nama}</div>
              <div class="text-xs text-muted-foreground">${r.waktu} • ${r.unit}</div>
            </div>
            <span class="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-500/10 text-amber-600 uppercase tracking-wider border border-amber-500/20">${r.jenis}</span>
          </div>
          <p class="text-xs text-muted-foreground bg-background/50 p-2 rounded-lg mb-2">${r.ket || '-'}</p>
          <div class="flex gap-2">
            <button onclick="window.pages.prosesIzin(${r.rowIndex}, 'Disetujui')" class="flex-1 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 border border-emerald-500/20 rounded-lg text-xs font-bold transition-colors">Terima</button>
            <button onclick="window.pages.prosesIzin(${r.rowIndex}, 'Ditolak')" class="flex-1 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-600 border border-red-500/20 rounded-lg text-xs font-bold transition-colors">Tolak</button>
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
