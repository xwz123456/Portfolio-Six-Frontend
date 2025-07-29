export function initFAQ() {
    const questions = document.querySelectorAll(".faq-item .question");

    questions.forEach((questionEl) => {
        questionEl.addEventListener("click", () => {
            const faqItem = questionEl.closest(".faq-item");
            const answer = faqItem.querySelector(".answer");
            const isActive = faqItem.classList.contains("active");

            if (isActive) {
                answer.style.maxHeight = answer.scrollHeight + "px";
                requestAnimationFrame(() => {
                    answer.style.maxHeight = "0px";
                    answer.style.paddingTop = "0";
                    answer.style.paddingBottom = "0";
                    answer.style.opacity = "0";
                    faqItem.classList.remove("active");
                });
            } else {
                faqItem.classList.add("active");
                answer.style.maxHeight = answer.scrollHeight + "px";
                answer.style.opacity = "1";
            }
        });
    });
}
