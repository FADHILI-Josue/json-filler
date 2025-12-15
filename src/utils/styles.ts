export function applyStyles(element: HTMLElement, styles:Partial<CSSStyleDeclaration>) {
  for (const property in styles) {
    if (Object.prototype.hasOwnProperty.call(styles, property)) {
      const value = styles[property];
      if (value !== undefined) {
        element.style[property] = value;
      }
    }
  }
}

export function showErrorToast(message: string) {
    const div = document.createElement("div");
    div.textContent = message;

    const toastStyles: Partial<CSSStyleDeclaration> = {
        position: "fixed",
        bottom: "20px",
        right: "20px",
        backgroundColor: "#ff4d4f", 
        color: "white",
        padding: "12px 24px",
        borderRadius: "8px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
        fontSize: "14px",
        fontFamily: "system-ui, -apple-system, sans-serif",
        zIndex: "2147483647",
        opacity: "0",
        transform: "translateY(20px)",
        transition: "all 0.5s ease-in-out",
        pointerEvents: "none"
    };

    applyStyles(div, toastStyles);

    document.body.appendChild(div);

    requestAnimationFrame(() => {
        div.style.opacity = "1";
        div.style.transform = "translateY(0)";
    });

    setTimeout(() => {
        div.style.opacity = "0";
        div.style.transform = "translateY(20px)";

        setTimeout(() => {
            div.remove();
        }, 500); 
    }, 5000);
}