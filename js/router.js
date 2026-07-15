/**
 * ═══════════════════════════════════════════════════════════
 * HRMS HIDAYATULLAH — Application Router
 * Enterprise SPA Router with Role-Based Navigation
 * ═══════════════════════════════════════════════════════════
 */

window.router = {
  currentRoute: null,
  routes: {
    // Auth
    'login':      { render: () => window.pages.renderLogin(),       layout: 'none',     title: 'Login' },
    'register':   { render: () => window.pages.renderRegister(),    layout: 'none',     title: 'Registrasi' },
    // Admin
    'dashboard':  { render: () => window.pages.renderDashboard(),   layout: 'admin',    title: 'Dashboard' },
    'attendance': { render: () => window.pages.renderAttendance(),  layout: 'employee', title: 'Absensi' },
    'teachers':   { render: () => window.pages.renderEmployees('guru'),  layout: 'admin', title: 'Manajemen Guru' },
    'employees':  { render: () => window.pages.renderEmployees('karyawan'), layout: 'admin', title: 'Manajemen Karyawan' },
    'units':      { render: () => window.pages.renderUnits(),       layout: 'admin',    title: 'Manajemen Unit' },
    'reports':    { render: () => window.pages.renderReportCenter(),layout: 'admin',    title: 'Pusat Laporan' },
    'report-monthly': { render: () => window.pages.renderReportMonthly(), layout: 'admin', title: 'Laporan Bulanan' },
    'announcements': { render: () => window.pages.renderSettings('announcements'), layout: 'admin', title: 'Pengumuman' },
    'calendar':   { render: () => window.pages.renderSettings('calendar'),   layout: 'admin', title: 'Kalender' },
    'profile':    { render: () => window.pages.renderSettings('profile'),    layout: 'admin', title: 'Profil Saya' },
    'settings':   { render: () => window.pages.renderSettings('settings'),   layout: 'admin', title: 'Pengaturan' },
  },

  navigateTo: function(routeId) {
    const route = this.routes[routeId];
    if (!route) {
      console.error('Route not found:', routeId);
      return;
    }
    
    this.currentRoute = routeId;
    this.updateLayout(route.layout);
    
    const contentHtml = route.render();
    document.getElementById('app-content').innerHTML = contentHtml;

    // After rendering HTML, call any attached init scripts
    // Support both direct name and hyphenated names
    const initName = 'init' + routeId.split('-').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join('');
    if (window.pages[initName]) {
      window.pages[initName]();
    }
    
    this.updateSidebarActiveState();
    this.updatePageTitle(route.title);

    // Auto-close sidebar on mobile
    if (window.innerWidth < 768) {
      const sidebar = document.getElementById('sidebar');
      if (sidebar && !sidebar.classList.contains('-translate-x-full')) {
        sidebar.classList.add('-translate-x-full');
        const overlay = document.getElementById('sidebar-overlay');
        if (overlay) overlay.classList.remove('active');
      }
    }
  },

  updatePageTitle: function(title) {
    const el = document.getElementById('page-title');
    if (el) el.textContent = title || 'Dashboard';
  },

  updateLayout: function(layoutType) {
    const sidebar = document.getElementById('sidebar');
    const topnav = document.getElementById('topnav');
    const rightSidebar = document.getElementById('right-sidebar');
    
    if (layoutType === 'none') {
      if(sidebar) sidebar.classList.add('!hidden');
      if(topnav) topnav.classList.add('!hidden');
      if(rightSidebar) rightSidebar.classList.add('!hidden');
      const mc = document.getElementById('main-container');
      if(mc) mc.classList.remove('md:ml-[260px]');
    } else {
      if(sidebar) sidebar.classList.remove('!hidden');
      if(topnav) topnav.classList.remove('!hidden');
      
      const mc = document.getElementById('main-container');
      if(mc) mc.classList.add('md:ml-[260px]');

      if (layoutType === 'admin') {
        if(rightSidebar) rightSidebar.classList.remove('!hidden');
      } else {
        if(rightSidebar) rightSidebar.classList.add('!hidden');
      }

      this.renderSidebarItems(layoutType);
    }
  },

  renderSidebarItems: function(layoutType) {
    const menuContainer = document.getElementById('sidebar-menu');
    
    if (layoutType === 'admin') {
      const sections = [
        {
          label: 'Menu Utama',
          items: [
            { id: 'dashboard',  icon: 'layout-dashboard', label: 'Dashboard' },
            { id: 'attendance', icon: 'scan-line',         label: 'Absensi' },
          ]
        },
        {
          label: 'Manajemen',
          items: [
            { id: 'teachers',  icon: 'graduation-cap', label: 'Guru' },
            { id: 'employees', icon: 'users',           label: 'Karyawan' },
            { id: 'units',     icon: 'building-2',      label: 'Unit Sekolah' },
          ]
        },
        {
          label: 'Laporan & Analitik',
          items: [
            { id: 'reports', icon: 'bar-chart-3', label: 'Pusat Laporan' },
          ]
        },
        {
          label: 'Lainnya',
          items: [
            { id: 'announcements', icon: 'megaphone',  label: 'Pengumuman' },
            { id: 'calendar',      icon: 'calendar',    label: 'Kalender' },
            { id: 'profile',       icon: 'user-circle', label: 'Profil' },
            { id: 'settings',      icon: 'settings',    label: 'Pengaturan' },
          ]
        },
      ];

      menuContainer.innerHTML = sections.map(section => `
        <div class="sidebar-section-label">${section.label}</div>
        ${section.items.map(item => `
          <a href="#" onclick="window.router.navigateTo('${item.id}'); return false;" 
             id="menu-${item.id}"
             class="sidebar-item flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-semibold text-white/40 hover:bg-white/[0.04] hover:text-white/80 transition-all duration-200 mb-0.5 group">
            <div class="w-8 h-8 rounded-lg bg-white/[0.03] flex items-center justify-center group-hover:bg-[#14B88A]/15 group-hover:text-[#14B88A] transition-all duration-200 shrink-0">
              <i data-lucide="${item.icon}" class="w-[16px] h-[16px]"></i>
            </div>
            ${item.label}
          </a>
        `).join('')}
      `).join('');
      
    } else if (layoutType === 'employee') {
      menuContainer.innerHTML = `
        <div class="sidebar-section-label">Menu</div>
        <a href="#" onclick="window.router.navigateTo('attendance'); return false;" 
           id="menu-attendance"
           class="sidebar-item flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-semibold text-white/40 hover:bg-white/[0.04] hover:text-white/80 transition-all duration-200 mb-0.5 group">
          <div class="w-8 h-8 rounded-lg bg-white/[0.03] flex items-center justify-center group-hover:bg-[#14B88A]/15 group-hover:text-[#14B88A] transition-all duration-200 shrink-0">
            <i data-lucide="scan-line" class="w-[16px] h-[16px]"></i>
          </div>
          Absensi Saya
        </a>
      `;
    }

    // Re-initialize lucide icons for newly added HTML
    if (window.lucide) {
      window.lucide.createIcons();
    }
  },

  updateSidebarActiveState: function() {
    document.querySelectorAll('.sidebar-item').forEach(el => {
      el.classList.remove('bg-[#14B88A]/10', 'text-white', '!text-[#14B88A]', 'active');
      el.classList.add('text-white/40');
      const iconBg = el.querySelector('div');
      if (iconBg) {
        iconBg.classList.remove('bg-[#14B88A]/15', 'text-[#14B88A]');
        iconBg.classList.add('bg-white/[0.03]');
      }
    });
    
    const activeItem = document.getElementById('menu-' + this.currentRoute);
    if (activeItem) {
      activeItem.classList.remove('text-white/40');
      activeItem.classList.add('bg-[#14B88A]/10', 'text-white', 'active');
      const iconBg = activeItem.querySelector('div');
      if (iconBg) {
        iconBg.classList.remove('bg-white/[0.03]');
        iconBg.classList.add('bg-[#14B88A]/15', 'text-[#14B88A]');
      }
    }
  },

  capitalize: function(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
};
