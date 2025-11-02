document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    });
  });

  const nav = document.querySelector("nav");
  if (nav) {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 50) {
        nav.classList.add("scrolled");
      } else {
        nav.classList.remove("scrolled");
      }
    });
  }

  const elementsToAnimate = document.querySelectorAll(
    ".intro-card, .tool-card, .resource-card, .member-card"
  );
  if (elementsToAnimate.length > 0) {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -100px 0px",
    };

    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    elementsToAnimate.forEach((el) => {
      el.classList.add("fade-in-up");
      observer.observe(el);
    });
  }

  const popup = document.getElementById("win-popup");
  const closePopupButton = document.getElementById("close-popup");
  const heartsContainer = document.getElementById("hearts-container");
  const memberCards = document.querySelectorAll(".member-card");

  if (popup && closePopupButton && heartsContainer && memberCards.length > 0) {
    let heartsInterval;

    const startHeartsRain = () => {
      heartsInterval = setInterval(() => {
        const heart = document.createElement("div");
        heart.classList.add("heart");
        heart.innerText = "❤️";
        heart.style.left = `${Math.random() * 100}vw`;
        heart.style.animationDuration = `${Math.random() * 2 + 3}s`;
        heart.style.fontSize = `${Math.random() * 1 + 1}rem`;
        heartsContainer.appendChild(heart);

        setTimeout(() => {
          heart.remove();
        }, 5000);
      }, 150);
    };

    const stopHeartsRain = () => {
      clearInterval(heartsInterval);
      heartsContainer.innerHTML = "";
    };

    const showPopup = () => {
      popup.classList.add("visible");
      startHeartsRain();
    };

    const hidePopup = () => {
      popup.classList.remove("visible");
      stopHeartsRain();
    };

    memberCards.forEach((card) => {
      card.addEventListener("click", () => {
        const memberName = card.dataset.member;
        if (memberName === "sky") {
          showPopup();
        }
      });
    });

    closePopupButton.addEventListener("click", hidePopup);
  }

  const navMenu = document.getElementById("nav-menu"),
    navToggle = document.getElementById("nav-toggle"),
    navClose = document.getElementById("nav-close");

  if (navToggle) {
    navToggle.addEventListener("click", () => {
      navMenu.classList.add("show-menu");
    });
  }

  if (navClose) {
    navClose.addEventListener("click", () => {
      navMenu.classList.remove("show-menu");
    });
  }

  const navLinks = document.querySelectorAll(".nav-links a");
  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      if (navMenu) {
        navMenu.classList.remove("show-menu");
      }
    });
  });

  const sharePopup = document.getElementById("share-popup");
  const shareBtn = document.getElementById("share-selection-btn");
  const shareBtnText = document.getElementById("share-selection-text");

  if (sharePopup && shareBtn && shareBtnText) {
    let currentSelectedText = "";

    document.addEventListener("mouseup", (event) => {
      setTimeout(() => {
        const selection = window.getSelection();
        const selectedText = selection.toString().trim();

        if (selectedText.length > 10) {
          currentSelectedText = selectedText;

          let top = event.pageY - sharePopup.offsetHeight - 15;
          let left = event.pageX - sharePopup.offsetWidth / 2;

          if (top < window.scrollY) {
            top = event.pageY + 20;
          }
          if (left < 5) {
            left = 5;
          }
          if (left + sharePopup.offsetWidth > window.innerWidth - 5) {
            left = window.innerWidth - sharePopup.offsetWidth - 5;
          }

          sharePopup.style.top = `${top}px`;
          sharePopup.style.left = `${left}px`;
          sharePopup.classList.add("visible");
        } else {
          currentSelectedText = "";
          sharePopup.classList.remove("visible");
        }
      }, 10);
    });

    shareBtn.addEventListener("click", async () => {
      const shareData = {
        title: document.title,
        text: `"${currentSelectedText}"`,
        url: window.location.href,
      };

      if (navigator.share) {
        try {
          await navigator.share(shareData);
        } catch (err) {}
      } else if (navigator.clipboard) {
        try {
          await navigator.clipboard.writeText(
            `"${currentSelectedText}" - From ${window.location.href}`
          );
          shareBtnText.textContent = "Copied!";
          setTimeout(() => {
            shareBtnText.textContent = "Share";
          }, 1500);
        } catch (err) {
          alert("Oops, couldn't copy the text.");
        }
      }

      sharePopup.classList.remove("visible");
    });

    document.addEventListener("mousedown", (event) => {
      if (!sharePopup.contains(event.target)) {
        sharePopup.classList.remove("visible");
      }
    });
  }

  if (navMenu && navToggle) {
    let touchStartX = 0;
    let isSwiping = false;
    const swipeThreshold = 50;
    const edgeZone = window.innerWidth * 0.2;

    const openMenu = () => navMenu.classList.add("show-menu");
    const closeMenu = () => navMenu.classList.remove("show-menu");

    document.addEventListener(
      "touchstart",
      (e) => {
        const touch = e.touches[0];
        const isMenuOpen = navMenu.classList.contains("show-menu");

        if (
          isMenuOpen ||
          (!isMenuOpen && touch.clientX > window.innerWidth - edgeZone)
        ) {
          touchStartX = touch.clientX;
          isSwiping = true;
        }
      },
      { passive: true }
    );

    document.addEventListener("touchend", (e) => {
      if (!isSwiping) return;

      const touchEndX = e.changedTouches[0].clientX;
      const swipeDistance = touchEndX - touchStartX;
      const isMenuOpen = navMenu.classList.contains("show-menu");

      if (isMenuOpen && swipeDistance > swipeThreshold) {
        closeMenu();
      } else if (
        !isMenuOpen &&
        touchStartX - touchEndX > swipeThreshold &&
        touchStartX > window.innerWidth - edgeZone
      ) {
        openMenu();
      }

      isSwiping = false;
    });
  }

  function initGoogleTranslate() {
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    document.head.appendChild(script);
    
    window.googleTranslateElementInit = function() {
      new google.translate.TranslateElement(
        { 
          pageLanguage: 'en',
          layout: google.translate.TranslateElement.InlineLayout.SIMPLE
        },
        'google_translate_element'
      );
    };
  }

  function injectFooterMeta() {
    const siteVersion = "1.0.1";
    const footerBottom = document.querySelector(".footer-bottom");

    if (footerBottom) {
      const metaContainer = document.createElement("div");
      metaContainer.className = "footer-meta-container";

      const badgesHTML = `
        <div class="footer-badges">
          <div class="netlify-badge">
            <a href="https://app.netlify.com/sites/baybreeze/deploys" target="_blank" rel="noopener noreferrer">
              <img 
                src="https://api.netlify.com/api/v1/badges/44326680-4df7-4a75-bd54-2da14cd95e1c/deploy-status" 
                alt="Netlify Deploy Status"
                loading="lazy"
              />
            </a>
          </div>
          <div id="wcb" class="carbonbadge"></div>
        </div>
      `;

      const versionHTML = `<p class="site-version">Version ${siteVersion}</p>`;

      metaContainer.innerHTML = badgesHTML + versionHTML;
      footerBottom.appendChild(metaContainer);

      const carbonScript = document.createElement("script");
      carbonScript.src =
        "https://unpkg.com/website-carbon-badges@1.1.3/b.min.js";
      carbonScript.defer = true;
      document.body.appendChild(carbonScript);
    }
  }

  function injectGoogleAnalytics(measurementId) {
    const gtagScript = document.createElement("script");
    gtagScript.async = true;
    gtagScript.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
    document.head.appendChild(gtagScript);

    const inlineGtagScript = document.createElement("script");
    inlineGtagScript.innerHTML = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '${measurementId}');
    `;
    document.head.appendChild(inlineGtagScript);
  }

  const measurementId = "G-Y9BW00PC8Y";
  injectGoogleAnalytics(measurementId);
  injectFooterMeta();
  initGoogleTranslate();
});