window.ui = {
  showToast: function(icon, message, isSuccess) {
    const toast = document.getElementById('global-toast');
    const toastIcon = document.getElementById('toast-icon');
    const toastText = document.getElementById('toast-text');
    
    toast.className = `fixed top-4 left-1/2 -translate-x-1/2 z-[110] flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-2xl border transition-all duration-300 transform -translate-y-24 opacity-0 pointer-events-none backdrop-blur-xl ${isSuccess ? 'bg-[#84cc16]/20 border-[#84cc16]/30 text-white shadow-[0_0_20px_rgba(132,204,22,0.2)]' : 'bg-red-500/20 border-red-500/30 text-red-300 shadow-[0_0_20px_rgba(239,68,68,0.2)]'}`;
    
    toastIcon.innerHTML = icon;
    toastText.innerText = message;
    
    // Animate in
    setTimeout(() => {
      toast.classList.remove('-translate-y-24', 'opacity-0', 'pointer-events-none');
      toast.classList.add('translate-y-0', 'opacity-100');
    }, 10);
    
    // Animate out
    setTimeout(() => {
      toast.classList.remove('translate-y-0', 'opacity-100');
      toast.classList.add('-translate-y-24', 'opacity-0', 'pointer-events-none');
    }, 3000);
  },

  showLoading: function(text = "Memuat...") {
    const overlay = document.getElementById('loading-overlay');
    document.getElementById('loading-text').innerText = text;
    overlay.classList.remove('hidden');
    overlay.classList.add('flex');
  },

  hideLoading: function() {
    const overlay = document.getElementById('loading-overlay');
    overlay.classList.add('hidden');
    overlay.classList.remove('flex');
  },

  openModal: function(modalId) {
    const modal = document.getElementById(modalId);
    if(modal) {
      modal.classList.remove('hidden');
      modal.classList.add('flex');
      setTimeout(() => {
        modal.querySelector('.modal-content').classList.remove('scale-95', 'opacity-0');
      }, 10);
    }
  },

  closeModal: function(modalId) {
    const modal = document.getElementById(modalId);
    if(modal) {
      modal.querySelector('.modal-content').classList.add('scale-95', 'opacity-0');
      setTimeout(() => {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
      }, 200);
    }
  }
};
