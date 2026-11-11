// Smooth Scroll and Interactive UI for Restaurant Legal Pages
document.addEventListener('DOMContentLoaded', () => {
  // Scroll progress indicator
  const progress = document.getElementById('scroll-progress');
  if (progress) {
    window.addEventListener('scroll', () => {
      const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = (winScroll / height) * 100;
      progress.style.width = scrolled + '%';
    });
  }

  // Drawer menu handlers
  const openMenuBtn = document.getElementById('open-menu');
  const closeMenuBtn = document.getElementById('close-menu');
  const drawer = document.getElementById('site-drawer');
  const overlay = document.getElementById('drawer-overlay');

  function openDrawer() {
    if (drawer && overlay) {
      drawer.classList.add('active');
      overlay.classList.add('active');
      openMenuBtn.setAttribute('aria-expanded', 'true');
    }
  }

  function closeDrawer() {
    if (drawer && overlay) {
      drawer.classList.remove('active');
      overlay.classList.remove('active');
      openMenuBtn.setAttribute('aria-expanded', 'false');
    }
  }

  if (openMenuBtn) openMenuBtn.addEventListener('click', openDrawer);
  if (closeMenuBtn) closeMenuBtn.addEventListener('click', closeDrawer);
  if (overlay) overlay.addEventListener('click', closeDrawer);

  // Form submit simulation for delete account page
  const deleteForm = document.getElementById('delete-account-form');
  if (deleteForm) {
    deleteForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const phone = document.getElementById('user-phone').value;
      if (phone.trim() === '') {
        alert('يرجى إدخال رقم الهاتف المسجل لدينا لتأكيد الطلب.');
        return;
      }
      alert('تم استلام طلبك بنجاح! سيتم فحص الطلب والتواصل معك وحذف كافة بيانات الحساب خلال فترة أقصاها 7 أيام عمل.');
      deleteForm.reset();
    });
  }
});
