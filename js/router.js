window.router = {
  currentRoute: null,
  routes: {
    'login': { render: () => window.pages.renderLogin(), layout: 'none' },
    'register': { render: () => window.pages.renderRegister(), layout: 'none' },
    'dashboard': { render: () => window.pages.renderDashboard(), layout: 'admin' },
    'attendance': { render: () => window.pages.renderAttendance(), layout: 'employee' },
    // Add other routes here like 'teachers', 'reports' as needed.
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

    menuContainer.innerHTML = items.map(item => `
      <a href="#" onclick="window.router.navigateTo('${item.id}'); return false;" 
         id="menu-${item.id}"
         class="sidebar-item flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors mb-1">
        <i data-lucide="${item.icon}" class="w-5 h-5"></i>
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
      el.classList.remove('bg-secondary', 'text-foreground');
      el.classList.add('text-muted-foreground');
    });
    
    const activeItem = document.getElementById('menu-' + this.currentRoute);
    if (activeItem) {
      activeItem.classList.remove('text-muted-foreground');
      activeItem.classList.add('bg-secondary', 'text-foreground');
    }
  },

  capitalize: function(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
};
