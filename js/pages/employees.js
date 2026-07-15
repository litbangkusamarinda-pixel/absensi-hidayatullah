/**
 * ═══════════════════════════════════════════════════════════
 * HRMS HIDAYATULLAH — Employee & Teacher Management
 * Enterprise Personnel Module
 * ═══════════════════════════════════════════════════════════
 */

window.pages = window.pages || {};

window.pages.renderEmployees = function(type) {
  const isGuru = type === 'guru';
  const title = isGuru ? 'Manajemen Guru' : 'Manajemen Karyawan';
  const icon = isGuru ? 'graduation-cap' : 'users';

  return `
    <div class="space-y-6 pb-10 animate-fade-in-up">
      
      <!-- Header -->
      <div class="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <p class="text-xs font-bold tracking-widest text-[#14B88A] uppercase mb-1">${isGuru ? 'Personnel' : 'Human Resources'}</p>
          <h1 class="text-2xl md:text-3xl font-extrabold text-white tracking-tight">${title}</h1>
          <p class="text-sm text-white/40 mt-1">Kelola data ${isGuru ? 'guru' : 'karyawan'} dan informasi kepegawaian</p>
        </div>
        <div class="flex gap-2 no-print">
          <button onclick="window.ui.showToast('➕','Fitur tambah ${isGuru ? 'guru' : 'karyawan'} segera hadir',true)" class="btn-primary text-xs">
            <i data-lucide="user-plus" class="w-4 h-4"></i> Tambah ${isGuru ? 'Guru' : 'Karyawan'}
          </button>
        </div>
      </div>

      <!-- Quick Stats -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-3 stagger-children">
        <div class="stat-card accent-info">
          <div class="stat-label">Total ${isGuru ? 'Guru' : 'Karyawan'}</div>
          <div class="stat-value text-2xl" id="emp-total">-</div>
        </div>
        <div class="stat-card accent-success">
          <div class="stat-label">Aktif</div>
          <div class="stat-value text-2xl" id="emp-active">-</div>
        </div>
        <div class="stat-card accent-primary">
          <div class="stat-label">Hadir Hari Ini</div>
          <div class="stat-value text-2xl" id="emp-present">-</div>
        </div>
        <div class="stat-card accent-warning">
          <div class="stat-label">Unit Tersebar</div>
          <div class="stat-value text-2xl" id="emp-units">5</div>
        </div>
      </div>

      <!-- Data Table -->
      <div class="glass-card p-5">
        <!-- Toolbar -->
        <div class="flex flex-col sm:flex-row gap-3 mb-4 no-print">
          <div class="relative flex-1">
            <i data-lucide="search" class="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-white/20"></i>
            <input type="text" id="emp-search" placeholder="Cari nama atau email..." class="hrms-input pl-10 text-sm" oninput="window.pages.filterEmployees()">
          </div>
          <select id="emp-unit-filter" class="hrms-input hrms-select text-sm w-auto" onchange="window.pages.filterEmployees()">
            <option value="all">Semua Unit</option>
          </select>
        </div>

        <!-- Table -->
        <div class="overflow-x-auto" style="max-height:500px;">
          <table class="hrms-table" id="emp-table">
            <thead>
              <tr>
                <th>#</th>
                <th>${isGuru ? 'Guru' : 'Karyawan'}</th>
                <th>Email</th>
                <th>Unit</th>
                <th>Tgl Daftar</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody id="emp-table-body">
              <tr><td colspan="6" class="text-center py-12 text-white/30 text-xs">
                <div class="skeleton skeleton-text mx-auto mb-2" style="width:200px;"></div>
                <div class="skeleton skeleton-text-sm mx-auto" style="width:150px;"></div>
              </td></tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination Info -->
        <div class="flex items-center justify-between mt-4 pt-3 border-t border-white/[0.04]">
          <div class="text-xs text-white/30" id="emp-count-info">Memuat data...</div>
        </div>
      </div>

    </div>
  `;
};

window.pages.initTeachers = function() {
  loadEmployeeData();
};

window.pages.initEmployees = function() {
  loadEmployeeData();
};

async function loadEmployeeData() {
  try {
    const adminEmail = window.auth.currentUser.email;
    const employees = await window.api.getPegawaiListAdmin(adminEmail);
    
    window._employeeData = employees;
    
    const totalEl = document.getElementById('emp-total');
    const activeEl = document.getElementById('emp-active');
    const unitsEl = document.getElementById('emp-units');
    if (totalEl) totalEl.innerText = employees.length;
    if (activeEl) activeEl.innerText = employees.length;
    
    // Calculate unique units from real data
    const uniqueUnits = [...new Set(employees.map(e => e.unit))];
    if (unitsEl) unitsEl.innerText = uniqueUnits.length;
    
    // Populate unit filter
    const unitFilter = document.getElementById('emp-unit-filter');
    if (unitFilter) {
      unitFilter.innerHTML = '<option value="all">Semua Unit</option>' + uniqueUnits.map(u => `<option value="${u}">${u}</option>`).join('');
    }
    
    // Fetch today's attendance log to populate "Hadir Hari Ini"
    try {
      const todayLog = await window.api.getTodayLogAdmin(adminEmail);
      const presentEl = document.getElementById('emp-present');
      if (presentEl && Array.isArray(todayLog)) {
        const hadirSet = new Set();
        todayLog.forEach(r => { if (r.jenis === 'Masuk') hadirSet.add(r.nama); });
        presentEl.innerText = hadirSet.size;
      }
    } catch(e2) {
      console.error('Error loading today attendance for employees:', e2);
    }
    
    renderEmployeeTable(employees);
  } catch(e) {
    const tbody = document.getElementById('emp-table-body');
    if (tbody) tbody.innerHTML = '<tr><td colspan="6" class="text-center py-10 text-red-400 text-xs">Gagal memuat data</td></tr>';
  }
}

function renderEmployeeTable(data) {
  const tbody = document.getElementById('emp-table-body');
  if (!tbody) return;
  
  const infoEl = document.getElementById('emp-count-info');
  if (infoEl) infoEl.textContent = `Menampilkan ${data.length} data`;
  
  if (!data.length) {
    tbody.innerHTML = `
      <tr><td colspan="6">
        <div class="empty-state">
          <div class="empty-icon"><i data-lucide="users" class="w-6 h-6"></i></div>
          <div class="empty-title">Belum ada data</div>
          <div class="empty-desc">Data pegawai akan muncul setelah terdaftar</div>
        </div>
      </td></tr>`;
    if (window.lucide) window.lucide.createIcons();
    return;
  }
  
  tbody.innerHTML = data.map((e, i) => `
    <tr class="group cursor-pointer" onclick="window.ui.showToast('👤','Detail profil ${e.nama} segera hadir',true)">
      <td class="text-xs text-white/30">${i + 1}</td>
      <td>
        <div class="flex items-center gap-3">
          <div class="w-9 h-9 rounded-xl bg-gradient-to-br from-[#14B88A] to-[#0D9B73] flex items-center justify-center text-white text-xs font-bold shrink-0 shadow-lg shadow-[#14B88A]/20">
            ${e.nama.charAt(0)}
          </div>
          <div>
            <div class="font-semibold text-white group-hover:text-[#14B88A] transition-colors">${e.nama}</div>
          </div>
        </div>
      </td>
      <td class="text-xs text-white/40">${e.email}</td>
      <td><span class="badge badge-primary">${e.unit}</span></td>
      <td class="text-xs text-white/40">${e.tgl}</td>
      <td><span class="badge badge-success">Aktif</span></td>
    </tr>
  `).join('');
}

window.pages.filterEmployees = function() {
  if (!window._employeeData) return;
  const q = (document.getElementById('emp-search')?.value || '').toLowerCase();
  const unit = document.getElementById('emp-unit-filter')?.value || 'all';
  
  const filtered = window._employeeData.filter(e => {
    const matchSearch = e.nama.toLowerCase().includes(q) || e.email.toLowerCase().includes(q);
    const matchUnit = unit === 'all' || e.unit === unit;
    return matchSearch && matchUnit;
  });
  
  renderEmployeeTable(filtered);
};
