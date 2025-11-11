import { initializeApp, getApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-analytics.js";
import { getFirestore, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBx6b8eyKalgJ82q_29mb0qE3HFqIKEGhw",
    authDomain: "mechconnect-a0943.firebaseapp.com",
    projectId: "mechconnect-a0943",
    storageBucket: "mechconnect-a0943.appspot.com",
    messagingSenderId: "980876516289",
    appId: "1:980876516289:web:2294db73905ce4875a6d40",
    measurementId: "G-CT2PZGDB7L"
};

// Initialize Firebase
let app;
try {
    app = getApp();
} catch {
    app = initializeApp(firebaseConfig);
}
const analytics = getAnalytics(app);
const db = getFirestore(app);

console.log("✅ Firebase connected successfully!");

// Contact form handling
document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.getElementById("contactForm");
    const sendBtn = document.getElementById("sendBtn");
    const statusSpan = document.getElementById("formStatus");

    if (contactForm) {
        contactForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            statusSpan.textContent = "";

            const name = document.getElementById("name").value.trim();
            const email = document.getElementById("email").value.trim();
            const phone = document.getElementById("phone").value.trim();
            const message = document.getElementById("message").value.trim();

            if (!name || !email || !message) {
                statusSpan.style.color = "crimson";
                statusSpan.textContent = "Please fill name, email and message.";
                return;
            }

            try {
                sendBtn.disabled = true;
                sendBtn.textContent = "Sending...";

                await addDoc(collection(db, "contacts"), {
                    name, 
                    email, 
                    phone: phone || null, 
                    message,
                    createdAt: serverTimestamp()
                });

                // use primary brand color for success message
                statusSpan.style.color = "var(--primary-color)";
                statusSpan.textContent = "Message sent! Thank you.";
                contactForm.reset();
            } catch (err) {
                console.error("Firestore write failed:", err);
                statusSpan.style.color = "crimson";
                statusSpan.textContent = `Error: ${err.message}`;
            } finally {
                sendBtn.disabled = false;
                sendBtn.textContent = "Send Message";
                setTimeout(() => { statusSpan.textContent = ""; }, 5000);
            }
        });
    }
});