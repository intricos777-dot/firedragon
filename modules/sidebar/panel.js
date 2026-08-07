// Firedragon sidebar panel controller
document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('modules-container');
  const collapseBtn = document.getElementById('collapse-btn');
  let collapsed = false;
  let activePanel = 'panel-gx-music';

  // Activate first panel by default
  const firstPanel = document.querySelector('.module-panel');
  if (firstPanel) firstPanel.classList.add('active');

  collapseBtn.addEventListener('click', () => {
    collapsed = !collapsed;
    document.querySelectorAll('.module-panel').forEach(p => {
      p.style.display = collapsed ? 'none' : '';
    });
    if (!collapsed && activePanel) {
      const ap = document.getElementById(activePanel);
      if (ap) ap.style.display = 'block';
    }
    collapseBtn.textContent = collapsed ? '+' : '−';
  });

  // Handle iframe load errors gracefully
  document.querySelectorAll('iframe').forEach(iframe => {
    iframe.addEventListener('error', () => {
      iframe.style.display = 'none';
    });
  });
});
