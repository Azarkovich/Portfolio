// script.js 

// EFFET MACHINE À ÉCRIRE

document.addEventListener("DOMContentLoaded", function () {
    const textElement = document.getElementById("typing-text");
    if (!textElement) return;
 
    const texts = {
        en: "CS Student | Offensive & Defensive Cybersecurity Enthusiast",
        fr: "Étudiant en Informatique | Passionné de Cybersécurité Offensive & Défensive"
    };
 
    let typingTimer = null;
 
    function startTyping() {
        const lang   = (typeof getLang === 'function') ? getLang() : 'en';
        const target = texts[lang] || texts.en;
        let index    = 0;
 
        textElement.innerHTML = "";
        clearTimeout(typingTimer);
 
        function type() {
            if (index < target.length) {
                textElement.innerHTML += target.charAt(index);
                index++;
                typingTimer = setTimeout(type, 50);
            }
        }
        type();
    }
 
    // Expose restart hook for i18n.js toggle
    window._restartTyping = startTyping;
 
    startTyping();
});


// AUTO-GÉNÉRATION DES PROJETS 

// PROJECTS
const projectsData = [
    {
        title: "PurpleKEY",
        date: "2026-04-20",
        team: "blue",
        teamLabel:    "[ Project ]",
        teamLabel_fr: "[ Projet ]",
        tags: ["Python", "PySide6", "Crypto"],
        description:    "Local password manager encrypted with AES-256-GCM. Built with a zero-knowledge architecture and Argon2id key derivation.",
        description_fr: "Gestionnaire de mots de passe local chiffré avec AES-256-GCM. Conçu avec une architecture zéro-connaissance et une dérivation de clé Argon2id.",
        link: "purplekey.html",
        linkText:    "Download & Details ->",
        linkText_fr: "Télécharger & Détails ->"
    },
    {
        title: "OWASP Security Shepherd — Bug Fix",
        date: "2026-04-02",
        team: "blue",
        teamLabel:    "[ Open Source / AppSec ]",
        teamLabel_fr: "[ Open Source / AppSec ]",
        tags: ["Java", "Security Tool", "Bug Fix", "OWASP"],
        description:    "Contributed to the official OWASP Security Shepherd repository. Identified and resolved a technical bug, enhancing the platform's stability. Pull Request #794 was successfully merged.",
        description_fr: "Contribution au dépôt officiel OWASP Security Shepherd. Identification et résolution d'un bug technique améliorant la stabilité de la plateforme. Pull Request #794 fusionnée avec succès.",
        link: "https://github.com/OWASP/SecurityShepherd/pull/794",
        linkText:    "View Pull Request ->",
        linkText_fr: "Voir la Pull Request ->"
    },
    {
        title: "Secure Shared Fund App",
        date: "2025-12-17",
        team: "blue",
        teamLabel:    "[ AppSec / Crypto ]",
        teamLabel_fr: "[ AppSec / Crypto ]",
        tags: ["Python", "Flask", "Shamir's Secret"],
        description:    "Client-server application for secure shared funds management. Implemented Shamir's Secret Sharing (k/n) for collective transaction authorization, AES-GCM encryption, and anti-replay mechanisms.",
        description_fr: "Application client-serveur pour la gestion sécurisée d'une cagnotte partagée. Implémentation du partage de secret de Shamir (k/n) pour l'autorisation collective des transactions, chiffrement AES-GCM et mécanismes anti-rejeu.",
        link: "https://code.up8.edu/xtokoproust/gestion-cagnotte-commune-securisee",
        linkText:    "View Repository ->",
        linkText_fr: "Voir le Dépôt ->"
    },
    {
        title: "CyberSecurity Home Lab",
        date: "2025-10-10",
        team: "red",
        teamLabel:    "[ Red Team ]",
        teamLabel_fr: "[ Red Team ]",
        tags: ["Bash", "Linux", "VirtualBox"],
        description:    "Built an isolated testing environment to analyze vulnerabilities (XSS, SQLi, LFI) and automated reconnaissance scanning using custom Bash scripts.",
        description_fr: "Construction d'un environnement de test isolé pour analyser les vulnérabilités (XSS, SQLi, LFI) et automatisation de la reconnaissance via des scripts Bash personnalisés.",
        link: "https://github.com/Azarkovich/CyberSecurity-Labs",
        linkText:    "View Repository ->",
        linkText_fr: "Voir le Dépôt ->"
    },
    {
        title: "TCP Chat Server",
        date: "2024-05-20",
        team: "green",
        teamLabel:    "[ Network ]",
        teamLabel_fr: "[ Réseau ]",
        tags: ["Python", "Sockets", "Threading"],
        description:    "Developed a client-server chat application from scratch using raw TCP sockets and multithreading for concurrent user management.",
        description_fr: "Développement d'une application de tchat client-serveur from scratch avec des sockets TCP bruts et du multithreading pour la gestion concurrente des utilisateurs.",
        link: "https://github.com/Azarkovich/Licence-Informatique/tree/master/Projets/Tchat-VF",
        linkText:    "View Source ->",
        linkText_fr: "Voir le Code ->"
    },
    {
        title: "Ecosystem Simulator",
        date: "2023-11-05",
        team: "green",
        teamLabel:    "[ Software ]",
        teamLabel_fr: "[ Logiciel ]",
        tags: ["C++", "OOP", "Algorithms"],
        description:    "Engineered a complex simulation engine relying on object-oriented principles to manage entity interaction rules and lifecycle algorithms.",
        description_fr: "Développement d'un moteur de simulation complexe basé sur les principes de la POO pour gérer les règles d'interaction entre entités et les algorithmes de cycle de vie.",
        link: "https://github.com/Azarkovich/Licence-Informatique/tree/master/Projets/Ecosystem",
        linkText:    "View Source ->",
        linkText_fr: "Voir le Code ->"
    }
];


// WRITEUPS 
const writeupsData = [
    {
        title: "THM: IronShade CTF",
        date: "2026-05-02",
        team: "blue",
        teamLabel:    "[ Blue Team ]",
        teamLabel_fr: "[ Blue Team ]",
        tags: ["Incident Response", "Linux Logs", "Forensics"],
        description:    "Investigation of a compromised Linux machine. Analyzed Nmap results, identified a backdoor user ('mircoservice') hidden in root cronjobs, and parsed auth.log to uncover a malicious package.",
        description_fr: "Investigation d'une machine Linux compromise. Analyse des résultats Nmap, identification d'un utilisateur backdoor ('mircoservice') caché dans les cronjobs root, et parsing de auth.log pour découvrir un paquet malveillant.",
        link: "viewer.html?file=ironshade/ironshade.md",
        linkText:    "Read Write-up ->",
        linkText_fr: "Lire le Writeup ->"
    },
    {
        title: "Alert Triage — Nmap Network Scan Detection",
        date: "2026-03-07",
        team: "blue",
        teamLabel:    "[ Blue Team ]",
        teamLabel_fr: "[ Blue Team ]",
        tags: ["SOC Analysis", "Splunk", "Windows Logs"],
        description:    "Investigated suspicious network traffic to detect and triage unauthorized Nmap scanning activity. Analyzed logs data to identify stealth scan signatures (SYN, UDP) and documented IOCs for defensive rule creation.",
        description_fr: "Investigation du trafic réseau suspect pour détecter une activité de scan Nmap non autorisée. Analyse des logs pour identifier les signatures de scan furtif (SYN, UDP) et documentation des IOCs pour la création de règles défensives.",
        link: "viewer.html?file=blue-team/alert-triage-nmap.md",
        linkText:    "Read Write-up ->",
        linkText_fr: "Lire le Writeup ->"
    },
    {
        title: "THM: Valenfind CTF",
        date: "2026-02-20",
        team: "red",
        teamLabel:    "[ Red Team ]",
        teamLabel_fr: "[ Red Team ]",
        tags: ["CTF", "LFI", "Web"],
        description:    "Exploited a Local File Inclusion (LFI) vulnerability discovered through exposed developer comments. Bypassed null-byte restrictions to extract the Flask source code, revealing a hardcoded Admin API key used to dump the SQLite database.",
        description_fr: "Exploitation d'une vulnérabilité LFI découverte via des commentaires développeur exposés. Contournement des restrictions null-byte pour extraire le code source Flask, révélant une clé API Admin codée en dur utilisée pour dumper la base SQLite.",
        link: "viewer.html?file=valenfind/valenfind.md",
        linkText:    "Read Write-up ->",
        linkText_fr: "Lire le Writeup ->"
    },
    {
        title: "THM: Biblioteca CTF",
        date: "2026-02-15",
        team: "red",
        teamLabel:    "[ Red Team ]",
        teamLabel_fr: "[ Red Team ]",
        tags: ["CTF", "SQLi", "PrivEsc"],
        description:    "End-to-end compromise of a Linux machine. Exploited an authentication bypass via SQLi, performed lateral movement, and achieved root via Python library hijacking using sudo SETENV.",
        description_fr: "Compromission complète d'une machine Linux. Exploitation d'un bypass d'authentification via SQLi, mouvement latéral, et élévation de privilèges via détournement de bibliothèque Python avec sudo SETENV.",
        link: "viewer.html?file=biblioteca/biblioteca.md",
        linkText:    "Read Write-up ->",
        linkText_fr: "Lire le Writeup ->"
    },
    {
        title: "SQL Injection Analysis",
        date: "2026-02-08",
        team: "red",
        teamLabel:    "[ Red Team ]",
        teamLabel_fr: "[ Red Team ]",
        tags: ["Web Security", "SQLi", "DVWA"],
        description:    "From Error-Based to Blind Exploitation. Analyzed vulnerability root causes and bypassed logic using Boolean, UNION-based, and Time-Based payloads.",
        description_fr: "De l'exploitation Error-Based à la Blind SQLi. Analyse des causes racines de la vulnérabilité et contournement de la logique avec des payloads Boolean, UNION-based et Time-Based.",
        link: "viewer.html?file=SQLinjection-low.md",
        linkText:    "Read Write-up ->",
        linkText_fr: "Lire le Writeup ->"
    },
    {
        title: "Cross-Site Scripting Analysis",
        date: "2026-01-10",
        team: "red",
        teamLabel:    "[ Red Team ]",
        teamLabel_fr: "[ Red Team ]",
        tags: ["Web Security", "XSS", "DVWA"],
        description:    "From injection to real impact. Explored Reflected, Stored, and DOM vulnerabilities, session exposure, and mitigations like CSP and HttpOnly cookies.",
        description_fr: "De l'injection à l'impact réel. Exploration des vulnérabilités Reflected, Stored et DOM, exposition de session, et contre-mesures comme la CSP et les cookies HttpOnly.",
        link: "viewer.html?file=xss-dvwa.md",
        linkText:    "Read Write-up ->",
        linkText_fr: "Lire le Writeup ->"
    }
];



// MOTEUR DE GÉNÉRATION DES GRILLES
function generateGrid(data, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
 
    const lang = (typeof getLang === 'function') ? getLang() : 'en';
    const isFr = lang === 'fr';
 
    data.sort((a, b) => new Date(b.date) - new Date(a.date));
 
    const today         = new Date();
    const thirtyDaysMs  = 30 * 24 * 60 * 60 * 1000;
    let html            = '';
 
    data.forEach(item => {
        const isNew      = (today - new Date(item.date)) < thirtyDaysMs;
        const newBadge   = isNew ? `<span class="badge-new">NEW</span>` : '';
        const dateHtml   = `<span class="card-date">[ ${item.date} ]</span>`;
 
        const label = isFr ? (item.teamLabel_fr || item.teamLabel) : item.teamLabel;
        const desc  = isFr ? (item.description_fr || item.description) : item.description;
        const link  = isFr ? (item.linkText_fr || item.linkText) : item.linkText;
 
        let badgeHtml = '';
        if (item.team === 'red') {
            badgeHtml = `<div class="team-badge team-red"><span class="circle red"></span> ${label}</div>`;
        } else if (item.team === 'blue') {
            badgeHtml = `<div class="team-badge team-blue"><span class="circle blue"></span> ${label}</div>`;
        } else {
            badgeHtml = `<div class="team-badge team-green" style="color:#50fa7b;margin-bottom:15px;font-size:0.8rem;font-family:'Fira Code',monospace;">
                <span class="circle" style="background-color:#50fa7b;box-shadow:0 0 8px rgba(80,250,123,0.6);display:inline-block;width:10px;height:10px;border-radius:50%;margin-right:8px;"></span>
                ${label}
            </div>`;
        }
 
        const tagsHtml   = item.tags.map(tag => `<span class="tag">${tag}</span>`).join('');
        const targetAttr = item.link.startsWith('http') ? 'target="_blank"' : '';
 
        html += `
            <article class="card">
                ${dateHtml}
                ${badgeHtml}
                <h3>${item.title} ${newBadge}</h3>
                <div class="tags">${tagsHtml}</div>
                <p>${desc}</p>
                <a href="${item.link}" class="btn-link" ${targetAttr}>${link}</a>
            </article>
        `;
    });
 
    container.innerHTML = html;
}


// INITIALISATION AU CHARGEMENT
document.addEventListener('DOMContentLoaded', () => {
    generateGrid(projectsData, 'projects-container');
    generateGrid(writeupsData, 'writeups-container');
});
