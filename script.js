// script.js 

const textToType = "CS Student | Offensive & Defensive Cybersecurity Enthusiast";

const typingElement = document.getElementById('typing-text');

const typingSpeed = 50; 

let charIndex = 0;

function typeWriter() {
    if (charIndex < textToType.length) {
        typingElement.textContent += textToType.charAt(charIndex);
        charIndex++;
        
        setTimeout(typeWriter, typingSpeed);
    }
}

window.onload = typeWriter;