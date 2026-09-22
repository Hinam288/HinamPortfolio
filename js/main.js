/* ============================================
   MAIN JAVASCRIPT
   Portfolio — Hải Nam
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize Lucide icons
    lucide.createIcons();

    // ========================
    // THEME TOGGLE
    // ========================
    const themeToggle = document.getElementById('themeToggle');
    const htmlElement = document.documentElement;

    // Load saved theme from localStorage
    const savedTheme = localStorage.getItem('portfolio-theme') || 'dark';
    htmlElement.setAttribute('data-theme', savedTheme);

    themeToggle.addEventListener('click', () => {
        const currentTheme = htmlElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        htmlElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('portfolio-theme', newTheme);
    });

    // ========================
    // NAVBAR
    // ========================
    const navbar = document.getElementById('navbar');
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Scroll effect
    const handleScroll = () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    };
    window.addEventListener('scroll', handleScroll);

    // Hamburger toggle
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    });

    // Close menu on link click
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // Active link on scroll
    const sections = document.querySelectorAll('section[id]');
    const updateActiveLink = () => {
        const scrollY = window.scrollY + 100;

        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');

            if (scrollY >= top && scrollY < top + height) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    };
    window.addEventListener('scroll', updateActiveLink);

    // ========================
    // REVEAL ON SCROLL
    // ========================
    const revealElements = document.querySelectorAll('.reveal');

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Stagger the animation based on sibling index
                const siblings = entry.target.parentElement.querySelectorAll('.reveal');
                let delay = 0;
                siblings.forEach((sibling, i) => {
                    if (sibling === entry.target) {
                        delay = i * 80;
                    }
                });
                
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, delay);
                
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));

    // ========================
    // SHOWREEL VIDEO
    // ========================
    const playButton = document.getElementById('playButton');
    const videoPlaceholder = document.getElementById('videoPlaceholder');
    const showreelVideo = document.getElementById('showreelVideo');

    if (videoPlaceholder && showreelVideo) {
        videoPlaceholder.addEventListener('click', () => {
            const videoSrc = showreelVideo.getAttribute('data-src');
            if (videoSrc) {
                showreelVideo.src = videoSrc + '?autoplay=1';
                showreelVideo.style.display = 'block';
                videoPlaceholder.classList.add('hidden');
            }
        });
    }

    // ========================
    // PORTFOLIO FILTER & PAGINATION (MAX 6 PREVIEWS)
    // ========================
    const filterBtns = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    const loadMoreContainer = document.getElementById('loadMoreContainer');
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    const loadMoreText = document.getElementById('loadMoreText');
    const loadMoreIcon = document.getElementById('loadMoreIcon');

    const MAX_VISIBLE = 6;
    let currentFilter = 'all';
    let isExpanded = false;

    const updatePortfolioView = () => {
        // Lấy danh sách item thuộc filter hiện tại
        const matchingItems = Array.from(portfolioItems).filter(item => {
            const category = item.getAttribute('data-category');
            return currentFilter === 'all' || category === currentFilter;
        });

        const totalMatching = matchingItems.length;

        // Ẩn tất cả items và tạm dừng video preview không hiển thị
        portfolioItems.forEach(item => {
            item.classList.add('hidden');
            const video = item.querySelector('.thumb-video');
            if (video && typeof video.pause === 'function') {
                video.pause();
            }
        });

        // Chọn các item được phép hiển thị (tối đa 6 hoặc toàn bộ nếu isExpanded)
        const visibleItems = isExpanded ? matchingItems : matchingItems.slice(0, MAX_VISIBLE);

        visibleItems.forEach(item => {
            item.classList.remove('hidden');
            item.classList.add('visible');
            const video = item.querySelector('.thumb-video');
            if (video && typeof video.play === 'function') {
                video.play().catch(() => {});
            }
        });

        // Cập nhật trạng thái nút "Xem thêm / Thu gọn"
        if (loadMoreContainer) {
            if (totalMatching > MAX_VISIBLE) {
                loadMoreContainer.style.display = 'flex';
                if (isExpanded) {
                    if (loadMoreText) loadMoreText.textContent = 'Thu gọn';
                    if (loadMoreIcon) loadMoreIcon.setAttribute('data-lucide', 'chevron-up');
                } else {
                    const remaining = totalMatching - MAX_VISIBLE;
                    if (loadMoreText) loadMoreText.textContent = `Xem thêm (${remaining} video)`;
                    if (loadMoreIcon) loadMoreIcon.setAttribute('data-lucide', 'chevron-down');
                }
                if (window.lucide) {
                    lucide.createIcons();
                }
            } else {
                loadMoreContainer.style.display = 'none';
            }
        }
    };

    // Sự kiện chuyển tab filter
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            currentFilter = btn.getAttribute('data-filter');
            isExpanded = false; // Reset trạng thái mở rộng khi đổi tab
            updatePortfolioView();
        });
    });

    // Sự kiện click nút Xem thêm / Thu gọn
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', () => {
            isExpanded = !isExpanded;
            updatePortfolioView();

            // Nếu người dùng thu gọn, cuộn nhẹ về đầu portfolio section
            if (!isExpanded) {
                const portfolioSection = document.getElementById('portfolio');
                if (portfolioSection) {
                    portfolioSection.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    }

    // Khởi tạo hiển thị ban đầu
    updatePortfolioView();

    // ========================
    // MODAL
    // ========================
    const modal = document.getElementById('projectModal');
    const modalBackdrop = document.getElementById('modalBackdrop');
    const modalClose = document.getElementById('modalClose');
    const modalTitle = document.getElementById('modalTitle');
    const modalCategory = document.getElementById('modalCategory');
    const modalDesc = document.getElementById('modalDesc');
    const modalVideo = document.getElementById('modalVideo');

    const openModal = (data) => {
        modalTitle.textContent = data.title;
        modalCategory.textContent = data.category;
        modalDesc.textContent = data.desc;
        
        if (data.video) {
            // Check if it's a local MP4 file or a YouTube/Vimeo embed
            if (data.video.endsWith('.mp4') || data.video.endsWith('.webm') || data.video.endsWith('.mov')) {
                // Local video — play with controls and sound
                modalVideo.innerHTML = `
                    <video src="${data.video}" controls autoplay 
                        style="width:100%; height:100%; border-radius: 12px; background:#000;">
                    </video>`;
            } else {
                // YouTube / Vimeo embed
                modalVideo.innerHTML = `<iframe src="${data.video}" frameborder="0" allowfullscreen></iframe>`;
            }
            modalVideo.style.display = 'block';
        } else {
            modalVideo.innerHTML = '';
            modalVideo.style.display = 'none';
        }

        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    };

    const closeModal = () => {
        modal.classList.remove('active');
        document.body.style.overflow = '';
        // Stop any playing video/audio
        modalVideo.innerHTML = '';
    };

    // Get video source from portfolio item (from data-video or from thumb video)
    const getProjectData = (thumb) => {
        const btn = thumb.querySelector('.btn-view');
        if (!btn) return null;

        let videoSrc = btn.getAttribute('data-video');
        
        // If no data-video, check if there's a video thumbnail
        if (!videoSrc) {
            const thumbVideo = thumb.querySelector('.thumb-video');
            if (thumbVideo) {
                videoSrc = thumbVideo.getAttribute('src');
            }
        }

        return {
            title: btn.getAttribute('data-title'),
            category: btn.getAttribute('data-category'),
            desc: btn.getAttribute('data-desc'),
            video: videoSrc
        };
    };

    // Attach click to view buttons
    document.querySelectorAll('.btn-view').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const thumb = btn.closest('.portfolio-thumb');
            const data = getProjectData(thumb);
            if (data) openModal(data);
        });
    });

    // Also open modal on portfolio thumb click
    document.querySelectorAll('.portfolio-thumb').forEach(thumb => {
        thumb.addEventListener('click', () => {
            const data = getProjectData(thumb);
            if (data) openModal(data);
        });
    });

    if (modalClose) modalClose.addEventListener('click', closeModal);
    if (modalBackdrop) modalBackdrop.addEventListener('click', closeModal);

    // Close modal on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });

    // ========================
    // CONTACT FORM
    // ========================
    const contactForm = document.getElementById('contactForm');
    const formStatus = document.getElementById('formStatus');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const message = document.getElementById('message').value.trim();

            // Basic validation
            if (!name || !email || !message) {
                formStatus.textContent = 'Vui lòng điền đầy đủ thông tin.';
                formStatus.className = 'form-status error';
                return;
            }

            // Email format check
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                formStatus.textContent = 'Vui lòng nhập email hợp lệ.';
                formStatus.className = 'form-status error';
                return;
            }

            // Simulate success (replace with actual form submission logic)
            formStatus.textContent = 'Cảm ơn bạn! Tin nhắn đã được gửi thành công. ✓';
            formStatus.className = 'form-status success';
            contactForm.reset();

            // Auto-hide status after 5s
            setTimeout(() => {
                formStatus.className = 'form-status';
            }, 5000);
        });
    }

    // ========================
    // SMOOTH SCROLL FOR ALL ANCHOR LINKS
    // ========================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offset = 80; // navbar height
                const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
                window.scrollTo({
                    top: top,
                    behavior: 'smooth'
                });
            }
        });
    });
});
