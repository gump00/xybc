// XYBC Website JavaScript

// EmailJS Configuration
const EMAILJS_CONFIG = {
  publicKey: 'DYURVWb1P5eK19AD4',
  serviceId: 'service_cj4kgy6',
  templateId: 'template_0riwfad'
};

// Initialize EmailJS
(function() {
  emailjs.init(EMAILJS_CONFIG.publicKey);
})();

// Enhanced smooth scrolling function with slower, more visible animation
function scrollToSection(sectionId) {
  const element = document.getElementById(sectionId);
  if (!element) return;
  
  // Get navbar height to calculate offset
  const navbar = document.querySelector('nav');
  const navbarHeight = navbar ? navbar.offsetHeight : 70;
  
  // Calculate target position with offset
  const elementPosition = element.offsetTop;
  const offsetPosition = elementPosition - navbarHeight - 20; // Extra 20px for visual spacing
  const startPosition = window.pageYOffset;
  const distance = offsetPosition - startPosition;
  
  // Animation settings for slower, more visible scroll
  const duration = Math.max(1200, Math.abs(distance) * 0.8); // Minimum 1.2s, longer for greater distances
  let startTime = null;
  
  // Custom easing function for smooth deceleration
  function easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }
  
  // Animation function
  function animateScroll(currentTime) {
    if (startTime === null) startTime = currentTime;
    const timeElapsed = currentTime - startTime;
    const progress = Math.min(timeElapsed / duration, 1);
    
    // Apply easing
    const easedProgress = easeInOutCubic(progress);
    const currentPosition = startPosition + (distance * easedProgress);
    
    window.scrollTo(0, currentPosition);
    
    if (progress < 1) {
      requestAnimationFrame(animateScroll);
    } else {
      // Animation complete - add visual feedback
      addScrollCompleteEffect(element);
    }
  }
  
  // Start animation
  requestAnimationFrame(animateScroll);
}

// Add visual feedback when scroll animation completes
function addScrollCompleteEffect(element) {
  // Add glow effect to highlight the target section
  element.style.transition = 'all 0.8s ease';
  element.style.boxShadow = '0 0 30px rgba(212, 175, 55, 0.4), inset 0 0 20px rgba(127, 176, 105, 0.1)';
  element.style.transform = 'scale(1.001)'; // Subtle scale for emphasis
  
  // Remove effect after delay
  setTimeout(() => {
    element.style.boxShadow = '';
    element.style.transform = '';
  }, 1500);
}

// Mobile menu toggle
function toggleMobileMenu() {
  const navLinks = document.querySelector('.nav-links');
  const mobileMenu = document.querySelector('.mobile-menu');
  
  if (navLinks.style.display === 'flex') {
    navLinks.style.display = 'none';
    mobileMenu.classList.remove('active');
  } else {
    navLinks.style.display = 'flex';
    navLinks.style.flexDirection = 'column';
    navLinks.style.position = 'absolute';
    navLinks.style.top = '100%';
    navLinks.style.left = '0';
    navLinks.style.right = '0';
    navLinks.style.background = 'rgba(47, 82, 51, 0.98)';
    navLinks.style.padding = '20px';
    navLinks.style.borderRadius = '0 0 10px 10px';
    mobileMenu.classList.add('active');
  }
}

// Form submission handler with EmailJS
function handleFormSubmit(event) {
  event.preventDefault();
  
  const form = event.target;
  const submitBtn = document.getElementById('submit-btn');
  const submitText = document.getElementById('submit-text');
  const statusDiv = document.getElementById('form-status');
  
  // Get form data
  const formData = new FormData(form);
  const data = {
    from_name: formData.get('from_name'),
    phone: formData.get('phone'),
    from_email: formData.get('from_email'),
    service: formData.get('service'),
    message: formData.get('message')
  };
  
  // Validate required fields
  if (!data.from_name || !data.phone || !data.service) {
    showFormStatus('error', '请填写必填项目！\nPlease fill in all required fields!');
    return;
  }
  
  // Show loading state
  showFormStatus('loading', '正在发送邮件，请稍候...\nSending email, please wait...');
  submitBtn.classList.add('loading');
  submitBtn.disabled = true;
  submitText.innerHTML = '<i class="fas fa-spinner"></i> 发送中... Sending...';
  
  // Prepare email template parameters
  const templateParams = {
    from_name: data.from_name,
    from_email: data.from_email || '未提供',
    from_phone: data.phone,
    service: data.service,
    message: data.message || '无额外留言',
    to_email: '819517537@qq.com',
    reply_to: data.from_email || 'noreply@example.com'
  };
  
  // Send email using EmailJS
  emailjs.send(
    EMAILJS_CONFIG.serviceId,
    EMAILJS_CONFIG.templateId,
    templateParams
  )
  .then(function(response) {
    console.log('Email sent successfully:', response);
    showFormStatus('success', 
      `预约提交成功！我们将尽快与您联系。

Booking submitted successfully! We will contact you soon.

预约信息：
Booking Details:
姓名/Name: ${data.from_name}
电话/Phone: ${data.phone}
服务类型/Service: ${data.service}`
    );
    
    // Reset form after successful submission
    form.reset();
  })
  .catch(function(error) {
    console.error('Email sending failed:', error);
    showFormStatus('error', 
      '发送失败，请稍后重试或直接联系我们。\nSending failed, please try again later or contact us directly.\n\n错误信息: ' + (error.text || error.message || '未知错误')
    );
  })
  .finally(function() {
    // Reset button state
    submitBtn.classList.remove('loading');
    submitBtn.disabled = false;
    submitText.innerHTML = '<i class="fas fa-paper-plane"></i> 提交预约 Submit Booking';
  });
}

// Show form status message
function showFormStatus(type, message) {
  const statusDiv = document.getElementById('form-status');
  statusDiv.className = `form-status ${type}`;
  statusDiv.textContent = message;
  statusDiv.style.display = 'block';
  
  // Auto-hide success messages after 10 seconds
  if (type === 'success') {
    setTimeout(() => {
      statusDiv.style.display = 'none';
    }, 10000);
  }
  
  // Scroll to status message
  statusDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

// Intersection Observer for fade-in animations
function initScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('fade-in');
      }
    });
  }, observerOptions);

  // Observe all sections
  document.querySelectorAll('.section').forEach(section => {
    observer.observe(section);
  });
}

// Update active navigation link based on scroll position
function updateActiveNavLink() {
  const sections = document.querySelectorAll('.section');
  const navLinks = document.querySelectorAll('.nav-links a');
  const navbar = document.querySelector('nav');
  const navbarHeight = navbar ? navbar.offsetHeight : 70;
  
  let currentSection = '';
  
  sections.forEach(section => {
    const sectionTop = section.offsetTop - navbarHeight - 50;
    const sectionHeight = section.clientHeight;
    
    if (window.pageYOffset >= sectionTop && 
        window.pageYOffset < sectionTop + sectionHeight) {
      currentSection = section.getAttribute('id');
    }
  });
  
  // Special case for hero section at the top
  if (window.pageYOffset < 100) {
    currentSection = 'hero';
  }
  
  navLinks.forEach(link => {
    link.classList.remove('active');
    const href = link.getAttribute('href');
    if (href === `#${currentSection}`) {
      link.classList.add('active');
    }
  });
}

// Navbar background change on scroll
function initNavbarScroll() {
  window.addEventListener('scroll', function() {
    const nav = document.querySelector('nav');
    if (window.scrollY > 100) {
      nav.style.background = 'rgba(47, 82, 51, 0.98)';
      nav.style.borderBottom = '1px solid rgba(212, 175, 55, 0.5)';
    } else {
      nav.style.background = 'rgba(47, 82, 51, 0.95)';
      nav.style.borderBottom = '1px solid rgba(212, 175, 55, 0.3)';
    }
    
    // Update active navigation link
    updateActiveNavLink();
  });
}

// Initialize parallax effect for hero section
function initParallaxEffect() {
  window.addEventListener('scroll', function() {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('#hero');
    const rate = scrolled * -0.5;
    
    if (hero) {
      hero.style.transform = `translateY(${rate}px)`;
    }
  });
}

// Image loading handler
function handleImageLoad(img) {
  img.style.opacity = '1';
  img.style.transform = 'scale(1)';
  // Hide placeholder text when image loads
  const placeholder = img.parentElement.querySelector('.placeholder-text');
  if (placeholder) {
    placeholder.style.display = 'none';
  }
}

// Image error handler
function handleImageError(img) {
  // Hide the image and show placeholder text
  img.style.display = 'none';
  const placeholder = img.parentElement.querySelector('.placeholder-text');
  if (placeholder) {
    placeholder.style.display = 'block';
  }
}

// Load profile images
function loadProfileImages() {
  // Hero section profile image
  const heroImageContainer = document.querySelector('#hero .image-container');
  if (heroImageContainer) {
    const heroImg = document.createElement('img');
    heroImg.src = 'images/profile/hero-photo.jpg';
    heroImg.alt = 'Miss Li Profile Photo';
    heroImg.className = 'profile-photo';
    heroImg.style.opacity = '0';
    heroImg.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    heroImg.style.transform = 'scale(1.05)';
    
    heroImg.onload = () => handleImageLoad(heroImg);
    heroImg.onerror = () => handleImageError(heroImg);
    
    // Insert image into container
    heroImageContainer.appendChild(heroImg);
  }
  
  // About section profile image
  const aboutImageContainer = document.querySelector('#about .about-image');
  if (aboutImageContainer) {
    const aboutImg = document.createElement('img');
    aboutImg.src = 'images/profile/about-photo.jpg';
    aboutImg.alt = 'Miss Li About Photo';
    aboutImg.className = 'about-photo';
    aboutImg.style.opacity = '0';
    aboutImg.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    aboutImg.style.transform = 'scale(1.05)';
    
    aboutImg.onload = () => handleImageLoad(aboutImg);
    aboutImg.onerror = () => handleImageError(aboutImg);
    
    // Insert image into container
    aboutImageContainer.appendChild(aboutImg);
  }
}

// Initialize all features when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  // Ensure WeChat modal is hidden on page load
  const wechatModal = document.getElementById('wechatModal');
  if (wechatModal) {
    wechatModal.style.display = 'none';
    wechatModal.style.opacity = '0';
    wechatModal.style.visibility = 'hidden';
    wechatModal.classList.remove('show');
  }
  
  // Mobile menu event listener
  const mobileMenuBtn = document.querySelector('.mobile-menu');
  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', toggleMobileMenu);
  }
  
  // Form submission event listener
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', handleFormSubmit);
  }
  
  // Initialize animations and effects
  initScrollAnimations();
  initNavbarScroll();
  initParallaxEffect();
  
  // Set initial active navigation link
  updateActiveNavLink();
  
  // Load profile images
  loadProfileImages();
  
  // Initialize carousels
  initCarousel('nine-constitution-carousel');
  initCarousel('five-realms-carousel');
  // 智能萃取机-设备实拍轮播
  initCarousel('smart-machine-carousel');
  // 专利技术-轮播
  initCarousel('patents-carousel');
  // 公司新闻-新闻1 轮播
  initCarousel('news1-carousel');
  
  // Add click handlers for navigation links
  document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      
      // Visual feedback: show that scroll is starting
      this.classList.add('scrolling');
      
      // Remove active class from all nav links
      document.querySelectorAll('.nav-links a').forEach(navLink => {
        navLink.classList.remove('active');
      });
      
      // Add active class to clicked link
      this.classList.add('active');
      
      // Get target section ID
      const targetId = this.getAttribute('href').substring(1);
      
      // Add loading cursor to body during scroll
      document.body.style.cursor = 'wait';
      
      // Scroll to target section with enhanced animation
      scrollToSection(targetId);
      
      // Remove scrolling state after animation
      setTimeout(() => {
        this.classList.remove('scrolling');
        document.body.style.cursor = '';
      }, 1200);
      
      // Close mobile menu if open
      const navLinks = document.querySelector('.nav-links');
      if (window.innerWidth <= 768 && navLinks.style.display === 'flex') {
        toggleMobileMenu();
      }
      
      // Enhanced visual feedback to the clicked link
      this.style.transform = 'scale(0.95)';
      setTimeout(() => {
        this.style.transform = 'scale(1.05)';
        setTimeout(() => {
          this.style.transform = 'scale(1)';
        }, 200);
      }, 150);
    });
  });
});

// Export functions for global use
window.scrollToSection = scrollToSection;

// WeChat QR Code Modal Functions
function showWeChatQR() {
  const modal = document.getElementById('wechatModal');
  if (modal) {
    modal.classList.add('show');
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
  }
}

function hideWeChatQR() {
  const modal = document.getElementById('wechatModal');
  if (modal) {
    modal.classList.remove('show');
    document.body.style.overflow = ''; // Restore scrolling
  }
}

// Export WeChat functions for global use
window.showWeChatQR = showWeChatQR;
window.hideWeChatQR = hideWeChatQR;

// =========================
// 轮播图功能实现
// =========================

// 轮播图状态管理
const carouselStates = {};

// 初始化轮播图
function initCarousel(carouselId) {
  const carousel = document.getElementById(carouselId);
  if (!carousel) return;
  
  const track = carousel.querySelector('.carousel-track');
  const slides = track.querySelectorAll('.carousel-slide');
  const indicatorsContainer = document.getElementById(carouselId.replace('-carousel', '-indicators'));
  
  if (!track || slides.length === 0) return;
  
  // 初始化状态
  carouselStates[carouselId] = {
    currentIndex: 0,
    totalSlides: slides.length,
    isAnimating: false,
    autoPlayInterval: null
  };
  
  // 创建指示器
  createIndicators(carouselId, indicatorsContainer, slides.length);
  
  // 设置初始位置
  updateCarouselPosition(carouselId);
  
  // 启动自动播放
  startAutoPlay(carouselId);
  
  // 添加触摸/滑动支持
  addTouchSupport(carouselId);
  
  console.log(`轮播图 ${carouselId} 初始化完成：`);
  console.log(`- 共 ${slides.length} 张图片`);
  console.log(`- 自动播放间隔: 2.5 秒`);
  console.log(`- 支持从最后一张直接跳转到第一张`);
}

// 创建指示器
function createIndicators(carouselId, container, count) {
  if (!container) return;
  
  container.innerHTML = '';
  
  for (let i = 0; i < count; i++) {
    const indicator = document.createElement('div');
    indicator.className = 'indicator';
    if (i === 0) indicator.classList.add('active');
    
    indicator.addEventListener('click', () => goToSlide(carouselId, i));
    container.appendChild(indicator);
  }
}

// 更新轮播图位置
function updateCarouselPosition(carouselId, animated = true) {
  const carousel = document.getElementById(carouselId);
  if (!carousel) return;
  
  const track = carousel.querySelector('.carousel-track');
  const indicators = document.querySelectorAll(`#${carouselId.replace('-carousel', '-indicators')} .indicator`);
  const state = carouselStates[carouselId];
  
  if (!track || !state) return;
  
  // 更新轮播位置 - 确保直接跳转，不滚动穿越
  const translateX = -state.currentIndex * 100;
  
  // 对于正常的切换，使用动画
  if (animated) {
    track.style.transition = 'transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
  } else {
    track.style.transition = 'none';
  }
  
  track.style.transform = `translateX(${translateX}%)`;
  
  // 更新指示器
  indicators.forEach((indicator, index) => {
    indicator.classList.toggle('active', index === state.currentIndex);
  });
  
  // 添加滑入动画效果
  const currentSlide = track.children[state.currentIndex];
  if (currentSlide && animated) {
    currentSlide.style.animation = 'slideIn 0.6s ease forwards';
    setTimeout(() => {
      currentSlide.style.animation = '';
    }, 600);
  }
}

// 移动到指定幻灯片
function goToSlide(carouselId, index) {
  const state = carouselStates[carouselId];
  if (!state || state.isAnimating) return;
  
  const oldIndex = state.currentIndex;
  
  if (index < 0) index = state.totalSlides - 1;
  if (index >= state.totalSlides) index = 0;
  
  state.currentIndex = index;
  state.isAnimating = true;
  
  // 调试信息
  if (oldIndex === state.totalSlides - 1 && index === 0) {
    console.log(`轮播图 ${carouselId}: 从最后一张(第${oldIndex + 1}张)直接跳转到第一张`);
  } else {
    console.log(`轮播图 ${carouselId}: 从第${oldIndex + 1}张切换到第${index + 1}张`);
  }
  
  updateCarouselPosition(carouselId);
  
  // 重置自动播放
  restartAutoPlay(carouselId);
  
  setTimeout(() => {
    state.isAnimating = false;
  }, 600); // 与动画时间保持一致
}

// 轮播图移动函数（供按钮调用）
function moveCarousel(carouselId, direction) {
  const state = carouselStates[carouselId];
  if (!state || state.isAnimating) return;
  
  const newIndex = state.currentIndex + direction;
  goToSlide(carouselId, newIndex);
  
  // 添加按钮点击反馈
  const button = event.target.closest('.carousel-btn');
  if (button) {
    button.style.transform = 'translateY(-50%) scale(0.9)';
    setTimeout(() => {
      button.style.transform = 'translateY(-50%) scale(1.1)';
      setTimeout(() => {
        button.style.transform = 'translateY(-50%) scale(1)';
      }, 100);
    }, 100);
  }
}

// 启动自动播放
function startAutoPlay(carouselId) {
  const state = carouselStates[carouselId];
  if (!state || state.autoPlayInterval) return;
  
  state.autoPlayInterval = setInterval(() => {
    if (!state.isAnimating) {
      // 计算下一张的索引，确保从最后一张直接跳转到第一张
      let nextIndex = state.currentIndex + 1;
      if (nextIndex >= state.totalSlides) {
        nextIndex = 0; // 直接跳转到第一张，不滚动
      }
      goToSlide(carouselId, nextIndex);
    }
  }, 2500); // 每2.5秒自动切换
  
  console.log(`轮播图 ${carouselId} 自动播放已启动，间隔 2.5 秒`);
}

// 停止自动播放
function stopAutoPlay(carouselId) {
  const state = carouselStates[carouselId];
  if (!state || !state.autoPlayInterval) return;
  
  clearInterval(state.autoPlayInterval);
  state.autoPlayInterval = null;
}

// 重启自动播放
function restartAutoPlay(carouselId) {
  stopAutoPlay(carouselId);
  // 用户操作后的延迟时间，与轮播间隔保持一致
  setTimeout(() => {
    startAutoPlay(carouselId);
  }, 2500); // 2.5秒后重启自动播放，保持一致的节奏
}

// 添加触摸滑动支持
function addTouchSupport(carouselId) {
  const carousel = document.getElementById(carouselId);
  if (!carousel) return;
  
  let startX = 0;
  let startY = 0;
  let isDragging = false;
  
  carousel.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
    isDragging = true;
    stopAutoPlay(carouselId);
  }, { passive: true });
  
  carousel.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    
    const currentX = e.touches[0].clientX;
    const currentY = e.touches[0].clientY;
    const diffX = startX - currentX;
    const diffY = startY - currentY;
    
    // 如果垂直滑动距离大于水平滑动距离，不处理（允许页面滚动）
    if (Math.abs(diffY) > Math.abs(diffX)) {
      isDragging = false;
      return;
    }
    
    // 阻止默认滚动行为
    e.preventDefault();
  }, { passive: false });
  
  carousel.addEventListener('touchend', (e) => {
    if (!isDragging) return;
    
    const endX = e.changedTouches[0].clientX;
    const diffX = startX - endX;
    
    // 滑动距离大于50px才触发切换
    if (Math.abs(diffX) > 50) {
      if (diffX > 0) {
        // 向左滑动，显示下一张
        moveCarousel(carouselId, 1);
      } else {
        // 向右滑动，显示上一张
        moveCarousel(carouselId, -1);
      }
    } else {
      // 滑动距离不够，重启自动播放
      restartAutoPlay(carouselId);
    }
    
    isDragging = false;
  }, { passive: true });
  
  // 鼠标支持（桌面端）
  let mouseStartX = 0;
  let isMouseDragging = false;
  
  carousel.addEventListener('mousedown', (e) => {
    mouseStartX = e.clientX;
    isMouseDragging = true;
    stopAutoPlay(carouselId);
    e.preventDefault();
  });
  
  carousel.addEventListener('mousemove', (e) => {
    if (!isMouseDragging) return;
    e.preventDefault();
  });
  
  carousel.addEventListener('mouseup', (e) => {
    if (!isMouseDragging) return;
    
    const diffX = mouseStartX - e.clientX;
    
    if (Math.abs(diffX) > 30) {
      if (diffX > 0) {
        moveCarousel(carouselId, 1);
      } else {
        moveCarousel(carouselId, -1);
      }
    } else {
      restartAutoPlay(carouselId);
    }
    
    isMouseDragging = false;
  });
  
  carousel.addEventListener('mouseleave', () => {
    if (isMouseDragging) {
      isMouseDragging = false;
      restartAutoPlay(carouselId);
    }
  });
}

// 窗口失焦时暂停自动播放，获得焦点时恢复
document.addEventListener('visibilitychange', () => {
  Object.keys(carouselStates).forEach(carouselId => {
    if (document.hidden) {
      stopAutoPlay(carouselId);
    } else {
      startAutoPlay(carouselId);
    }
  });
});

// 导出轮播图函数供全局使用
window.moveCarousel = moveCarousel;
window.goToSlide = goToSlide;

// Close modal with Escape key
document.addEventListener('keydown', function(event) {
  if (event.key === 'Escape') {
    hideWeChatQR();
  }
});

// Additional safety check for GitHub Pages deployment
window.addEventListener('load', function() {
  // Double-check modal is hidden after all resources load
  setTimeout(function() {
    const wechatModal = document.getElementById('wechatModal');
    if (wechatModal && !wechatModal.classList.contains('show')) {
      wechatModal.style.display = 'none';
      wechatModal.style.opacity = '0';
      wechatModal.style.visibility = 'hidden';
    }
  }, 100);
});