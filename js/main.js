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

    // Set active link and close menu on click
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';

            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
        });
    });

    // Active link on scroll
    const sections = document.querySelectorAll('section[id]');
    const updateActiveLink = () => {
        // Nếu cuộn gần chạm đáy trang, ưu tiên active tab Liên hệ (#contact)
        if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 80) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === '#contact') {
                    link.classList.add('active');
                }
            });
            return;
        }

        const scrollY = window.scrollY + 140;

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
    // PROJECT DETAILS DATA (Role, Workflow, Tools, Highlights)
    // ========================
    const projectDetailsData = {
        'live-action': {
            role: 'Video Editor & Compositing Artist',
            client: 'HFL Media / Monkey Việt Nam (Chuỗi phim thiếu nhi RLK & PeaPea)',
            format: 'Full HD 1080p • 60fps • Tỷ lệ 16:9',
            tools: ['After Effects', 'Premiere Pro', 'Adobe Illustrator', 'Adobe Audition'],
            workflow: [
                {
                    step: 'Tiền kỳ & Chuẩn bị tư liệu',
                    desc: 'Nghiên cứu kịch bản phân cảnh (Storyboard), kiểm tra footage quay thực tế diễn viên nhí trên phông xanh/bối cảnh thật, chọn lọc take diễn tự nhiên nhất.'
                },
                {
                    step: 'Tách lớp & Xử lý đồ họa Vector (AI)',
                    desc: 'Phân tách các nhân vật hoạt hình 2D, đạo cụ, biểu cảm gương mặt thành từng layer độc lập trên Adobe Illustrator để chuẩn bị rigging diễn hoạt.'
                },
                {
                    step: 'Diễn hoạt 2D & Compositing (After Effects)',
                    desc: 'Keying phông xanh mượt mà, Motion Tracking bám theo chuyển động camera, gắn ghép diễn hoạt nhân vật hoạt hình tương tác chân thực với diễn viên thực tế (Match-moving).'
                },
                {
                    step: 'Hiệu ứng kỹ xảo (VFX) & Chuyển cảnh',
                    desc: 'Bổ sung các hiệu ứng lấp lánh (sparkles), burst, pop animation rực rỡ thu hút thị giác trẻ nhỏ, tạo nhịp điệu chuyển động sống động.'
                },
                {
                    step: 'Sound Design & Hoàn thiện âm thanh',
                    desc: 'Đồng bộ bài hát chính, lồng ghép sound FX hoạt hình vui nhộn (boing, whoosh, pop) tăng tính tương tác và cảm xúc vui tươi.'
                }
            ],
            highlights: 'Chuỗi series đạt hàng chục đến hàng trăm triệu lượt xem trên YouTube toàn cầu; tối ưu màu sắc tươi sáng, chuyển động 60fps mượt mà.'
        },
        'motion-graphic': {
            role: 'Motion Graphic Designer & Video Editor',
            client: 'UKG Group (Thương hiệu Gia dụng Cao cấp KALITE)',
            format: 'Full HD / 4K • Tỷ lệ 16:9 & Màn hình LED OOH Ngoại cảnh',
            tools: ['After Effects', 'Adobe Illustrator', 'Premiere Pro', 'Photoshop'],
            workflow: [
                {
                    step: 'Phân tích Brief & Moodboard',
                    desc: 'Nắm bắt thông điệp thương hiệu Kalite, định hình tone & mood hiện đại, sang trọng với bảng màu nhận diện chuẩn guideline.'
                },
                {
                    step: 'Thiết kế Styleframe & Typography',
                    desc: 'Thiết kế bố cục layout trên Illustrator & Photoshop, lựa chọn font chữ hiện đại, làm nổi bật thông điệp "Thế nào là giàu" / "Xay êm ép mịn".'
                },
                {
                    step: 'Motion Graphic Animation (After Effects)',
                    desc: 'Diễn hoạt Typography, kinetic text nhịp nhàng theo voiceover, tạo shape transition mượt mà và camera 3D tracking chuyên nghiệp.'
                },
                {
                    step: 'Ứng dụng & Tối ưu OOH LED',
                    desc: 'Xử lý độ tương phản cao, kích thước hiển thị lớn và tốc độ đọc chữ phù hợp cho người đi đường xem trên màn hình LED ngoài trời.'
                },
                {
                    step: 'Hoàn thiện Color Grading & Âm thanh',
                    desc: 'Mastering âm thanh với Voice Talent truyền cảm, Sound FX công nghệ hiện đại, xuất file chuẩn bit-rate cao.'
                }
            ],
            highlights: 'Phủ sóng trên các tuyến đường huyết mạch lớn tại Hà Nội (màn hình LED OOH) và chiến dịch Social Media diện rộng của KALITE.'
        },
        'san-pham': {
            role: 'Director of Photography (DOP) & Video Editor',
            client: 'UKG Group (Thương hiệu KALITE — Chảo Inox Tripro, Thiết bị nhà bếp)',
            format: 'Full HD 1080p / 4K • Chuẩn Food & TVC Commercial',
            tools: ['Sony FX/A7 Series', 'Premiere Pro', 'DaVinci Resolve / Lumetri', 'Audition'],
            workflow: [
                {
                    step: 'Setup Ánh sáng & Bối cảnh bếp Studio',
                    desc: 'Bố trí ánh sáng 3 điểm (Key light, Fill light, Rim light) chuyên biệt cho bề mặt Inox 304 sáng bóng tránh phản xạ loá, tôn vẻ đẹp kim loại cao cấp.'
                },
                {
                    step: 'Góc máy Macro Food & Slow-motion',
                    desc: 'Sử dụng ống kính macro quay cận cảnh từng giọt dầu sôi xèo xèo, lớp da gà vàng giòn, khói bốc nghi ngút ở 60fps - 120fps.'
                },
                {
                    step: 'Dựng Pacing kích thích vị giác',
                    desc: 'Cắt ghép nhịp nhàng theo tiết tấu nấu nướng nhanh - chậm tương phản, tạo cảm giác hấp dẫn và thôi thúc mua sắm.'
                },
                {
                    step: 'Chỉnh màu Food Commercial (Color Grading)',
                    desc: 'Tăng cường sắc ấm của món ăn (vàng ươm, đỏ cam) kết hợp giữ màu inox bạc kim chuẩn trung tính, sáng bóng sang trọng.'
                },
                {
                    step: 'Thiết kế âm thanh ASMR chân thực',
                    desc: 'Khuếch đại tiếng cắt giòn tan, tiếng xèo xèo của chảo rán, tiếng cọ rửa sáng bóng tạo cảm giác thỏa mãn tối đa cho người xem.'
                }
            ],
            highlights: 'Thúc đẩy tỷ lệ chuyển đổi bán hàng trên các kênh YouTube và E-commerce, định vị sản phẩm gia dụng cao cấp.'
        },
        'tiktok': {
            role: 'Short-form Video Creator & Editor',
            client: 'Kênh TikTok Thương hiệu & Khách hàng cá nhân',
            format: 'Dạng dọc 9:16 (1080x1920) • Tối ưu Safe Zone Mobile',
            tools: ['Premiere Pro', 'CapCut Pro', 'After Effects', 'Photoshop'],
            workflow: [
                {
                    step: 'Thiết kế Hook 3 giây đầu giữ chân',
                    desc: 'Tạo hình ảnh và câu mở đầu bất ngờ, kích thích tò mò ngay từ giây đầu tiên để kéo retention rate lên mức cao nhất.'
                },
                {
                    step: 'Tối ưu bố cục Safe Zone (9:16)',
                    desc: 'Đảm bảo phụ đề, visual chính không bị che khuất bởi giao diện TikTok (nút like, comment, caption, sound icon).'
                },
                {
                    step: 'Dynamic Subtitles & Sound FX nhịp điệu',
                    desc: 'Chèn phụ đề động đổi màu theo từng chữ (karaoke caption), kết hợp tiếng click, whoosh, pop giữ nhịp liên tục không giây chết.'
                },
                {
                    step: 'Hiệu ứng Zoom & B-Roll liên tục',
                    desc: 'Cứ mỗi 2-3 giây đổi góc máy hoặc punch zoom để chống mỏi mắt và giữ sự tập trung cao nhất của người lướt.'
                }
            ],
            highlights: 'Tỉ lệ giữ chân người xem (Watch time) cao, tăng chuyển đổi viral trên TikTok & Reels / Shorts.'
        },
        'video-khac': {
            role: 'Lead Video Editor & Post-Production Specialist',
            client: 'Dự án Sự Kiện, Recap Doanh Nghiệp & Storytelling',
            format: 'Cinematic 16:9 • High Dynamic Range',
            tools: ['Premiere Pro', 'After Effects', 'Audition', 'Color Grading'],
            workflow: [
                {
                    step: 'Tuyển chọn Footage & Phân loại kịch bản',
                    desc: 'Lọc hàng trăm gigabyte footage sự kiện, chọn lọc những khoảnh khắc cảm xúc và khung hình có chiều sâu nhất.'
                },
                {
                    step: 'Dựng Beat Sync & Pacing điện ảnh',
                    desc: 'Cắt dựng nhịp điệu bám chặt từng nốt nhạc nền (crescendo, drop), đẩy cao trào cảm xúc từ mở đầu đến kết thúc.'
                },
                {
                    step: 'Motion Graphics Lower Thirds & Title',
                    desc: 'Thiết kế tiêu đề 3D, thanh thông tin diễn giả/sự kiện tinh tế, tôn vinh thương hiệu một cách trang trọng.'
                },
                {
                    step: 'Color Grading Cinematic',
                    desc: 'Cân bằng ánh sáng phức tạp tại sự kiện sân khấu, áp tone màu điện ảnh giàu cảm xúc (Teal & Orange / Film Look).'
                },
                {
                    step: 'Audio Mastering',
                    desc: 'Khử ồn âm thanh hội trường, làm rõ tiếng phát biểu (dialogue clarity) và hòa trộn âm hưởng nhạc nền hào hùng.'
                }
            ],
            highlights: 'Video recap tổng kết ghi lại dấu ấn truyền cảm hứng mạnh mẽ, làm hài lòng các tiêu chuẩn sự kiện doanh nghiệp.'
        }
    };

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
    const btnProjectDetail = document.getElementById('btnProjectDetail');
    const projectDetailPanel = document.getElementById('projectDetailPanel');

    // Toggle Project Detail Panel
    if (btnProjectDetail && projectDetailPanel) {
        btnProjectDetail.addEventListener('click', () => {
            const isOpen = projectDetailPanel.style.display === 'block';
            if (isOpen) {
                projectDetailPanel.style.display = 'none';
                btnProjectDetail.classList.remove('active');
                btnProjectDetail.setAttribute('aria-expanded', 'false');
            } else {
                projectDetailPanel.style.display = 'block';
                btnProjectDetail.classList.add('active');
                btnProjectDetail.setAttribute('aria-expanded', 'true');
                if (window.lucide) {
                    lucide.createIcons();
                }
            }
        });
    }

    const openModal = (data) => {
        modalTitle.textContent = data.title;
        modalCategory.textContent = data.category;
        modalDesc.textContent = data.desc;
        
        if (data.video) {
            // Check if it's a local MP4 file or a YouTube/Vimeo embed
            if (data.video.endsWith('.mp4') || data.video.endsWith('.webm') || data.video.endsWith('.mov')) {
                // Local video — play with controls and sound
                modalVideo.innerHTML = `
                    <video src="${data.video}" controls autoplay playsinline
                        style="width:100%; height:100%; border-radius: 12px; background:#000;">
                    </video>`;
                
                const vid = modalVideo.querySelector('video');
                if (vid) {
                    vid.play().catch(() => {});
                }
            } else {
                // YouTube / Vimeo embed
                modalVideo.innerHTML = `<iframe src="${data.video}" frameborder="0" allowfullscreen></iframe>`;
            }
            modalVideo.style.display = 'block';
        } else {
            modalVideo.innerHTML = '';
            modalVideo.style.display = 'none';
        }

        // Render Project Details
        const categoryKey = data.categoryKey || 'live-action';
        const info = projectDetailsData[categoryKey] || projectDetailsData['live-action'];

        if (info && projectDetailPanel) {
            const toolsHtml = info.tools.map(tool => `
                <span class="detail-tool-tag">
                    <i data-lucide="check" style="width:13px;height:13px;color:var(--accent);"></i>
                    ${tool}
                </span>
            `).join('');

            const workflowHtml = info.workflow.map((item, idx) => `
                <div class="detail-workflow-item">
                    <div class="detail-step-badge">${idx + 1 < 10 ? '0' + (idx + 1) : idx + 1}</div>
                    <div class="detail-step-content">
                        <div class="detail-step-title">${item.step}</div>
                        <div class="detail-step-desc">${item.desc}</div>
                    </div>
                </div>
            `).join('');

            projectDetailPanel.innerHTML = `
                <div class="detail-card">
                    <div class="detail-meta-grid">
                        <div class="detail-meta-item">
                            <span class="detail-meta-label"><i data-lucide="user-check"></i> Vai trò chính</span>
                            <span class="detail-meta-value">${info.role}</span>
                        </div>
                        <div class="detail-meta-item">
                            <span class="detail-meta-label"><i data-lucide="building"></i> Khách hàng / Đơn vị</span>
                            <span class="detail-meta-value">${info.client}</span>
                        </div>
                        <div class="detail-meta-item">
                            <span class="detail-meta-label"><i data-lucide="monitor"></i> Định dạng</span>
                            <span class="detail-meta-value">${info.format}</span>
                        </div>
                    </div>

                    <div class="detail-section">
                        <div class="detail-section-title"><i data-lucide="wrench"></i> Công cụ & Phần mềm sử dụng</div>
                        <div class="detail-tools-list">${toolsHtml}</div>
                    </div>

                    <div class="detail-section">
                        <div class="detail-section-title"><i data-lucide="workflow"></i> Cách tạo ra dạng video này (Quy trình sản xuất)</div>
                        <div class="detail-workflow-list">${workflowHtml}</div>
                    </div>

                    <div class="detail-highlight-box">
                        <div class="detail-section-title"><i data-lucide="trophy"></i> Điểm nổi bật & Hiệu quả dự án</div>
                        <div class="detail-highlight-text">${info.highlights}</div>
                    </div>
                </div>
            `;

            // Reset panel state to collapsed
            projectDetailPanel.style.display = 'none';
            if (btnProjectDetail) {
                btnProjectDetail.classList.remove('active');
                btnProjectDetail.setAttribute('aria-expanded', 'false');
            }
        }

        modal.classList.add('active');
        document.body.style.overflow = 'hidden';

        if (window.lucide) {
            lucide.createIcons();
        }
    };

    const closeModal = () => {
        modal.classList.remove('active');
        document.body.style.overflow = '';
        // Stop any playing video/audio
        modalVideo.innerHTML = '';
        if (projectDetailPanel) {
            projectDetailPanel.style.display = 'none';
        }
        if (btnProjectDetail) {
            btnProjectDetail.classList.remove('active');
            btnProjectDetail.setAttribute('aria-expanded', 'false');
        }
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

        const item = thumb.closest('.portfolio-item');
        const categoryKey = item ? item.getAttribute('data-category') : '';

        return {
            title: btn.getAttribute('data-title'),
            category: btn.getAttribute('data-category'),
            desc: btn.getAttribute('data-desc'),
            video: videoSrc,
            categoryKey: categoryKey
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
