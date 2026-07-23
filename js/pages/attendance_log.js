/**
 * ═══════════════════════════════════════════════════════════
 * HRMS HIDAYATULLAH — Attendance Log Page (Log Absen Guru)
 * ═══════════════════════════════════════════════════════════
 */

window.pages = window.pages || {};

window.pages.renderAttendanceLog = function() {
  return `
    <div class="space-y-6 pb-12">
      
      <!-- Top Banner / Header -->
      <div class="bg-gradient-to-r from-[#102B22] via-[#0F2A1F] to-[#132F24] p-6 rounded-3xl border border-white/10 shadow-xl relative overflow-hidden">
        <div class="absolute -right-10 -bottom-10 w-48 h-48 bg-[#14B88A]/10 rounded-full blur-3xl"></div>
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#14B88A]/10 border border-[#14B88A]/20 text-[#14B88A] text-xs font-semibold mb-2">
              <i data-lucide="scan-line" class="w-3.5 h-3.5"></i> Live Monitoring
            </div>
            <h1 class="text-2xl font-extrabold text-white tracking-tight">Log Absensi Guru</h1>
            <p class="text-xs text-white/50 mt-1">Pantau seluruh riwayat & catatan kehadiran guru secara berkala</p>
          </div>

          <div class="flex flex-wrap items-center gap-3">
            <button onclick="window.pages.openManualAttendanceModal()" class="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold transition-all shadow-lg shadow-amber-500/20 flex items-center gap-2">
              <i data-lucide="user-plus" class="w-4 h-4"></i> ➕ Absen Manual (HP Rusak)
            </button>
            <button onclick="window.pages.initAttendanceLog()" class="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/80 hover:text-white text-xs font-semibold border border-white/10 transition-all flex items-center gap-2">
              <i data-lucide="refresh-cw" class="w-4 h-4"></i> Refresh Data
            </button>
            <button onclick="window.pages.exportAttendanceLogCSV()" class="px-4 py-2.5 rounded-xl bg-[#14B88A] hover:bg-[#10A078] text-white text-xs font-bold transition-all shadow-lg shadow-[#14B88A]/20 flex items-center gap-2">
              <i data-lucide="download" class="w-4 h-4"></i> Ekspor CSV
            </button>
          </div>
        </div>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div class="bg-white/5 backdrop-blur-xl p-5 rounded-2xl border border-white/10 flex items-center gap-4">
          <div class="w-12 h-12 rounded-xl bg-[#14B88A]/20 text-[#14B88A] flex items-center justify-center shrink-0">
            <i data-lucide="users" class="w-6 h-6"></i>
          </div>
          <div>
            <div class="text-[11px] font-medium text-white/50 uppercase tracking-wider">Total Absen</div>
            <div class="text-2xl font-extrabold text-white mt-0.5" id="log-stat-total">0</div>
          </div>
        </div>

        <div class="bg-white/5 backdrop-blur-xl p-5 rounded-2xl border border-white/10 flex items-center gap-4">
          <div class="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
            <i data-lucide="check-circle-2" class="w-6 h-6"></i>
          </div>
          <div>
            <div class="text-[11px] font-medium text-white/50 uppercase tracking-wider">Tepat Waktu</div>
            <div class="text-2xl font-extrabold text-emerald-400 mt-0.5" id="log-stat-ontime">0</div>
          </div>
        </div>

        <div class="bg-white/5 backdrop-blur-xl p-5 rounded-2xl border border-white/10 flex items-center gap-4">
          <div class="w-12 h-12 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center shrink-0">
            <i data-lucide="clock-alert" class="w-6 h-6"></i>
          </div>
          <div>
            <div class="text-[11px] font-medium text-white/50 uppercase tracking-wider">Terlambat</div>
            <div class="text-2xl font-extrabold text-rose-400 mt-0.5" id="log-stat-late">0</div>
          </div>
        </div>

        <div class="bg-white/5 backdrop-blur-xl p-5 rounded-2xl border border-white/10 flex items-center gap-4">
          <div class="w-12 h-12 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center shrink-0">
            <i data-lucide="log-in" class="w-6 h-6"></i>
          </div>
          <div>
            <div class="text-[11px] font-medium text-white/50 uppercase tracking-wider">Absen Masuk</div>
            <div class="text-2xl font-extrabold text-sky-400 mt-0.5" id="log-stat-masuk">0</div>
          </div>
        </div>
      </div>

      <!-- Filters Section -->
      <div class="bg-white/5 backdrop-blur-xl p-5 rounded-2xl border border-white/10">
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <div>
            <label class="block text-xs font-semibold text-white/60 mb-2">Dari Tanggal</label>
            <input type="date" id="filter-log-date-start" onchange="window.pages.filterAttendanceLog()" class="w-full bg-[#102B22] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#14B88A]">
          </div>

          <div>
            <label class="block text-xs font-semibold text-white/60 mb-2">Sampai Tanggal</label>
            <input type="date" id="filter-log-date-end" onchange="window.pages.filterAttendanceLog()" class="w-full bg-[#102B22] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#14B88A]">
          </div>

          <div>
            <label class="block text-xs font-semibold text-white/60 mb-2">Cari Nama / Email</label>
            <div class="relative">
              <i data-lucide="search" class="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-white/40"></i>
              <input type="text" id="filter-log-search" onkeyup="window.pages.filterAttendanceLog()" placeholder="Cari..." class="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#14B88A]">
            </div>
          </div>

          <div>
            <label class="block text-xs font-semibold text-white/60 mb-2">Unit Sekolah</label>
            <select id="filter-log-unit" onchange="window.pages.filterAttendanceLog()" class="w-full bg-[#102B22] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#14B88A]">
              <option value="">Semua Unit</option>
            </select>
          </div>

          <div>
            <label class="block text-xs font-semibold text-white/60 mb-2">Jenis Absen</label>
            <select id="filter-log-jenis" onchange="window.pages.filterAttendanceLog()" class="w-full bg-[#102B22] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#14B88A]">
              <option value="">Semua Jenis</option>
              <option value="Masuk">Masuk</option>
              <option value="Pulang">Pulang</option>
            </select>
          </div>

          <div>
            <label class="block text-xs font-semibold text-white/60 mb-2">Status Waktu</label>
            <select id="filter-log-status" onchange="window.pages.filterAttendanceLog()" class="w-full bg-[#102B22] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#14B88A]">
              <option value="">Semua Status</option>
              <option value="Tepat Waktu">Tepat Waktu</option>
              <option value="Terlambat">Terlambat</option>
              <option value="Pulang Cepat">Pulang Cepat</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Main Data Table -->
      <div class="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden shadow-xl">
        <div class="p-4 border-b border-white/10 flex items-center justify-between">
          <div class="flex items-center gap-2">
            <i data-lucide="list-checks" class="w-4 h-4 text-[#14B88A]"></i>
            <h3 class="text-sm font-bold text-white">Daftar Log Kehadiran Guru</h3>
          </div>
          <div class="text-xs text-white/40" id="log-count-display">Memuat data...</div>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs border-collapse">
            <thead>
              <tr class="bg-white/[0.03] text-white/60 border-b border-white/10 uppercase tracking-wider text-[11px]">
                <th class="py-3 px-4">Waktu</th>
                <th class="py-3 px-4">Guru / Email</th>
                <th class="py-3 px-4">Unit Sekolah</th>
                <th class="py-3 px-4">Jenis</th>
                <th class="py-3 px-4">Status Waktu</th>
                <th class="py-3 px-4">Jarak / Lokasi</th>
              </tr>
            </thead>
            <tbody id="log-table-body" class="divide-y divide-white/5 text-white/80">
              <tr>
                <td colspan="6" class="py-8 text-center text-white/40">
                  <i data-lucide="loader-2" class="w-6 h-6 animate-spin mx-auto mb-2 text-[#14B88A]"></i>
                  Sedang memuat data log absensi...
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>

    <!-- MODAL INPUT ABSEN MANUAL (HP RUSAK) -->
    <div id="modal-absen-manual" class="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] hidden flex items-center justify-center p-4">
      <div class="bg-[#102B22] border border-white/10 w-full max-w-lg rounded-3xl p-6 shadow-2xl space-y-5">
        
        <div class="flex items-center justify-between border-b border-white/10 pb-4">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
              <i data-lucide="smartphone-charging" class="w-5 h-5"></i>
            </div>
            <div>
              <h3 class="text-base font-extrabold text-white">Input Absen Manual Guru</h3>
              <p class="text-xs text-white/50">Digunakan jika Guru terkendala HP rusak/baterai habis</p>
            </div>
          </div>
          <button onclick="window.pages.closeManualAttendanceModal()" class="w-8 h-8 rounded-lg bg-white/5 hover:bg-red-500/20 text-white/40 hover:text-red-400 flex items-center justify-center transition-all">
            <i data-lucide="x" class="w-4 h-4"></i>
          </button>
        </div>

        <form id="form-absen-manual" onsubmit="window.pages.submitManualAttendance(event)" class="space-y-4">
          <div>
            <label class="block text-xs font-semibold text-white/70 mb-2">Pilih Guru <span class="text-rose-400">*</span></label>
            <select id="manual-guru-email" required class="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#14B88A]">
              <option value="">Memuat daftar guru...</option>
            </select>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-semibold text-white/70 mb-2">Jenis Absen <span class="text-rose-400">*</span></label>
              <select id="manual-jenis-absen" required class="w-full bg-[#102B22] border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#14B88A]">
                <option value="Masuk">Masuk</option>
                <option value="Pulang">Pulang</option>
              </select>
            </div>

            <div>
              <label class="block text-xs font-semibold text-white/70 mb-2">Status Waktu <span class="text-rose-400">*</span></label>
              <select id="manual-status-waktu" required class="w-full bg-[#102B22] border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#14B88A]">
                <option value="Tepat Waktu">Tepat Waktu</option>
                <option value="Terlambat">Terlambat</option>
                <option value="Pulang Cepat">Pulang Cepat</option>
              </select>
            </div>
          </div>

          <div>
            <label class="block text-xs font-semibold text-white/70 mb-2">Alasan / Catatan Kendala</label>
            <input type="text" id="manual-keterangan" placeholder="Contoh: HP rusak, Baterai habis, dll." class="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white placeholder-white/30 focus:outline-none focus:border-[#14B88A]">
          </div>

          <div class="pt-4 flex items-center justify-end gap-3 border-t border-white/10">
            <button type="button" onclick="window.pages.closeManualAttendanceModal()" class="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 text-xs font-semibold">Batal</button>
            <button type="submit" id="btn-submit-manual-absen" class="px-5 py-2.5 rounded-xl bg-[#14B88A] hover:bg-[#10A078] text-white text-xs font-bold shadow-lg shadow-[#14B88A]/20">Simpan Absensi</button>
          </div>
        </form>

      </div>
    </div>
  `;
};

window.pages._attendanceLogRawData = [];
window.pages._pegawaiList = [];

window.pages.initAttendanceLog = async function() {
  if (window.lucide) window.lucide.createIcons();

  const tbody = document.getElementById('log-table-body');
  if (!tbody) return;

  tbody.innerHTML = `
    <tr>
      <td colspan="6" class="py-8 text-center text-white/40">
        <div class="inline-block w-6 h-6 border-2 border-[#14B88A] border-t-transparent rounded-full animate-spin mb-2"></div>
        <div>Mengambil catatan absensi...</div>
      </td>
    </tr>
  `;

  try {
    const adminEmail = window.auth?.currentUser?.email || '';
    const [resLog, resPegawai] = await Promise.all([
      window.apiCall('getAllLogAdmin', { adminEmail: adminEmail }),
      window.apiCall('getPegawaiListAdmin', { adminEmail: adminEmail })
    ]);

    if (Array.isArray(resPegawai)) {
      window.pages._pegawaiList = resPegawai;
    }

    if (!Array.isArray(resLog)) {
      tbody.innerHTML = `<tr><td colspan="6" class="py-8 text-center text-rose-400">Gagal memuat log absensi.</td></tr>`;
      return;
    }

    let formatted = [];
    if (resLog.length > 0 && Array.isArray(resLog[0])) {
      const startIndex = (resLog[0][0] === "Waktu_Server" || resLog[0][0] === "Waktu") ? 1 : 0;
      for (let i = startIndex; i < resLog.length; i++) {
        const row = resLog[i];
        formatted.push({
          waktu: row[0] || '-',
          email: row[1] || '-',
          nama: row[2] || '-',
          unit: row[3] || '-',
          jenis: row[4] || '-',
          status: row[5] || '-',
          durasi: row[6] || '-',
          jarak: row[7] || '-',
          lat: row[8] || '',
          lon: row[9] || ''
        });
      }
    } else {
      formatted = resLog.map(r => ({
        waktu: r.waktu || r.Waktu_Server || '-',
        email: r.email || r.Email || '-',
        nama: r.nama || r.Nama || '-',
        unit: r.unit || r.Unit_Sekolah || '-',
        jenis: r.jenis || r.Jenis_Absen || '-',
        status: r.status || r.Status_Waktu || '-',
        durasi: r.durasi || r.Durasi_Menit || '-',
        jarak: r.jarak || r.Jarak_Meter || '-',
        lat: r.lat || r.Latitude || '',
        lon: r.lon || r.Longitude || ''
      }));
    }

    window.pages._attendanceLogRawData = formatted;
    window.pages.populateLogUnitFilter(formatted);

    // Default filter tanggal dibiarkan kosong agar secara default menampilkan semua data (atau data terbaru)
    // Pengguna dapat memilih tanggal jika ingin memfilter rentang waktu tertentu.
    const dateStartEl = document.getElementById('filter-log-date-start');
    const dateEndEl = document.getElementById('filter-log-date-end');

    if (dateStartEl) dateStartEl.value = '';
    if (dateEndEl) dateEndEl.value = '';

    window.pages.filterAttendanceLog();

  } catch (err) {
    console.error('Error fetching attendance log:', err);
    tbody.innerHTML = `<tr><td colspan="6" class="py-8 text-center text-rose-400">Terjadi kesalahan koneksi server.</td></tr>`;
  }
};

window.pages.populateLogUnitFilter = function(data) {
  const unitSelect = document.getElementById('filter-log-unit');
  if (!unitSelect) return;

  const user = window.auth?.currentUser;
  const currentVal = unitSelect.value;
  const units = Array.from(new Set(data.map(d => d.unit).filter(Boolean))).sort();

  if (user && user.role !== 'admin' && user.unit) {
    unitSelect.innerHTML = `<option value="${user.unit}">${user.unit}</option>`;
    unitSelect.value = user.unit;
    unitSelect.disabled = true;
    return;
  }

  unitSelect.disabled = false;
  unitSelect.innerHTML = '<option value="">Semua Unit</option>' + 
    units.map(u => `<option value="${u}">${u}</option>`).join('');

  if (currentVal) unitSelect.value = currentVal;
};

window.pages.filterAttendanceLog = function() {
  const dateStartVal = document.getElementById('filter-log-date-start')?.value || '';
  const dateEndVal = document.getElementById('filter-log-date-end')?.value || '';
  const searchVal = (document.getElementById('filter-log-search')?.value || '').toLowerCase().trim();
  const unitVal = (document.getElementById('filter-log-unit')?.value || '').trim();
  const jenisVal = (document.getElementById('filter-log-jenis')?.value || '').trim();
  const statusVal = (document.getElementById('filter-log-status')?.value || '').trim();

  let filtered = window.pages._attendanceLogRawData.filter(item => {
    // Parser tanggal item (mendukung "dd/MM/yyyy HH:mm:ss", "yyyy-MM-dd", atau instance Date)
    let itemDateStr = '';
    if (item.waktu) {
      if (item.waktu instanceof Date) {
        const y = item.waktu.getFullYear();
        const m = String(item.waktu.getMonth() + 1).padStart(2, '0');
        const d = String(item.waktu.getDate()).padStart(2, '0');
        itemDateStr = `${y}-${m}-${d}`;
      } else if (typeof item.waktu === 'string') {
        const datePart = item.waktu.split(' ')[0].trim();
        if (datePart.includes('/')) {
          const parts = datePart.split('/');
          if (parts.length === 3) {
            // dd/MM/yyyy -> yyyy-MM-dd
            itemDateStr = `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
          }
        } else if (datePart.includes('-')) {
          const parts = datePart.split('-');
          if (parts.length === 3) {
            if (parts[0].length === 4) {
              // yyyy-MM-dd
              itemDateStr = `${parts[0]}-${parts[1].padStart(2, '0')}-${parts[2].padStart(2, '0')}`;
            } else if (parts[2].length === 4) {
              // dd-MM-yyyy -> yyyy-MM-dd
              itemDateStr = `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
            }
          }
        }
      }
    }

    const matchDateStart = !dateStartVal || (itemDateStr && itemDateStr >= dateStartVal);
    const matchDateEnd = !dateEndVal || (itemDateStr && itemDateStr <= dateEndVal);

    const matchSearch = !searchVal || 
      (item.nama && item.nama.toLowerCase().includes(searchVal)) || 
      (item.email && item.email.toLowerCase().includes(searchVal));

    const matchUnit = !unitVal || item.unit === unitVal;
    const matchJenis = !jenisVal || item.jenis === jenisVal;
    const matchStatus = !statusVal || item.status === statusVal;

    return matchDateStart && matchDateEnd && matchSearch && matchUnit && matchJenis && matchStatus;
  });

  document.getElementById('log-stat-total').textContent = filtered.length;
  document.getElementById('log-stat-ontime').textContent = filtered.filter(f => f.status === 'Tepat Waktu' || f.status === 'Sesuai').length;
  document.getElementById('log-stat-late').textContent = filtered.filter(f => f.status === 'Terlambat' || f.status === 'Pulang Cepat').length;
  document.getElementById('log-stat-masuk').textContent = filtered.filter(f => f.jenis === 'Masuk').length;
  document.getElementById('log-count-display').textContent = `Menampilkan ${filtered.length} dari ${window.pages._attendanceLogRawData.length} data`;

  const tbody = document.getElementById('log-table-body');
  if (!tbody) return;

  if (filtered.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" class="py-8 text-center text-white/40">Tidak ada data absensi yang sesuai.</td></tr>`;
    return;
  }

  tbody.innerHTML = filtered.map(r => {
    const isLate = r.status === 'Terlambat' || r.status === 'Pulang Cepat';
    const statusBadge = isLate 
      ? `<span class="px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">${r.status}</span>`
      : `<span class="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">${r.status}</span>`;

    const jenisBadge = r.jenis === 'Masuk'
      ? `<span class="px-2.5 py-1 rounded-full text-[10px] font-bold bg-sky-500/20 text-sky-300 border border-sky-500/30">Masuk</span>`
      : `<span class="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">Pulang</span>`;

    const locationInfo = (r.lat && r.lon) 
      ? `<a href="https://maps.google.com/?q=${r.lat},${r.lon}" target="_blank" class="text-[#14B88A] hover:underline inline-flex items-center gap-1">${r.jarak ? r.jarak + 'm' : 'Peta'} <i data-lucide="external-link" class="w-3 h-3"></i></a>`
      : (r.jarak ? `<span class="text-amber-300/80 font-medium">${r.jarak}</span>` : '-');

    return `
      <tr class="hover:bg-white/[0.02] transition-colors">
        <td class="py-3 px-4 font-mono text-[11px] text-white/70">${r.waktu}</td>
        <td class="py-3 px-4">
          <div class="font-bold text-white">${r.nama}</div>
          <div class="text-[10px] text-white/40">${r.email}</div>
        </td>
        <td class="py-3 px-4 font-medium text-white/80">${r.unit}</td>
        <td class="py-3 px-4">${jenisBadge}</td>
        <td class="py-3 px-4">${statusBadge}</td>
        <td class="py-3 px-4 text-white/70">${locationInfo}</td>
      </tr>
    `;
  }).join('');

  if (window.lucide) window.lucide.createIcons();
};

window.pages.openManualAttendanceModal = function() {
  const modal = document.getElementById('modal-absen-manual');
  const selectGuru = document.getElementById('manual-guru-email');
  if (!modal || !selectGuru) return;

  const user = window.auth?.currentUser;
  let list = window.pages._pegawaiList || [];

  if (user && user.role !== 'admin' && user.unit) {
    list = list.filter(p => p.unit === user.unit);
  }

  if (list.length === 0) {
    selectGuru.innerHTML = '<option value="">Tidak ada guru tersedia</option>';
  } else {
    selectGuru.innerHTML = '<option value="">Pilih Guru...</option>' + 
      list.map(p => `<option value="${p.email}">${p.nama} (${p.unit})</option>`).join('');
  }

  modal.classList.remove('hidden');
  if (window.lucide) window.lucide.createIcons();
};

window.pages.closeManualAttendanceModal = function() {
  const modal = document.getElementById('modal-absen-manual');
  if (modal) modal.classList.add('hidden');
};

window.pages.submitManualAttendance = async function(e) {
  e.preventDefault();
  const btn = document.getElementById('btn-submit-manual-absen');
  const emailGuru = document.getElementById('manual-guru-email').value;
  const jenisAbsen = document.getElementById('manual-jenis-absen').value;
  const statusWaktu = document.getElementById('manual-status-waktu').value;
  const keterangan = document.getElementById('manual-keterangan').value;
  const adminEmail = window.auth?.currentUser?.email || '';

  if (!emailGuru) {
    alert('Silakan pilih guru terlebih dahulu!');
    return;
  }

  if (btn) {
    btn.disabled = true;
    btn.innerText = 'Menyimpan...';
  }

  try {
    const res = await window.apiCall('submitAbsenManual', {
      adminEmail: adminEmail,
      emailGuru: emailGuru,
      jenisAbsen: jenisAbsen,
      statusWaktu: statusWaktu,
      keterangan: keterangan
    });

    alert(res.message);
    if (res.success) {
      window.pages.closeManualAttendanceModal();
      window.pages.initAttendanceLog();
    }
  } catch (err) {
    alert('Gagal menyimpan absensi manual: ' + err.message);
  } finally {
    if (btn) {
      btn.disabled = false;
      btn.innerText = 'Simpan Absensi';
    }
  }
};

window.pages.exportAttendanceLogCSV = function() {
  const data = window.pages._attendanceLogRawData;
  if (!data || data.length === 0) {
    alert('Tidak ada data untuk diekspor.');
    return;
  }

  const headers = ['Waktu', 'Email', 'Nama', 'Unit Sekolah', 'Jenis Absen', 'Status Waktu', 'Durasi (Menit)', 'Jarak / Catatan', 'Latitude', 'Longitude'];
  const rows = data.map(r => [
    `"${(r.waktu || '').replace(/"/g, '""')}"`,
    `"${(r.email || '').replace(/"/g, '""')}"`,
    `"${(r.nama || '').replace(/"/g, '""')}"`,
    `"${(r.unit || '').replace(/"/g, '""')}"`,
    `"${(r.jenis || '').replace(/"/g, '""')}"`,
    `"${(r.status || '').replace(/"/g, '""')}"`,
    `"${(r.durasi || '').replace(/"/g, '""')}"`,
    `"${(r.jarak || '').replace(/"/g, '""')}"`,
    `"${(r.lat || '').replace(/"/g, '""')}"`,
    `"${(r.lon || '').replace(/"/g, '""')}"`
  ]);

  const csvString = [headers.join(','), ...rows.map(e => e.join(','))].join('\r\n');
  const blob = new Blob(["\uFEFF" + csvString], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `Log_Absen_Guru_${new Date().toISOString().slice(0,10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
