document.addEventListener("DOMContentLoaded", () => {
    const iframes = document.querySelectorAll("iframe");

    // Fallback: si no hay IntersectionObserver, no se hace nada (cargan normal)
    if (!("IntersectionObserver" in window)) return;

    // Se guarda el src original y se vacia para que no carguen aún
    iframes.forEach(iframe => {
        const realSrc = iframe.getAttribute("src");
        if (!realSrc) return;

        iframe.dataset.realSrc = realSrc;
        iframe.removeAttribute("src");

        // Estilos para el fade
        iframe.style.opacity = "0";
        iframe.style.transform = "translateY(20px)";
        iframe.style.transition = "opacity 2s ease, transform 2s ease";
        iframe.style.willChange = "opacity, transform";
    });

    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;

            const iframe = entry.target;
            const realSrc = iframe.dataset.realSrc;
            if (!realSrc) return;

            // Se restaura el src original tal cual lo dio Apple Music
            iframe.setAttribute("src", realSrc);

            // Cuando termine de cargar, se hace fade-in
            const mostrar = () => {
                iframe.style.opacity = "1";
                iframe.style.transform = "translateY(0)";
            };

            iframe.addEventListener("load", mostrar, { once: true });

            // Respaldo por si el load no dispara (sandbox de Apple a veces)
            setTimeout(mostrar, 1200);

            obs.unobserve(iframe);
        });
    }, {
        rootMargin: "300px 0px", // precarga 300px antes de que aparezca
        threshold: 0.01
    });

    iframes.forEach(iframe => observer.observe(iframe));
});