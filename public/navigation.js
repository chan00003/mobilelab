document.addEventListener('DOMContentLoaded', () => {
  const addLink = (anchor, href, label) => {
    if (anchor.parentElement?.querySelector(`a[href="${href}"]`)) return;
    const link = document.createElement('a');
    link.href = href;
    link.textContent = label;
    link.className = anchor.className.replace('border-primary', 'border-primary');
    if (anchor.closest('#mobile-nav')) link.classList.add('mobile-nav-link');
    anchor.insertAdjacentElement('afterend', link);
  };
  document.querySelectorAll('a[href="/how-we-work"]').forEach((anchor) => {
    addLink(anchor, '/blog', 'Blog');
    addLink(anchor.nextElementSibling, '/work', 'Projects');
  });
});
