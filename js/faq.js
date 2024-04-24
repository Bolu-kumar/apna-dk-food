
// JSON Data for Food Delivery FAQs
const faqData = [
    {
        question: "What are the delivery hours?",
        answer: "Our delivery hours are from 8:00 AM to 10:00 PM every day.",
    },
    {
        question: "Do you deliver to my area?",
        answer: "We deliver within a 4 km radius from our kitchen location.",
    },
    {
        question: "How long does delivery take?",
        answer: "Delivery usually takes around 30-45 minutes after placing the order.",
    },
    {
        question: "Can I customize my order?",
        answer: "Yes, you can cancel it then re-order again according to your preferences.",
    },
    {
        question: "Is there a minimum order requirement?",
        answer: "We have a minimum order requirement of ₹30 for delivery.",
    },

    {
        question: "How much are the delivery charges?",
        answer: "There is a flat ₹15 delivery charge for all orders."
    },
    {
        "question": "How to place an order?",
        "answer": "To place an order, go to Order Now: <a href='https://rkdktiffin.in/place-order.html'>Click</a>"
    },




];

// Get the container for FAQ items
const faqContainer = document.querySelector('.faqsContent');

// Loop through the FAQ data and create HTML elements for each item
faqData.forEach((faq, index) => {
    const faqItem = document.createElement('div');
    faqItem.innerHTML = `
        <input type="checkbox" id="question${index + 1}" name="q" class="questions">
        <label for="question${index + 1}" class="question border-bottom">${faq.question}</label>
        <div class="answers">${faq.answer}</div>
    `;
    const plusIcon = document.createElement('i');
    plusIcon.classList.add('fas', 'fa-plus', 'mr-2');
    faqItem.querySelector('label').prepend(plusIcon);

    faqContainer.appendChild(faqItem);

    // Add event listener to toggle answer visibility
    const question = faqItem.querySelector('.questions');
    const answer = faqItem.querySelector('.answers');
    question.addEventListener('change', () => {
        answer.style.display = question.checked ? 'block' : 'none';
        if (question.checked) {
            plusIcon.classList.replace('fa-plus', 'fa-minus');
        } else {
            plusIcon.classList.replace('fa-minus', 'fa-plus');
        }
    });
});
