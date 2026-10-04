const themeToggle = document.querySelector(".theme-toggle");
const themeIcon = document.querySelector(".theme-icon");
const contactForm = document.querySelector("#contact-form");
const formStatus = document.querySelector(".form-status");
const assistantForm = document.querySelector("#assistant-form");
const assistantInput = document.querySelector("#assistant-input");
const assistantMessages = document.querySelector("#assistant-messages");
const promptButtons = document.querySelectorAll("[data-question]");
const terminalForm = document.querySelector("#terminal-form");
const terminalInput = document.querySelector("#terminal-input");
const terminalOutput = document.querySelector("#terminal-output");
const terminalPath = document.querySelector("#terminal-path");
const terminalHintButtons = document.querySelectorAll(".terminal-hints [data-command]");

themeToggle.addEventListener("click", () => {
  const isDark = document.body.classList.toggle("dark-theme");
  themeIcon.textContent = isDark ? "☾" : "☼";
  themeToggle.setAttribute("aria-label", isDark ? "Switch to light theme" : "Switch to dark theme");
});

contactForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const name = document.querySelector("#name").value.trim();
  formStatus.textContent = `Thanks, ${name || "there"}! Your message is ready to send.`;
  contactForm.reset();
});

const assistantResponses = [
  {
    keywords: ["who", "sayandeep", "about", "yourself"],
    answer: "Sayandeep Sinha is a software engineer and full-stack developer focused on scalable applications, cloud-native systems, and thoughtful product experiences. He is open to remote opportunities and meaningful collaborations."
  },
  {
    keywords: ["stack", "technology", "technologies", "tools", "use", "skills"],
    answer: "His toolkit includes Python, JavaScript, Go, Java, React, Node.js, Docker, GCP, PostgreSQL, Redis, Linux, and Git. He is currently exploring Kubernetes, system design, and AI agents."
  },
  {
    keywords: ["varta", "platform", "community"],
    answer: "Varta Platform is a positive community platform backed by a powerful Go service. It is one of Sayandeep’s featured full-stack projects."
  },
  {
    keywords: ["habit", "tracker", "friends", "social"],
    answer: "Habit Tracker Web is a social productivity project designed to help people build consistency by sharing habits with friends."
  },
  {
    keywords: ["music", "musiclov", "electron", "streaming"],
    answer: "MusicLov is an ad-free music streaming desktop experience built with Electron and React."
  },
  {
    keywords: ["learn", "learning", "currently", "focus", "interests"],
    answer: "Sayandeep is currently curious about Kubernetes, system design, cloud architecture, AI agents, open source, and building resilient distributed systems."
  },
  {
    keywords: ["contact", "email", "hire", "reach", "connect"],
    answer: "You can reach Sayandeep at sayandeepx4@gmail.com, connect on LinkedIn, or explore his work on github.com/sayandeepsinha."
  }
];

function getAssistantAnswer(question) {
  const normalizedQuestion = question.toLowerCase();
  const match = assistantResponses
    .map((item) => ({ item, score: item.keywords.filter((keyword) => normalizedQuestion.includes(keyword)).length }))
    .sort((a, b) => b.score - a.score)[0];

  return match && match.score > 0
    ? match.item.answer
    : "I’m grounded in Sayandeep’s portfolio, so I can answer about his background, stack, projects, learning goals, and contact details. Try one of the suggested questions.";
}

function addAssistantMessage(text, type) {
  const message = document.createElement("div");
  message.className = `assistant-message assistant-message-${type}`;
  message.innerHTML = `<span class="message-label">${type === "bot" ? "AI" : "YOU"}</span><p></p>`;
  message.querySelector("p").textContent = text;
  assistantMessages.append(message);
  assistantMessages.scrollTop = assistantMessages.scrollHeight;
}

function askAssistant(question) {
  const cleanQuestion = question.trim();
  if (!cleanQuestion) return;
  addAssistantMessage(cleanQuestion, "user");
  window.setTimeout(() => addAssistantMessage(getAssistantAnswer(cleanQuestion), "bot"), 260);
}

assistantForm.addEventListener("submit", (event) => {
  event.preventDefault();
  askAssistant(assistantInput.value);
  assistantInput.value = "";
  assistantInput.focus();
});

promptButtons.forEach((button) => {
  button.addEventListener("click", () => {
    assistantInput.value = button.dataset.question;
    assistantForm.requestSubmit();
  });
});

const terminalFiles = {
  "about.md": [
    "Sayandeep Sinha — Software Engineer & Full-stack Developer",
    "",
    "I build scalable applications and cloud-native systems.",
    "Currently exploring Kubernetes, system design, AI agents, and",
    "better ways to make complex software feel simple."
  ],
  "stack.txt": [
    "languages  Python · JavaScript · Go · Java",
    "frontend   React · HTML · CSS",
    "backend    Node.js · Go services",
    "data       PostgreSQL · Redis · MongoDB · SQL",
    "infra      Docker · GCP · Linux · Nginx · Git"
  ],
  "projects.json": [
    "{",
    '  "Varta Platform": "Go backend + positive community platform",',
    '  "Habit Tracker": "Share habits with friends",',
    '  "MusicLov": "Ad-free Electron + React music player"',
    "}"
  ]
};
const terminalDirectories = {
  "~": ["about.md", "stack.txt", "projects.json", "projects/"],
  "~/projects": ["Varta-Platform/", "HabitTrackerWeb/", "MusicLov/"],
  "~/projects/Varta-Platform": ["README.md", "stack.txt", "status", "open"],
  "~/projects/HabitTrackerWeb": ["README.md", "stack.txt", "status", "open"],
  "~/projects/MusicLov": ["README.md", "stack.txt", "status", "open"]
};
const projectFiles = {
  "~/projects/Varta-Platform": {
    "README.md": ["# Varta Platform", "", "A positive new platform with a powerful Go backend.", "Built to make community interactions feel useful and encouraging."],
    "stack.txt": ["Go · TypeScript · API design · PostgreSQL"],
    status: ["active development", "backend: Go service", "focus: scalable community features"],
    open: "https://github.com/sayandeepsinha/Varta-Platform"
  },
  "~/projects/HabitTrackerWeb": {
    "README.md": ["# Habit Tracker Web", "", "A simple habit tracker for sharing progress with friends.", "Small feedback loops make consistency easier to build."],
    "stack.txt": ["TypeScript · React · Web platform · Social features"],
    status: ["prototype shipped", "focus: social accountability", "focus: clear daily interactions"],
    open: "https://github.com/sayandeepsinha/HabitTrackerWeb"
  },
  "~/projects/MusicLov": {
    "README.md": ["# MusicLov", "", "An ad-free music streaming platform for desktop.", "A focused Electron + React experience for uninterrupted listening."],
    "stack.txt": ["JavaScript · React · Electron · Desktop"],
    status: ["explorable project", "runtime: Electron desktop app", "focus: distraction-free playback"],
    open: "https://github.com/sayandeepsinha/MusicLov"
  }
};
let currentTerminalPath = "~";
let terminalHistory = [];
let terminalHistoryIndex = 0;

function printTerminal(lines, className = "", animate = false) {
  lines.forEach((line, index) => {
    const element = document.createElement("div");
    element.className = `terminal-line ${className}${animate ? " terminal-line-enter" : ""}`;
    element.textContent = line;
    terminalOutput.append(element);
    if (animate) element.style.setProperty("--line-delay", `${index * 55}ms`);
  });
  terminalOutput.scrollTop = terminalOutput.scrollHeight;
}

function runTerminalCommand(rawCommand) {
  const command = rawCommand.trim();
  if (!command) return;
  printTerminal([`sayandeep@studio:${currentTerminalPath}$ ${command}`], "terminal-muted");
  const [verb, ...argumentParts] = command.split(/\s+/);
  const argument = argumentParts.join(" ");

  if (verb === "clear") {
    terminalOutput.innerHTML = "";
    return;
  }
  if (verb === "help") {
    printTerminal([
      "Available commands:",
      "  about       quick profile summary",
      "  cat <file>  read about.md, stack.txt, projects.json",
      "  cd projects enter the project directory",
      "  cd <project> enter Varta, Habit Tracker, or MusicLov",
      "  contact     show contact links",
      "  github      open Sayandeep's GitHub",
      "  ls          list the current directory",
      "  pwd         print the current directory",
      "  whoami      print the developer behind the terminal",
      "  status      show project status inside a project folder",
      "  open        open the current project on GitHub",
      "  clear       clear the terminal"
    ]);
    return;
  }
  if (verb === "ls") {
    printTerminal(terminalDirectories[currentTerminalPath] || [], "terminal-link");
    return;
  }
  if (verb === "pwd") {
    printTerminal([`/home/sayandeep/${currentTerminalPath === "~" ? "" : currentTerminalPath.slice(2)}`]);
    return;
  }
  if (verb === "whoami") {
    printTerminal(["sayandeep — software engineer, full-stack builder, lifelong learner"]);
    return;
  }
  if (verb === "about") {
    printTerminal(["Sayandeep builds scalable applications, cloud-native systems, and useful products.", "Try: cat about.md"]);
    return;
  }
  if (verb === "contact") {
    printTerminal(["email   sayandeepx4@gmail.com", "github  github.com/sayandeepsinha", "linkedin linkedin.com/in/sayandeep-sinha/"], "terminal-link");
    return;
  }
  if (verb === "github") {
    printTerminal(["Opening github.com/sayandeepsinha ..."], "terminal-link");
    window.open("https://github.com/sayandeepsinha", "_blank", "noopener,noreferrer");
    return;
  }
  if (verb === "cd") {
    if (argument === "projects" && currentTerminalPath === "~") {
      currentTerminalPath = "~/projects";
      terminalPath.textContent = currentTerminalPath;
      printTerminal(["entered ~/projects", "Try: ls"], "terminal-link");
    } else if (argument === ".." && currentTerminalPath.startsWith("~/projects/")) {
      currentTerminalPath = "~/projects";
      terminalPath.textContent = currentTerminalPath;
      printTerminal(["returned to ~/projects"], "terminal-link");
    } else if (argument === ".." && currentTerminalPath === "~/projects") {
      currentTerminalPath = "~";
      terminalPath.textContent = currentTerminalPath;
      printTerminal(["returned to ~"], "terminal-link");
    } else if (currentTerminalPath === "~/projects" && projectFiles[`~/projects/${argument}`]) {
      currentTerminalPath = `~/projects/${argument}`;
      terminalPath.textContent = currentTerminalPath;
      printTerminal([`entered ${currentTerminalPath}`, "Try: ls or cat README.md"], "terminal-link", true);
    } else {
      printTerminal([`cd: no such directory: ${argument || "(empty)"}`], "terminal-error");
    }
    return;
  }
  if (verb === "cat") {
    const scopedFiles = projectFiles[currentTerminalPath];
    if (scopedFiles?.[argument] && Array.isArray(scopedFiles[argument])) printTerminal(scopedFiles[argument], "", true);
    else if (terminalFiles[argument]) printTerminal(terminalFiles[argument], "", true);
    else printTerminal([`cat: ${argument || "(empty)"}: file not found`, "Try: ls"], "terminal-error");
    return;
  }
  if (verb === "status" && projectFiles[currentTerminalPath]) {
    printTerminal(projectFiles[currentTerminalPath].status, "terminal-link", true);
    return;
  }
  if (verb === "open" && projectFiles[currentTerminalPath]) {
    printTerminal(["Opening repository in a new tab ..."], "terminal-link");
    window.open(projectFiles[currentTerminalPath].open, "_blank", "noopener,noreferrer");
    return;
  }
  printTerminal([`${verb}: command not found`, "Try: help"], "terminal-error");
}

terminalForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const command = terminalInput.value;
  if (!command.trim()) return;
  terminalHistory.push(command);
  terminalHistoryIndex = terminalHistory.length;
  runTerminalCommand(command);
  terminalInput.value = "";
});

terminalInput.addEventListener("keydown", (event) => {
  if (event.key === "ArrowUp") {
    event.preventDefault();
    terminalHistoryIndex = Math.max(0, terminalHistoryIndex - 1);
    terminalInput.value = terminalHistory[terminalHistoryIndex] || "";
  }
  if (event.key === "ArrowDown") {
    event.preventDefault();
    terminalHistoryIndex = Math.min(terminalHistory.length, terminalHistoryIndex + 1);
    terminalInput.value = terminalHistory[terminalHistoryIndex] || "";
  }
  if (event.key === "Tab") {
    event.preventDefault();
    const options = currentTerminalPath === "~/projects"
      ? ["Varta-Platform", "HabitTrackerWeb", "MusicLov"]
      : ["help", "ls", "cat", "cd", "status", "open", "contact", "github"];
    const matches = options.filter((option) => option.toLowerCase().startsWith(terminalInput.value.toLowerCase()));
    if (matches.length === 1) terminalInput.value = matches[0];
  }
});

terminalHintButtons.forEach((button) => {
  button.addEventListener("click", () => {
    terminalInput.value = button.dataset.command;
    terminalForm.requestSubmit();
    terminalInput.focus();
  });
});

const motionQuery = window.matchMedia("(pointer: fine) and (prefers-reduced-motion: no-preference)");
if (motionQuery.matches) {
  document.querySelectorAll(".hero-art, .assistant-section").forEach((surface) => {
    surface.addEventListener("pointermove", (event) => {
      const bounds = surface.getBoundingClientRect();
      const x = (event.clientX - bounds.left) / bounds.width - 0.5;
      const y = (event.clientY - bounds.top) / bounds.height - 0.5;
      surface.style.transform = `translate(${x * 5}px, ${y * 5}px)${surface.classList.contains("hero-art") ? " rotate(2deg)" : ""}`;
    });
    surface.addEventListener("pointerleave", () => {
      surface.style.transform = surface.classList.contains("hero-art") ? "rotate(2deg)" : "";
    });
  });
}
if (!motionQuery.matches) {
  document.querySelectorAll(".hero-art, .assistant-section").forEach((surface) => {
    surface.style.transform = surface.classList.contains("hero-art") ? "none" : "";
  });
}

const motionTargets = document.querySelectorAll(
  ".reveal-on-scroll, .intro-strip, .resume-section, .principles-section, .assistant-section, .contact-section, .project-card, .stack-list span"
);
motionTargets.forEach((element, index) => {
  element.classList.add("motion-target");
  element.style.setProperty("--motion-delay", `${Math.min(index % 6, 5) * 80}ms`);
});

const revealElements = document.querySelectorAll(".motion-target");
const showAllMotionTargets = () => revealElements.forEach((element) => element.classList.add("is-visible"));
let lastScrollY = window.scrollY;
let scrollDirection = "down";
let directionFrame;

const updateScrollDirection = () => {
  const currentScrollY = window.scrollY;
  if (Math.abs(currentScrollY - lastScrollY) > 2) {
    scrollDirection = currentScrollY < lastScrollY ? "up" : "down";
    lastScrollY = currentScrollY;
  }
  directionFrame = undefined;
};

window.addEventListener("scroll", () => {
  if (directionFrame === undefined) directionFrame = window.requestAnimationFrame(updateScrollDirection);
}, { passive: true });

if ("IntersectionObserver" in window && revealElements.length && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.toggle("motion-reverse", scrollDirection === "up");
        entry.target.classList.add("is-visible");
      } else {
        entry.target.classList.remove("motion-reverse");
        entry.target.classList.remove("is-visible");
      }
    });
  }, { threshold: 0, rootMargin: "0px" });
  revealElements.forEach((element) => revealObserver.observe(element));
} else {
  showAllMotionTargets();
}
document.addEventListener("visibilitychange", () => {
  document.body.classList.toggle("page-hidden", document.hidden);
});

const systemDetails = [
  "Interfaces should make the next action obvious.",
  "APIs should make the right thing easy to call.",
  "Services should fail clearly and recover gracefully.",
  "Data should be durable, observable, and useful."
];
const systemDetail = document.querySelector("#system-detail");
const systemNodes = [...document.querySelectorAll(".system-node")];
let selectedSystemIndex = 0;
let systemCycleTimer;

const selectSystemNode = (index) => {
  selectedSystemIndex = index;
  systemNodes.forEach((item, itemIndex) => item.classList.toggle("is-selected", itemIndex === index));
  systemDetail.style.opacity = "0";
  window.setTimeout(() => {
    systemDetail.textContent = systemDetails[index];
    systemDetail.style.opacity = "1";
  }, 125);
};

systemNodes.forEach((node, index) => {
  node.addEventListener("click", () => {
    selectSystemNode(index);
    window.clearInterval(systemCycleTimer);
    systemCycleTimer = window.setInterval(() => {
      selectSystemNode((selectedSystemIndex + 1) % systemNodes.length);
    }, 1500);
  });
});

systemCycleTimer = window.setInterval(() => {
  selectSystemNode((selectedSystemIndex + 1) % systemNodes.length);
}, 1500);
