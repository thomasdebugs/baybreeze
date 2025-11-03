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
        setTimeout(() => heart.remove(), 5000);
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
        if (card.dataset.member === "sky") showPopup();
      });
    });
    closePopupButton.addEventListener("click", hidePopup);
  }

  const navMenu = document.getElementById("nav-menu"),
    navToggle = document.getElementById("nav-toggle"),
    navClose = document.getElementById("nav-close");
  if (navToggle)
    navToggle.addEventListener("click", () =>
      navMenu.classList.add("show-menu")
    );
  if (navClose)
    navClose.addEventListener("click", () =>
      navMenu.classList.remove("show-menu")
    );
  document.querySelectorAll(".nav-links a").forEach((link) => {
    link.addEventListener("click", () => {
      if (navMenu) navMenu.classList.remove("show-menu");
    });
  });

  const sharePopup = document.getElementById("share-popup");
  const shareBtn = document.getElementById("share-selection-btn");
  const shareBtnText = document.getElementById("share-selection-text");
  if (sharePopup && shareBtn && shareBtnText) {
    let currentSelectedText = "";
    document.addEventListener("mouseup", (event) => {
      setTimeout(() => {
        const selectedText = window.getSelection().toString().trim();
        if (selectedText.length > 10) {
          currentSelectedText = selectedText;
          let top = event.pageY - sharePopup.offsetHeight - 15;
          let left = event.pageX - sharePopup.offsetWidth / 2;
          if (top < window.scrollY) top = event.pageY + 20;
          if (left < 5) left = 5;
          if (left + sharePopup.offsetWidth > window.innerWidth - 5)
            left = window.innerWidth - sharePopup.offsetWidth - 5;
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
      if (!sharePopup.contains(event.target))
        sharePopup.classList.remove("visible");
    });
  }

  if (navMenu && navToggle) {
    let touchStartX = 0,
      isSwiping = false;
    const swipeThreshold = 50,
      edgeZone = window.innerWidth * 0.2;
    const openMenu = () => navMenu.classList.add("show-menu");
    const closeMenu = () => navMenu.classList.remove("show-menu");
    document.addEventListener(
      "touchstart",
      (e) => {
        const touch = e.touches[0];
        if (
          navMenu.classList.contains("show-menu") ||
          (!navMenu.classList.contains("show-menu") &&
            touch.clientX > window.innerWidth - edgeZone)
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
      if (
        navMenu.classList.contains("show-menu") &&
        swipeDistance > swipeThreshold
      ) {
        closeMenu();
      } else if (
        !navMenu.classList.contains("show-menu") &&
        touchStartX - touchEndX > swipeThreshold &&
        touchStartX > window.innerWidth - edgeZone
      ) {
        openMenu();
      }
      isSwiping = false;
    });
  }

  function injectFooterMeta() {
    const siteVersion = "1.0.2";
    const footerBottom = document.querySelector(".footer-bottom");
    if (footerBottom) {
      const metaContainer = document.createElement("div");
      metaContainer.className = "footer-meta-container";
      metaContainer.innerHTML = `<div class="site-status"><span class="status-indicator"></span><span class="status-text">All Systems Operational</span></div><p class="site-version">Version ${siteVersion}</p>`;
      footerBottom.appendChild(metaContainer);
    }
  }

  function injectGoogleAnalytics(measurementId) {
    const gtagScript = document.createElement("script");
    gtagScript.async = true;
    gtagScript.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
    document.head.appendChild(gtagScript);
    const inlineGtagScript = document.createElement("script");
    inlineGtagScript.innerHTML = `window.dataLayer = window.dataLayer || []; function gtag(){dataLayer.push(arguments);} gtag('js', new Date()); gtag('config', '${measurementId}');`;
    document.head.appendChild(inlineGtagScript);
  }

  injectGoogleAnalytics("G-Y9BW00PC8Y");
  injectFooterMeta();

  function initializeChatBot() {
    const css = `.chat-bot-container{position:fixed;bottom:20px;left:20px;z-index:1000}#chat-toggle-btn{background-color:var(--primary-color,#14eaf9);color:#fff;width:60px;height:60px;border-radius:50%;border:none;display:flex;align-items:center;justify-content:center;font-size:2rem;cursor:pointer;box-shadow:0 4px 15px rgba(0,0,0,.2);transition:transform .3s ease,background-color .3s ease}#chat-toggle-btn:hover{transform:scale(1.1);background-color:#18d3e0}.chat-window{position:absolute;bottom:80px;left:0;width:350px;max-width:90vw;height:450px;background:var(--card-color,#1a1a1a);border:1px solid var(--border-color,#333);border-radius:16px;display:flex;flex-direction:column;overflow:hidden;box-shadow:0 5px 25px rgba(0,0,0,.2);transform:scale(.95) translateY(10px);opacity:0;visibility:hidden;transition:all .3s cubic-bezier(.25,.8,.25,1)}.chat-window.open{transform:scale(1) translateY(0);opacity:1;visibility:visible}.chat-header{background:var(--background-color,#121212);padding:1rem;border-bottom:1px solid var(--border-color,#333);text-align:center;font-weight:600}.chat-header h4{margin:0;color:var(--text-primary,#fff);display:flex;align-items:center;justify-content:center;gap:.5rem}.chat-messages{flex-grow:1;padding:1rem;overflow-y:auto;display:flex;flex-direction:column;gap:.75rem}.chat-messages::-webkit-scrollbar{width:6px}.chat-messages::-webkit-scrollbar-thumb{background:var(--border-color,#333);border-radius:3px}.chat-message{padding:.6rem 1rem;border-radius:12px;max-width:80%;line-height:1.5;color:var(--text-primary,#fff)}.chat-message a{color:var(--primary-color,#14eaf9);text-decoration:underline}.bot-message{background:var(--background-color,#121212);align-self:flex-start;border-bottom-left-radius:4px}.user-message{background:var(--primary-color,#14eaf9);color:#121212;align-self:flex-end;border-bottom-right-radius:4px}.chat-input-area{display:flex;padding:.75rem;border-top:1px solid var(--border-color,#333);background:var(--background-color,#121212)}#chat-input{flex-grow:1;border:1px solid var(--border-color,#333);background:var(--card-color,#1a1a1a);border-radius:8px;padding:.75rem;color:var(--text-primary,#fff);outline:none;margin-right:.5rem}#chat-input:focus{border-color:var(--primary-color,#14eaf9)}#chat-send-btn{background:var(--primary-color,#14eaf9);border:none;color:#121212;padding:.75rem 1rem;border-radius:8px;cursor:pointer;transition:background-color .2s ease}#chat-send-btn:hover{background-color:#18d3e0}`;
    const html = `<div class="chat-bot-container"><div class="chat-window"><div class="chat-header"><h4><i class="ri-sparkling-2-line"></i> Bay Breeze Helper</h4></div><div class="chat-messages"></div><div class="chat-input-area"><input type="text" id="chat-input" placeholder="Ask a question..." /><button id="chat-send-btn" title="Send Message"><i class="ri-send-plane-2-fill"></i></button></div></div><button id="chat-toggle-btn" title="Open Chat Helper"><i class="ri-question-answer-line"></i></button></div>`;
    const styleSheet = document.createElement("style");
    styleSheet.innerText = css;
    document.head.appendChild(styleSheet);
    document.body.insertAdjacentHTML("beforeend", html);
    const chatToggleButton = document.getElementById("chat-toggle-btn"),
      chatWindow = document.querySelector(".chat-window"),
      messagesContainer = document.querySelector(".chat-messages"),
      chatInput = document.getElementById("chat-input"),
      chatSendButton = document.getElementById("chat-send-btn");
    let initialMessageSent = false;
    chatToggleButton.addEventListener("click", () => {
      chatWindow.classList.toggle("open");
      if (chatWindow.classList.contains("open") && !initialMessageSent) {
        setTimeout(
          () =>
            addMessage(
              "Hello! I'm the Bay Breeze helper bot. How can I assist you? You can ask me about calculators, guides, or how to join.",
              "bot"
            ),
          300
        );
        initialMessageSent = true;
      }
    });
    const sendMessage = () => {
      const userQuery = chatInput.value.trim();
      if (userQuery === "") return;
      addMessage(userQuery, "user");
      chatInput.value = "";
      setTimeout(() => addMessage(getBotResponse(userQuery), "bot"), 600);
    };
    chatSendButton.addEventListener("click", sendMessage);
    chatInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") sendMessage();
    });
    const addMessage = (text, sender) => {
      const messageElement = document.createElement("div");
      messageElement.classList.add("chat-message", `${sender}-message`);
      messageElement.innerHTML = text;
      messagesContainer.appendChild(messageElement);
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    };
    const getBotResponse = (query) => {
      const q = query.toLowerCase();
      if (q.includes("hello") || q.includes("hi") || q.includes("hey"))
        return "Hello there! How can I help you navigate the Bay Breeze resources?";
      if (
        q.includes("calc") ||
        q.includes("speedup") ||
        q.includes("gear") ||
        q.includes("shard") ||
        q.includes("rune") ||
        q.includes("skill book") ||
        q.includes("pet") ||
        q.includes("castle")
      )
        return `It sounds like you're looking for our calculators! We have a full suite of them on our <a href="/tools.html">Tools page</a>.`;
      if (
        q.includes("guide") ||
        q.includes("strategy") ||
        q.includes("f2p") ||
        q.includes("resource") ||
        q.includes("morale") ||
        q.includes("relic") ||
        q.includes("event")
      )
        return `Looking for strategies? Our <a href="/resources.html">Resources page</a> has in-depth guides on Hero Mastery, Kingdom Foundations, and more.`;
      if (q.includes("join") || q.includes("discord") || q.includes("guild"))
        return "We'd love to have you! You can <a href='https://discord.gg/pXaNHAbz2E' target='_blank'>Join Our Discord</a> to become part of the Bay Breeze community.";
      if (
        q.includes("leader") ||
        q.includes("razor") ||
        q.includes("officer") ||
        q.includes("badsmoke")
      )
        return `Our Guild Master is Razor. You can find a full list of our R4 Officers on the <a href="/index.html#members">Home page</a>.`;
      if (
        q.includes("sky") ||
        q.includes("first r4") ||
        q.includes("first officer")
      )
        return "That's a fun bit of guild history! If you click on 'sky' on the homepage, you might find a special surprise. 😉";
      if (
        q.includes("bug") ||
        q.includes("report") ||
        q.includes("hr") ||
        q.includes("suggestion") ||
        q.includes("idea")
      )
        return `If you've found a bug or have a suggestion, please use the <a href="/hr-report.html">Report to HR form</a>. We appreciate your feedback!`;
      return "I'm not sure how to answer that. Try asking about 'calculators', 'guides', 'joining the guild', or how to 'report a bug'.";
    };
  }

  initializeChatBot();
});
