// =========================================================
// Hussain Zia: portfolio interactions
// =========================================================

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// ---------- Footer year ----------
$("#year").textContent = new Date().getFullYear();

// ---------- Mobile menu ----------
const toggle = $(".nav-toggle");
const menu = $("#navMenu");

function setMenu(open) {
    menu.classList.toggle("open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
}

toggle.addEventListener("click", () => setMenu(!menu.classList.contains("open")));
$$("#navMenu a").forEach((link) => link.addEventListener("click", () => setMenu(false)));
document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") setMenu(false);
});

// ---------- Navbar border + active link while scrolling ----------
const nav = $(".nav");
const sections = $$("main section[id]");
const navLinks = $$("#navMenu a");

function onScroll() {
    nav.classList.toggle("scrolled", window.scrollY > 10);
    const offset = window.scrollY + 140;
    let current = "";
    sections.forEach((section) => {
        if (section.offsetTop <= offset) current = section.id;
    });
    navLinks.forEach((link) => link.classList.toggle("active", link.getAttribute("href") === `#${current}`));
}

window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

// ---------- Rotating focus words in the hero ----------
const words = ["Embedded Systems", "Robotics", "Mechatronics", "Intelligent Automation"];
const rotator = $("#rotator");

if (!reduceMotion) {
    let wordIndex = 0;
    let charIndex = words[0].length;
    let deleting = true;

    const tick = () => {
        const word = words[wordIndex];
        charIndex += deleting ? -1 : 1;
        rotator.textContent = word.slice(0, charIndex);

        let delay = deleting ? 45 : 85;
        if (!deleting && charIndex === word.length) {
            deleting = true;
            delay = 1800;
        } else if (deleting && charIndex === 0) {
            deleting = false;
            wordIndex = (wordIndex + 1) % words.length;
            delay = 300;
        }
        setTimeout(tick, delay);
    };
    setTimeout(tick, 2000);
}

// ---------- Digital business card ----------
const card = $("#bizCard");

function flipCard() {
    const flipped = card.classList.toggle("flipped");
    card.setAttribute("aria-pressed", String(flipped));
}

card.addEventListener("click", flipCard);
$("#flipCard").addEventListener("click", flipCard);

// Builds a contact file (vCard) that phones and email apps can import
$("#saveContact").addEventListener("click", () => {
    const vcard = [
        "BEGIN:VCARD",
        "VERSION:3.0",
        "N:Zia;Hussain;;;",
        "FN:Hussain Zia",
        "TITLE:Mechatronics Engineering Student",
        "EMAIL;TYPE=INTERNET:hussainzia1847h@gmail.com",
        "ADR;TYPE=HOME:;;;Karachi;;;Pakistan",
        "URL:https://hussainzia.github.io/",
        "X-SOCIALPROFILE;TYPE=linkedin:https://www.linkedin.com/in/hussain-zia-24470a265",
        "X-SOCIALPROFILE;TYPE=github:https://github.com/hussainzia",
        "NOTE:LinkedIn: linkedin.com/in/hussain-zia-24470a265 | GitHub: github.com/hussainzia",
        "END:VCARD",
    ].join("\r\n");

    const url = URL.createObjectURL(new Blob([vcard], { type: "text/vcard" }));
    const link = Object.assign(document.createElement("a"), { href: url, download: "Hussain-Zia.vcf" });
    document.body.append(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
});

// ---------- Reveal sections as they scroll into view ----------
const revealItems = $$(".reveal");

if ("IntersectionObserver" in window && !reduceMotion) {
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("visible");
                    observer.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.12 }
    );
    revealItems.forEach((item) => observer.observe(item));
} else {
    revealItems.forEach((item) => item.classList.add("visible"));
}
