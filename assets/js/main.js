// ==========================================================================
// MAIN.JS - Gurdeep Portfolio Website Scripts
// ==========================================================================

document.addEventListener("DOMContentLoaded", () => {
    initStickyHeader();
    initCounterAnimation();
    initSkillBars();
    initTimelineProgress();
    initContactFormValidation();
});


// ==========================================================================
// 1. Sticky Header on Scroll
// ==========================================================================
function initStickyHeader() {
    const header = document.querySelector("header");
    if (!header) return;

    window.addEventListener("scroll", () => {
        header.classList.toggle("sticky", window.scrollY > 50);
    });
}


// ==========================================================================
// 2. Counter Animation (About Section)
// ==========================================================================
function initCounterAnimation() {
    const counters = document.querySelectorAll("#about-section .counter");
    if (!counters.length) return;

    const countUp = (el) => {
        const target = +el.getAttribute("data-target");
        const duration = 1200; // ms
        const startTime = performance.now();

        const update = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            el.textContent = Math.floor(progress * target);

            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                el.textContent = target;
            }
        };

        requestAnimationFrame(update);
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                countUp(entry.target);
                observer.unobserve(entry.target); // sirf ek baar chale
            }
        });
    }, { threshold: 0.5 });

    counters.forEach((counter) => observer.observe(counter));
}


// ==========================================================================
// 3. Skill Progress Bars Animation (Skills Section)
// ==========================================================================
function initSkillBars() {
    const skillBars = document.querySelectorAll("#skills-section .progress-bar");
    if (!skillBars.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            const bar = entry.target;
            const targetWidth = bar.getAttribute("data-width");

            if (entry.isIntersecting) {
                bar.style.transition = "none";
                bar.style.width = "0%";
                void bar.offsetWidth;
                bar.style.transition = "width 1.2s cubic-bezier(0.65, 0, 0.35, 1)";
                bar.style.width = targetWidth;
            } else {
                bar.style.transition = "none";
                bar.style.width = "0%";
            }
        });
    }, { threshold: 0.15, rootMargin: "0px 0px -50px 0px" });

    skillBars.forEach((bar) => observer.observe(bar));
}


// ==========================================================================
// 4. Timeline Scroll Progress (Education Section)
// ==========================================================================
function initTimelineProgress() {
    const timeline = document.querySelector(".timeline");
    if (!timeline) return;

    window.addEventListener("scroll", () => {
        const rect = timeline.getBoundingClientRect();
        const windowHeight = window.innerHeight;

        const start = windowHeight * 0.8;
        const totalScrollable = rect.height + windowHeight * 0.6;
        const scrolled = start - rect.top;

        let percent = (scrolled / totalScrollable) * 100;
        percent = Math.max(0, Math.min(100, percent));

        timeline.style.setProperty("--line-progress", percent + "%");
    });
}


// ==========================================================================
// Contact Form - Web3Forms Submission
// ==========================================================================
function initContactFormValidation() {
    const form = document.getElementById("contactForm");
    if (!form) return;

    const resultEl = document.getElementById("formResult");
    const submitBtn = form.querySelector("button[type='submit']");
    const btnText = form.querySelector(".btn-text");

    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        // Bootstrap-style validation check
        if (!form.checkValidity()) {
            event.stopPropagation();
            form.classList.add("was-validated");
            return;
        }

        // Disable button while sending
        submitBtn.disabled = true;
        if (btnText) btnText.textContent = "Sending...";

        const formData = new FormData(form);

        try {
            const response = await fetch("https://api.web3forms.com/submit", {
                method: "POST",
                headers: { Accept: "application/json" },
                body: formData
            });

            const data = await response.json();

            if (data.success) {
                resultEl.textContent = "✅ Message sent successfully!";
                resultEl.style.color = "green";
                form.reset();
                form.classList.remove("was-validated");
            } else {
                resultEl.textContent = "❌ Something went wrong. Please try again.";
                resultEl.style.color = "red";
            }
        } catch (error) {
            resultEl.textContent = "❌ Network error. Please try again.";
            resultEl.style.color = "red";
        } finally {
            submitBtn.disabled = false;
            if (btnText) btnText.textContent = "Send Message";
        }
    });
}
