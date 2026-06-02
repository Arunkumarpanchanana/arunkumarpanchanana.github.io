(function() {
  const page = document.body.getAttribute('data-page') || getPageFromUrl();

  function getPageFromUrl() {
    const fullPath = window.location.pathname;
    if (fullPath.startsWith('/blog/')) return 'blog';
    const filename = fullPath.split('/').pop() || 'index.html';
    return filename.replace('.html', '');
  }

  function setActiveLink(doc) {
    const links = doc.querySelectorAll('#site-nav a');
    links.forEach(link => {
      let href = link.getAttribute('href').replace('.html', '').replace(/^\/+/, '') || 'index';
      if (href === page) {
        link.classList.add('active');
      }
    });
  }

  function loadPartial(id, url, callback) {
    const prefix = window.location.pathname.startsWith('/blog/') ? '../' : '';
    fetch(prefix + url)
      .then(res => res.text())
      .then(html => {
        const temp = document.createElement('div');
        temp.innerHTML = html;
        setActiveLink(temp);
        document.getElementById(id).innerHTML = temp.innerHTML;
        if (callback) callback();
      })
      .catch(err => console.error('Failed to load ' + url, err));
  }

  loadPartial('nav-placeholder', 'partials/nav.html', () => {
    const toggleButton = document.querySelector('.menu-toggle');
    const nav = document.querySelector('#site-nav');
    if (toggleButton && nav) {
      toggleButton.addEventListener('click', () => {
        const isOpen = nav.classList.toggle('nav-open');
        toggleButton.classList.toggle('menu-open');
        toggleButton.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      });
    }
  });

  loadPartial('footer-placeholder', 'partials/footer.html');
})();
