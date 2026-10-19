document.addEventListener('DOMContentLoaded', () => {
    const textElement = document.getElementById('typing-text');
    if (textElement) {
        const text = "Мы создаем будущее с помощью кода.";
        let i = 0;
        function typeWriter() {
            if (i < text.length) {
                textElement.innerHTML += text.charAt(i);
                i++;
                setTimeout(typeWriter, 50);
            }
        }
        setTimeout(typeWriter, 500);
    }
});