// i18n.js — Système de traduction

const I18N = {
    en: {
        // Navbar
        'nav.home':             '[ ./Home ]',
        'nav.projects':         '[ ./Projects & Writeups ]',
        'nav.github':           '[ ./GitHub ]',
        'nav.resume':           '[ ./Resume.pdf ]',
        'nav.writeups':         '[ ./Writeups ]',
        'nav.contact':          '[ ./Contact ]',
        'nav.source':           '[ ./Source_Code ]',
        'nav.lang':             '🇫🇷 FR',

        // Index — Section & buttons
        'section.projects':     '[ ./Projects_&_Writeups ]',
        'btn.all_projects':     '[ ls -la ./All_Projects ] ➢',
        'btn.all_writeups':     '[ ls -la ./All_Writeups ] ➢',
        'btn.download':         'Download & Details ->',
        'btn.read_writeup':     'Read Write-up ->',
        'btn.return':           '← Return to Archive',

        // Index — Static card descriptions (homepage)
        'card.purplekey.desc':  'Local password manager encrypted with AES-256-GCM. Built with a zero-knowledge architecture and a custom PySide6 interface.',
        'card.xss.desc':        'Deep dive into Cross-Site Scripting mechanics. Analyzed injection vectors, exploitation scenarios, and implemented secure coding mitigations.',
        'card.nmap.desc':       'Investigated suspicious network traffic to detect unauthorized Nmap scanning. Analyzed logs to identify stealth scan signatures (SYN, UDP) and documented IOCs.',

        // Archive pages
        'archive.projects.title':   '[ ~/archive/projects ]',
        'archive.projects.desc':    'A collection of my software development, system architecture, and cybersecurity lab environments.',
        'archive.writeups.title':   '[ ~/archive/writeups ]',
        'archive.writeups.desc':    'A collection of my security research, covering both red team vulnerability exploitation and blue team defensive analysis.',

        // Viewer
        'viewer.loading':       '[ Fetching data stream... ]',

        // PurpleKEY page
        'pk.subtitle':          'Local, encrypted, and open-source password manager. Built with a zero-knowledge architecture for absolute security. Your data never leaves your machine.',

        // Security Specs card
        'pk.spec.enc':          'Encryption: AES-256-GCM',
        'pk.spec.kdf':          'Key Derivation: Argon2id (64MB, 3 iter)',
        'pk.spec.storage':      'Storage: Binary CBOR or SQLite',
        'pk.spec.integrity':    'Integrity: GCM Tag (No hash stored)',
        'pk.spec.strength':     'Strength Estimation: zxcvbn',

        // Features card
        'pk.feat.zerokno':      'Zero-Knowledge Architecture',
        'pk.feat.generator':    'Generator (Random / Passphrase)',
        'pk.feat.favorites':    'Favorites System',
        'pk.feat.search':       'Real-time encrypted search',
        'pk.feat.local':        '100% Local, Offline & Open Source',

        // Installation Notes
        'pk.install.p':         'As an independent open-source application, PurpleKEY is not signed with expensive developer certificates. Your OS might display a security warning on the first launch.',
        'pk.win.title':         'Windows (SmartScreen):',
        'pk.win.desc':          'Click "More info" then "Run anyway".',
        'pk.mac.title':         'macOS (Gatekeeper):',
        'pk.mac.desc':          'Open your terminal and type:',
        'pk.warning':           '<strong>Warning:</strong> The source code is fully auditable on GitHub. Make sure to choose a strong master password: <u>it is cryptographically impossible to recover your data if forgotten.</u>',
    },
    fr: {
        // Navbar
        'nav.home':             '[ ./Accueil ]',
        'nav.projects':         '[ ./Projets & Writeups ]',
        'nav.github':           '[ ./GitHub ]',
        'nav.resume':           '[ ./CV.pdf ]',
        'nav.writeups':         '[ ./Writeups ]',
        'nav.contact':          '[ ./Contact ]',
        'nav.source':           '[ ./Code_Source ]',
        'nav.lang':             '🇬🇧 EN',

        // Index — Section & buttons
        'section.projects':     '[ ./Projets_&_Writeups ]',
        'btn.all_projects':     '[ ls -la ./Tous_les_Projets ] ➢',
        'btn.all_writeups':     '[ ls -la ./Tous_les_Writeups ] ➢',
        'btn.download':         'Télécharger & Détails ->',
        'btn.read_writeup':     'Lire le Writeup ->',
        'btn.return':           '← Retour aux Archives',

        // Index — Static card descriptions (homepage)
        'card.purplekey.desc':  'Gestionnaire de mots de passe local chiffré avec AES-256-GCM. Conçu avec une architecture zéro-connaissance et une interface PySide6.',
        'card.xss.desc':        'Plongée dans les mécanismes du Cross-Site Scripting. Analyse des vecteurs d\'injection, des scénarios d\'exploitation, et implémentation de contre-mesures.',
        'card.nmap.desc':       'Investigation du trafic réseau suspect pour détecter un scan Nmap non autorisé. Analyse des logs pour identifier les signatures furtives (SYN, UDP) et documentation des IOCs.',

        // Archive pages
        'archive.projects.title':   '[ ~/archive/projets ]',
        'archive.projects.desc':    'Une collection de mes projets en développement logiciel, architecture système et environnements de cybersécurité.',
        'archive.writeups.title':   '[ ~/archive/writeups ]',
        'archive.writeups.desc':    'Une collection de mes recherches en sécurité, couvrant l\'exploitation offensive (red team) et l\'analyse défensive (blue team).',

        // Viewer
        'viewer.loading':       '[ Chargement du flux de données... ]',

        // PurpleKEY page
        'pk.subtitle':          'Gestionnaire de mots de passe local, chiffré et open-source. Conçu avec une architecture zéro-connaissance pour une sécurité absolue. Vos données ne quittent jamais votre machine.',

        // Security Specs card
        'pk.spec.enc':          'Chiffrement : AES-256-GCM',
        'pk.spec.kdf':          'Dérivation de clé : Argon2id (64 Mo, 3 iter)',
        'pk.spec.storage':      'Stockage : CBOR binaire ou SQLite',
        'pk.spec.integrity':    'Intégrité : Tag GCM (aucun hash stocké)',
        'pk.spec.strength':     'Estimation de robustesse : zxcvbn',

        // Features card
        'pk.feat.zerokno':      'Architecture Zéro-Connaissance',
        'pk.feat.generator':    'Générateur (Aléatoire / Passphrase)',
        'pk.feat.favorites':    'Système de Favoris',
        'pk.feat.search':       'Recherche chiffrée en temps réel',
        'pk.feat.local':        '100% Local, Hors ligne & Open Source',

        // Installation Notes
        'pk.install.p':         'En tant qu\'application open-source indépendante, PurpleKEY n\'est pas signée avec des certificats développeur coûteux. Votre OS peut afficher un avertissement de sécurité au premier lancement.',
        'pk.win.title':         'Windows (SmartScreen) :',
        'pk.win.desc':          'Cliquez sur « Plus d\'informations » puis « Exécuter quand même ».',
        'pk.mac.title':         'macOS (Gatekeeper) :',
        'pk.mac.desc':          'Ouvrez votre terminal et saisissez :',
        'pk.warning':           '<strong>Attention :</strong> Le code source est entièrement auditable sur GitHub. Choisissez un mot de passe maître robuste : <u>il est cryptographiquement impossible de récupérer vos données en cas d\'oubli.</u>',
    }
};

// ─── Helpers ────────────────────────────────────────────────────────────────

function getLang() {
    return localStorage.getItem('lang') || 'en';
}

function t(key) {
    const lang = getLang();
    return I18N[lang][key] ?? I18N['en'][key] ?? key;
}

// ─── DOM update ─────────────────────────────────────────────────────────────

function applyTranslations() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        const val = t(key);
        if (val) el.innerHTML = val;
    });

    const btn = document.getElementById('lang-toggle');
    if (btn) btn.textContent = t('nav.lang');

    document.documentElement.lang = getLang();
}

// ─── Toggle ─────────────────────────────────────────────────────────────────

function toggleLang() {
    const next = getLang() === 'en' ? 'fr' : 'en';
    localStorage.setItem('lang', next);
    applyTranslations();

    // Relance l'animation de frappe si on est sur la homepage
    const typingEl = document.getElementById('typing-text');
    if (typingEl && window._restartTyping) {
        window._restartTyping();
    }

    // Régénère les grilles dynamiques si présentes
    if (typeof generateGrid === 'function') {
        if (document.getElementById('projects-container'))
            generateGrid(projectsData, 'projects-container');
        if (document.getElementById('writeups-container'))
            generateGrid(writeupsData, 'writeups-container');
    }
}

// ─── Inject button into navbar ───────────────────────────────────────────────

function injectLangToggle() {
    const navLinks = document.querySelector('.nav-links');
    if (!navLinks) return;

    const li  = document.createElement('li');
    const btn = document.createElement('button');
    btn.id        = 'lang-toggle';
    btn.textContent = t('nav.lang');
    btn.onclick   = toggleLang;
    btn.style.cssText = [
        'background: transparent',
        'border: 1px solid var(--border-color)',
        'color: var(--text-color)',
        'font-family: var(--font-mono)',
        'font-size: 0.85rem',
        'cursor: pointer',
        'padding: 3px 10px',
        'border-radius: 4px',
        'transition: all 0.2s ease',
    ].join(';');

    btn.addEventListener('mouseenter', () => {
        btn.style.borderColor = 'var(--accent-color)';
        btn.style.color       = 'var(--accent-color)';
    });
    btn.addEventListener('mouseleave', () => {
        btn.style.borderColor = 'var(--border-color)';
        btn.style.color       = 'var(--text-color)';
    });

    li.appendChild(btn);
    navLinks.appendChild(li);
}

// ─── Init ────────────────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
    injectLangToggle();
    applyTranslations();
});