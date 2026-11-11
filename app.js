// تفاعلات الموقع الثابت — مطاعم برج القاهرة
document.addEventListener('DOMContentLoaded', () => {
  const progress = document.getElementById('scroll-progress');
  const updateProgress = () => {
    if (!progress) return;
    const root = document.documentElement;
    const max = root.scrollHeight - root.clientHeight;
    progress.style.width = (max > 0 ? (root.scrollTop / max) * 100 : 0) + '%';
  };
  window.addEventListener('scroll', updateProgress, { passive: true });
  updateProgress();

  const openMenuBtn = document.getElementById('open-menu');
  const closeMenuBtn = document.getElementById('close-menu');
  const drawer = document.getElementById('site-drawer');
  const overlay = document.getElementById('drawer-overlay');
  function openDrawer() {
    if (!drawer || !overlay) return;
    drawer.classList.add('active'); overlay.classList.add('active');
    drawer.setAttribute('aria-hidden', 'false'); overlay.setAttribute('aria-hidden', 'false');
    if (openMenuBtn) openMenuBtn.setAttribute('aria-expanded', 'true');
  }
  function closeDrawer() {
    if (!drawer || !overlay) return;
    drawer.classList.remove('active'); overlay.classList.remove('active');
    drawer.setAttribute('aria-hidden', 'true'); overlay.setAttribute('aria-hidden', 'true');
    if (openMenuBtn) openMenuBtn.setAttribute('aria-expanded', 'false');
  }
  if (openMenuBtn) openMenuBtn.addEventListener('click', openDrawer);
  if (closeMenuBtn) closeMenuBtn.addEventListener('click', closeDrawer);
  if (overlay) overlay.addEventListener('click', closeDrawer);
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeDrawer(); });

  const form = document.getElementById('delete-account-form');
  if (form) form.addEventListener('submit', event => {
    event.preventDefault();
    const phone = document.getElementById('user-phone');
    const email = document.getElementById('user-email');
    const reason = document.getElementById('reason');
    const status = document.getElementById('delete-request-status');
    if (!phone || !phone.value.trim()) { phone?.focus(); return; }
    const subject = 'طلب حذف حساب — مطاعم برج القاهرة';
    const body = [
      'أرغب في طلب حذف حسابي والبيانات المرتبطة به.', '',
      'رقم الهاتف المسجل: ' + phone.value.trim(),
      'البريد الإلكتروني: ' + (email?.value.trim() || 'غير مذكور'),
      'سبب الطلب: ' + (reason?.value.trim() || 'غير مذكور'), '',
      'أرجو تأكيد استلام الطلب ومعالجته خلال يوم عمل واحد بعد التحقق من ملكية الحساب.'
    ].join('\n');
    if (status) {
      status.hidden = false;
      status.textContent = 'تم تجهيز رسالة طلب الحذف. أرسلها من تطبيق البريد الذي فُتح الآن. يبدأ احتساب مدة يوم العمل بعد استلام الطلب والتحقق من ملكية الحساب.';
    }
    window.location.href = 'mailto:burjalqahirarestau@gmail.com?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
  });
});
