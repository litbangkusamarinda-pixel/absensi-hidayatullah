window.router = {
  currentRoute: null,
  routes: {
    'login': { render: () => window.pages.renderLogin(), layout: 'none' },
    'register': { render: () => window.pages.renderRegister(), layout: 'none' },
    'dashboard': { render: () => window.pages.renderDashboard(), layout: 'admin' },
    'attendance': { render: () => window.pages.renderAttendance(), layout: 'employee' },
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
    if (window.pages['init' + this.capitalize(routeId)]) {
      window.pages['init' + this.capitalize(routeId)]();
    }
    
    this.updateSidebarActiveState();
  },

  updateLayout: function(layoutType) {
    const sidebar = document.getElementById('sidebar');
    const topnav = document.getElementById('topnav');
    const rightSidebar = document.getElementById('right-sidebar');
    
    if (layoutType === 'none') {
      sidebar.style.display = 'none';
      topnav.style.display = 'none';
      rightSidebar.style.display = 'none';
      document.getElementById('main-container').classList.remove('md:ml-64');
    } else {
      sidebar.style.display = 'flex';
      topnav.style.display = 'flex';
      rightSidebar.style.display = layoutType === 'admin' ? 'block' : 'none';
      
      document.getElementById('main-container').classList.add('md:ml-64');
      if (layoutType === 'admin') {
         document.getElementById('content-area').classList.add('xl:mr-80');
      } else {
         document.getElementById('content-area').classList.remove('xl:mr-80');
      }

      this.renderSidebarItems(layoutType);
    }
  },

  renderSidebarItems: function(layoutType) {
    const menuContainer = document.getElementById('sidebar-menu');
    let items = [];
    
    if (layoutType === 'admin') {
      items = [
        { id: 'dashboard', icon: 'layout-dashboard', label: 'Dashboard' },
        { id: 'attendance', icon: 'calendar-check', label: 'Attendance' },
        { id: 'teachers', icon: 'users', label: 'Teachers' },
        { id: 'reports', icon: 'file-bar-chart-2', label: 'Reports' },
      ];
    } else if (layoutType === 'employee') {
      items = [
        { id: 'attendance', icon: 'calendar-check', label: 'Absensi Saya' },
        { id: 'history', icon: 'history', label: 'Riwayat' }
      ];
    }

    menuContainer.innerHTML = `
      <div class="mb-4">
        <p class="text-[9px] font-black tracking-[0.2em] text-white/30 uppercase px-3 mb-3">Menu Utama</p>
      </div>
    ` + items.map(item => `
      <a href="#" onclick="window.router.navigateTo('${item.id}'); return false;" 
         id="menu-${item.id}"
         class="sidebar-item flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-white/50 hover:bg-white/5 hover:text-white transition-all duration-300 mb-1 group">
        <div class="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-[#84cc16]/20 group-hover:text-[#a3e635] transition-all duration-300 shrink-0">
          <i data-lucide="${item.icon}" class="w-4 h-4"></i>
        </div>
        ${item.label}
      </a>
    `).join('');
    
    // Re-initialize lucide icons for newly added HTML
    if (window.lucide) {
      window.lucide.createIcons();
    }
  },

  updateSidebarActiveState: function() {
    document.querySelectorAll('.sidebar-item').forEach(el => {
      el.classList.remove('bg-[#84cc16]/10', 'text-white', '!text-[#a3e635]', 'active');
      el.classList.add('text-white/50');
      // Reset icon bg
      const iconBg = el.querySelector('div');
      if (iconBg) {
        iconBg.classList.remove('bg-[#84cc16]/20', 'text-[#a3e635]');
        iconBg.classList.add('bg-white/5');
      }
    });
    
    const activeItem = document.getElementById('menu-' + this.currentRoute);
    if (activeItem) {
      activeItem.classList.remove('text-white/50');
      activeItem.classList.add('bg-[#84cc16]/10', 'text-white', 'active');
      const iconBg = activeItem.querySelector('div');
      if (iconBg) {
        iconBg.classList.remove('bg-white/5');
        iconBg.classList.add('bg-[#84cc16]/20', 'text-[#a3e635]');
      }
    }
  },

  capitalize: function(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
};
