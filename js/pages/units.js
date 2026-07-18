/**
 * ═══════════════════════════════════════════════════════════
 * HRMS HIDAYATULLAH — Unit Management
 * Manage school units, locations, schedules
 * ═══════════════════════════════════════════════════════════
 */

window.pages = window.pages || {};

window.pages.renderUnits = function() {
  return `
    <div class="space-y-6 pb-10 animate-fade-in-up">
      
      <!-- Header -->
      <div class="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <p class="text-xs font-bold tracking-widest text-[#14B88A] uppercase mb-1">Administration</p>
          <h1 class="text-2xl md:text-3xl font-extrabold text-white tracking-tight">Manajemen Unit</h1>
          <p class="text-sm text-white/40 mt-1">Kelola unit sekolah, lokasi GPS, dan jadwal jam kerja</p>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-5 gap-4">
        
        <!-- Map & Add Form -->
        <div class="lg:col-span-2 glass-card p-5 space-y-4">
          <div class="flex items-center gap-3 mb-2">
            <div class="w-10 h-10 rounded-xl bg-[#14B88A]/15 border border-[#14B88A]/20 flex items-center justify-center">
              <i data-lucide="map-pin" class="w-5 h-5 text-[#14B88A]"></i>
            </div>
            <div>
              <h3 class="text-sm font-bold text-white">Tambah Unit Sekolah</h3>
              <p class="text-[10px] text-white/30">Klik peta untuk titik lokasi</p>
            </div>
          </div>
          
          <!-- Map Container -->
          <div id="unit-map" class="w-full rounded-xl border border-white/[0.06] overflow-hidden" style="height:240px; background:rgba(0,0,0,0.3);">
            <div class="flex items-center justify-center h-full text-white/20 text-xs">
              <i data-lucide="map" class="w-8 h-8 mr-2 opacity-30"></i> Peta dimuat...
            </div>
          </div>
          
          <!-- Form Fields -->
          <div class="grid grid-cols-2 gap-3">
            <div class="col-span-2">
              <label class="block text-[10px] font-bold tracking-widest text-white/30 uppercase mb-1">Nama Unit</label>
              <input type="text" id="unit" placeholder="SD Hidayatullah" class="hrms-input text-sm">
            </div>
            <div>
              <label class="block text-[10px] font-bold tracking-widest text-white/30 uppercase mb-1">Jam Masuk</label>
              <input type="time" id="masuk" value="07:00" class="hrms-input text-sm">
            </div>
            <div>
              <label class="block text-[10px] font-bold tracking-widest text-white/30 uppercase mb-1">Jam Pulang</label>
              <input type="time" id="pulang" value="15:00" class="hrms-input text-sm">
            </div>
            <div>
              <label class="block text-[10px] font-bold tracking-widest text-white/30 uppercase mb-1">Radius (M)</label>
              <input type="number" id="radius" value="100" class="hrms-input text-sm">
            </div>
            <div>
              <label class="block text-[10px] font-bold tracking-widest text-white/30 uppercase mb-1">WA Kepala Unit</label>
              <input type="text" id="waKepala" placeholder="08123456789" class="hrms-input text-sm">
            </div>
            <div>
              <label class="block text-[10px] font-bold tracking-widest text-white/30 uppercase mb-1">Latitude</label>
              <input type="text" id="lat" readonly class="hrms-input text-sm bg-white/[0.02] cursor-not-allowed">
            </div>
            <div>
              <label class="block text-[10px] font-bold tracking-widest text-white/30 uppercase mb-1">Longitude</label>
              <input type="text" id="lon" readonly class="hrms-input text-sm bg-white/[0.02] cursor-not-allowed">
            </div>
          </div>
          
          <button onclick="window.pages.simpanUnit()" id="btnSimpan" class="btn-primary w-full py-3 text-sm">
            <i data-lucide="save" class="w-4 h-4"></i> Simpan Unit Sekolah
          </button>
        </div>

        <!-- Unit List -->
        <div class="lg:col-span-3 space-y-4">
          <!-- Unit Table -->
          <div class="glass-card p-5">
            <div class="flex items-center gap-3 mb-4">
              <div class="w-10 h-10 rounded-xl bg-[#3B82F6]/15 border border-[#3B82F6]/20 flex items-center justify-center">
                <i data-lucide="building-2" class="w-5 h-5 text-[#60A5FA]"></i>
              </div>
              <div>
                <h3 class="text-sm font-bold text-white">Daftar Unit Aktif</h3>
                <p class="text-[10px] text-white/30" id="unit-count">Memuat...</p>
              </div>
            </div>
            <div class="overflow-x-auto" style="max-height:300px;">
              <table class="hrms-table" id="tabelUnit">
                <thead>
                  <tr><th>Unit</th><th>Masuk</th><th>Pulang</th><th>Koordinat</th><th>Radius</th><th>WA Kepala</th></tr>
                </thead>
                <tbody>
                  <tr><td colspan="6" class="text-center py-8 text-white/30 text-xs">Memuat...</td></tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Registered Employees -->
          <div class="glass-card p-5">
            <div class="flex items-center gap-3 mb-4">
              <div class="w-10 h-10 rounded-xl bg-[#8B5CF6]/15 border border-[#8B5CF6]/20 flex items-center justify-center">
                <i data-lucide="users" class="w-5 h-5 text-[#A78BFA]"></i>
              </div>
              <div>
                <h3 class="text-sm font-bold text-white">Guru & Karyawan Terdaftar</h3>
                <p class="text-[10px] text-white/30" id="pegawai-count">Memuat...</p>
              </div>
            </div>
            <div class="overflow-x-auto" style="max-height:300px;">
              <table class="hrms-table" id="tabelPegawai">
                <thead>
                  <tr><th>Nama</th><th>Email</th><th>Unit</th><th>Tgl Daftar</th></tr>
                </thead>
                <tbody>
                  <tr><td colspan="4" class="text-center py-8 text-white/30 text-xs">Memuat...</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>
    </div>
  `;
};

window.pages.initUnits = function() {
  const adminEmail = window.auth.currentUser.email;

  // ═══ Load Leaflet Map ═══
  function initMap() {
    // Check if Leaflet is loaded
    if (typeof L === 'undefined') {
      // Load Leaflet CSS and JS
      const css = document.createElement('link');
      css.rel = 'stylesheet';
      css.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(css);
      
      const script = document.createElement('script');
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      script.onload = () => setupMap();
      document.body.appendChild(script);
    } else {
      setupMap();
    }
  }

  function setupMap() {
    const mapEl = document.getElementById('unit-map');
    if (!mapEl || !window.L) return;
    
    mapEl.innerHTML = '';
    const map = L.map('unit-map').setView([-0.5, 117.1], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '&copy; OSM' }).addTo(map);
    
    let marker;
    map.on('click', function(e) {
      const la = e.latlng.lat.toFixed(6);
      const lo = e.latlng.lng.toFixed(6);
      if (marker) map.removeLayer(marker);
      marker = L.marker([la, lo]).addTo(map);
      document.getElementById('lat').value = la;
      document.getElementById('lon').value = lo;
    });
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(p) {
        map.setView([p.coords.latitude, p.coords.longitude], 16);
      });
    }
    
    window._unitMap = map;
    window._unitMarker = marker;
  }

  // ═══ Load Unit Table ═══
  async function loadTableUnit() {
    try {
      const d = await window.api.getUnitListAdmin(adminEmail);
      const tb = document.querySelector('#tabelUnit tbody');
      const countEl = document.getElementById('unit-count');
      if (!tb) return;
      
      if (countEl) countEl.textContent = d.length + ' unit terdaftar';
      
      if (!d.length) {
        tb.innerHTML = '<tr><td colspan="6" class="text-center py-8 text-white/30 text-xs">Belum ada unit</td></tr>';
        return;
      }
      tb.innerHTML = d.map(r => `
        <tr>
          <td class="font-semibold text-white">${r.unit}</td>
          <td class="text-xs">${r.masuk}</td>
          <td class="text-xs">${r.pulang}</td>
          <td class="text-[10px] text-white/30">${r.lat}, ${r.lon}</td>
          <td><span class="badge badge-primary">${r.radius}M</span></td>
          <td class="text-xs text-white/40">${r.waKepala || '-'}</td>
        </tr>
      `).join('');
    } catch(e) {}
  }

  // ═══ Load Pegawai Table ═══
  async function loadTablePegawai() {
    try {
      const d = await window.api.getPegawaiListAdmin(adminEmail);
      const tb = document.querySelector('#tabelPegawai tbody');
      const countEl = document.getElementById('pegawai-count');
      if (!tb) return;

      if (countEl) countEl.textContent = d.length + ' orang terdaftar';

      if (!d.length) {
        tb.innerHTML = '<tr><td colspan="4" class="text-center py-8 text-white/30 text-xs">Belum ada data</td></tr>';
        return;
      }
      tb.innerHTML = d.map(r => `
        <tr>
          <td>
            <div class="flex items-center gap-2">
              <div class="w-7 h-7 rounded-lg bg-gradient-to-br from-[#14B88A] to-[#0D9B73] flex items-center justify-center text-white text-[10px] font-bold shrink-0">${r.nama.charAt(0)}</div>
              <span class="font-semibold text-white text-xs">${r.nama}</span>
            </div>
          </td>
          <td class="text-xs text-white/40">${r.email}</td>
          <td><span class="badge badge-primary text-[8px]">${r.unit}</span></td>
          <td class="text-xs text-white/30">${r.tgl}</td>
        </tr>
      `).join('');
    } catch(e) {}
  }

  // ═══ Save Unit ═══
  window.pages.simpanUnit = async function() {
    const d = {
      unit: document.getElementById('unit').value,
      masuk: document.getElementById('masuk').value,
      pulang: document.getElementById('pulang').value,
      radius: document.getElementById('radius').value,
      waKepala: document.getElementById('waKepala').value,
      lat: document.getElementById('lat').value,
      lon: document.getElementById('lon').value
    };
    if (!d.unit || !d.lat) {
      window.ui.showToast('⚠️', 'Nama Unit dan titik Peta wajib diisi!', false);
      return;
    }
    const btn = document.getElementById('btnSimpan');
    btn.innerHTML = '<i data-lucide="loader-2" class="w-4 h-4 animate-spin"></i> Menyimpan...';
    try {
      const res = await window.api.saveUnitAdmin({ adminEmail, unitData: d });
      window.ui.showToast('✅', res.message, true);
      loadTableUnit();
      document.getElementById('unit').value = '';
    } catch(e) {
      window.ui.showToast('⚠️', 'Gagal menyimpan unit', false);
    } finally {
      btn.innerHTML = '<i data-lucide="save" class="w-4 h-4"></i> Simpan Unit Sekolah';
      if (window.lucide) window.lucide.createIcons();
    }
  };

  // Init
  initMap();
  loadTableUnit();
  loadTablePegawai();
  if (window.lucide) window.lucide.createIcons();
};
