// script.js 

// EFFET MACHINE À ÉCRIRE

document.addEventListener("DOMContentLoaded", function() {
    const textElement = document.getElementById("typing-text");
    if (textElement) {
        const textToType = "CS Student | Offensive & Defensive Cybersecurity Enthusiast";
        let index = 0;

        function typeText() {
            if (index < textToType.length) {
                textElement.innerHTML += textToType.charAt(index);
                index++;
                setTimeout(typeText, 50);
            }
        }
        
        textElement.innerHTML = "";
        typeText();
    }
});


// AUTO-GÉNÉRATION DES PROJETS 

// PROJECTS
const projectsData = [
    {
        title: "PurpleKEY",
        date: "2026-04-20", 
        team: "blue",
        teamLabel: "[ Blue Team ]",
        tags: ["Python", "PySide6", "Crypto"],
        description: "Local password manager encrypted with AES-256-GCM. Built with a zero-knowledge architecture and Argon2id key derivation.",
        link: "purplekey.html",
        linkText: "Download & Details ->"
    },
    {
        title: "OWASP Security Shepherd - Bug Fix",
        date: "2026-04-02", 
        team: "blue",
        teamLabel: "[ Open Source / AppSec ]",
        tags: ["Java", "Security Tool", "Bug Fix", "OWASP"],
        description: "Contributed to the official OWASP Security Shepherd repository. Identified and resolved a technical bug, enhancing the platform's stability. Pull Request #794 was successfully merged.",
        link: "https://github.com/OWASP/SecurityShepherd/pull/794",
        linkText: "View Pull Request ->"
    },
    {
        title: "Secure Shared Fund App",
        date: "2025-12-17", 
        team: "blue",
        teamLabel: "[ AppSec / Crypto ]",
        tags: ["Python", "Flask", "Shamir's Secret"],
        description: "Client-server application for secure shared funds management. Implemented Shamir's Secret Sharing (k/n) for collective transaction authorization, AES-GCM encryption, and anti-replay mechanisms.",
        link: "https://code.up8.edu/xtokoproust/gestion-cagnotte-commune-securisee",
        linkText: "View Repository ->"
    },
    {
        title: "CyberSecurity Home Lab",
        date: "2025-10-10",
        team: "red",
        teamLabel: "[ Red Team ]",
        tags: ["Bash", "Linux", "VirtualBox"],
        description: "Built an isolated testing environment to analyze vulnerabilities (XSS, SQLi, LFI) and automated reconnaissance scanning using custom Bash scripts.",
        link: "https://github.com/Azarkovich/CyberSecurity-Labs",
        linkText: "View Repository ->"
    },
    {
        title: "TCP Chat Server",
        date: "2024-05-20",
        team: "green",
        teamLabel: "[ Network ]",
        tags: ["Python", "Sockets", "Threading"],
        description: "Developed a client-server chat application from scratch using raw TCP sockets and multithreading for concurrent user management.",
        link: "https://github.com/Azarkovich/Licence-Informatique/tree/master/Projets/Tchat-VF",
        linkText: "View Source ->"
    },
    {
        title: "Ecosystem Simulator",
        date: "2023-11-05",
        team: "green",
        teamLabel: "[ Software ]",
        tags: ["C++", "OOP", "Algorithms"],
        description: "Engineered a complex simulation engine relying on object-oriented principles to manage entity interaction rules and lifecycle algorithms.",
        link: "https://github.com/Azarkovich/Licence-Informatique/tree/master/Projets/Ecosystem",
        linkText: "View Source ->"
    }
];

// WRITEUPS 
const writeupsData = [
    {
        title: "THM: IronShade CTF",
        date: "2026-05-02",
        team: "blue",
        teamLabel: "[ Blue Team ]",
        tags: ["Incident Response", "Linux Logs", "Forensics"],
        description: "Investigation of a compromised Linux machine. Analyzed Nmap results, identified a backdoor user ('mircoservice') hidden in root cronjobs, and parsed auth.log to uncover a malicious package.",
        link: "viewer.html?file=blue-team/ironshade.md",
        linkText: "Read Write-up ->"
    },
    {
        title: "Alert Triage — Nmap Network Scan Detection",
        date: "2026-03-07",
        team: "blue",
        teamLabel: "[ Blue Team ]",
        tags: ["SOC Analysis", "Splunk", "Windows Logs"],
        description: "Investigated suspicious network traffic to detect and triage unauthorized Nmap scanning activity. Analyzed logs data to identify stealth scan signatures (SYN, UDP) and documented IOCs for defensive rule creation.",
        link: "viewer.html?file=blue-team/alert-triage-nmap.md",
        linkText: "Read Write-up ->"
    },
    {
        title: "THM: Valenfind CTF",
        date: "2026-02-20",
        team: "red",
        teamLabel: "[ Red Team ]",
        tags: ["CTF", "LFI", "Web"],
        description: "Exploited a Local File Inclusion (LFI) vulnerability discovered through exposed developer comments. Bypassed null-byte restrictions to extract the Flask source code, revealing a hardcoded Admin API key used to dump the SQLite database.",
        link: "viewer.html?file=valenfind/valenfind.md",
        linkText: "Read Write-up ->"
    },
    {
        title: "THM: Biblioteca CTF",
        date: "2026-02-15",
        team: "red",
        teamLabel: "[ Red Team ]",
        tags: ["CTF", "SQLi", "PrivEsc"],
        description: "End-to-end compromise of a Linux machine. Exploited an authentication bypass via SQLi, performed lateral movement, and achieved root via Python library hijacking using sudo SETENV.",
        link: "viewer.html?file=biblioteca/biblioteca.md",
        linkText: "Read Write-up ->"
    },
    {
        title: "SQL Injection Analysis",
        date: "2026-02-08",
        team: "red",
        teamLabel: "[ Red Team ]",
        tags: ["Web Security", "SQLi", "DVWA"],
        description: "From Error-Based to Blind Exploitation. Analyzed vulnerability root causes and bypassed logic using Boolean, UNION-based, and Time-Based payloads.",
        link: "viewer.html?file=SQLinjection-low.md",
        linkText: "Read Write-up ->"
    },
    {
        title: "Cross-Site Scripting Analysis",
        date: "2026-01-10",
        team: "red",
        teamLabel: "[ Red Team ]",
        tags: ["Web Security", "XSS", "DVWA"],
        description: "From injection to real impact. Explored Reflected, Stored, and DOM vulnerabilities, session exposure, and mitigations like CSP and HttpOnly cookies.",
        link: "viewer.html?file=xss-dvwa.md",
        linkText: "Read Write-up ->"
    }
];



// MOTEUR DE GÉNÉRATION DES GRILLES
function generateGrid(data, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return; 

    // Tri des éléments par date 
    data.sort((a, b) => new Date(b.date) - new Date(a.date));

    const today = new Date();
    const thirtyDaysInMs = 30 * 24 * 60 * 60 * 1000;
    let htmlContent = '';

    data.forEach(item => {
        // Logique "NEW"
        const itemDate = new Date(item.date);
        const isNew = (today - itemDate) < thirtyDaysInMs;
        const newBadgeHtml = isNew ? `<span class="badge-new">NEW</span>` : '';

        // Formatage de la date pour l'affichage (ex: "2026-04-20")
        const dateHtml = `<span class="card-date">[ ${item.date} ]</span>`;

        // Gestion du style CSS selon la team
        let badgeHtml = '';
        if (item.team === 'red') {
            badgeHtml = `<div class="team-badge team-red"><span class="circle red"></span> ${item.teamLabel}</div>`;
        } else if (item.team === 'blue') {
            badgeHtml = `<div class="team-badge team-blue"><span class="circle blue"></span> ${item.teamLabel}</div>`;
        } else {
            badgeHtml = `<div class="team-badge team-green" style="color: #50fa7b; margin-bottom: 15px; font-size: 0.8rem; font-family: 'Fira Code', monospace;"><span class="circle" style="background-color: #50fa7b; box-shadow: 0 0 8px rgba(80, 250, 123, 0.6); display: inline-block; width: 10px; height: 10px; border-radius: 50%; margin-right: 8px;"></span> ${item.teamLabel}</div>`;
        }

        const tagsHtml = item.tags.map(tag => `<span class="tag">${tag}</span>`).join('');
        const targetAttr = item.link.startsWith('http') ? 'target="_blank"' : '';

        // Construction de la carte avec la date
        htmlContent += `
            <article class="card">
                ${dateHtml}
                ${badgeHtml}
                <h3>${item.title} ${newBadgeHtml}</h3>
                <div class="tags">
                    ${tagsHtml}
                </div>
                <p>${item.description}</p>
                <a href="${item.link}" class="btn-link" ${targetAttr}>${item.linkText}</a>
            </article>
        `;
    });

    container.innerHTML = htmlContent;
}


// INITIALISATION AU CHARGEMENT
document.addEventListener('DOMContentLoaded', () => {
    generateGrid(projectsData, 'projects-container');
    generateGrid(writeupsData, 'writeups-container');
});