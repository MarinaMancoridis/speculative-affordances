export function startTypewriter(elementId, text, speed = 45) {
    const el = document.getElementById(elementId);
    let index = 0;

    function typeChar() {
        if (index < text.length) {
            el.textContent += text.charAt(index);
            index++;
            setTimeout(typeChar, speed);
        }
    }

    typeChar();
}