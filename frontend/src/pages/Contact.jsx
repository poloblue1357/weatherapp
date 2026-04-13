import { useState } from "react";
import { ArrowLeft, Send } from "lucide-react";
import { useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";
import emailjs from "@emailjs/browser";

// ── Apple dark tokens ──────────────────────────────────────────
const T = {
    card:       { background: "#1C1C1E" },
    input:      { background: "#2C2C2E", border: "2px solid #38383A", color: "#FFFFFF", borderRadius: 12, padding: "14px 16px", width: "100%", fontSize: 15, outline: "none", boxSizing: "border-box", fontFamily: "-apple-system, BlinkMacSystemFont, sans-serif" },
    inputFocus: { border: "2px solid #0A84FF" },
    label:      { color: "rgba(235,235,245,0.8)", fontSize: 13, fontWeight: 600, marginBottom: 8, display: "block" },
    textSec:    { color: "rgba(235,235,245,0.7)" },
};

function FormInput({ label, type = "text", name, placeholder, value, onChange, multiline, error }) {
    const [focused, setFocused] = useState(false);
    const style = { 
        ...T.input, 
        ...(focused ? T.inputFocus : {}),
        ...(error ? { border: "2px solid #FF453A" } : {})
    };
    return (
        <div style={{ marginBottom: 16 }}>
            <label style={T.label}>{label}</label>
            {multiline
                ? <textarea rows={5} name={name} placeholder={placeholder} value={value} onChange={onChange}
                    onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
                    style={{ ...style, resize: "none" }} />
                : <input type={type} name={name} placeholder={placeholder} value={value} onChange={onChange}
                    onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
                    style={style} />
            }
            {error && (
                <div style={{ color: "#FF453A", fontSize: 12, marginTop: 6, fontWeight: 500 }}>
                    {error}
                </div>
            )}
        </div>
    );
}

function Contact() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ name: "", email: "", message: "" });
    const [submitted, setSubmitted] = useState(false);
    const [errors, setErrors] = useState({ name: "", email: "", message: "" });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors({ ...errors, [name]: "" });
        }
    };

    const validateForm = () => {
        const newErrors = { name: "", email: "", message: "" };
        let isValid = true;

        // Validate name
        if (!formData.name.trim()) {
            newErrors.name = "Name is required";
            isValid = false;
        } else if (formData.name.trim().length < 2) {
            newErrors.name = "Name must be at least 2 characters";
            isValid = false;
        }

        // Validate email
        if (!formData.email.trim()) {
            newErrors.email = "Email is required";
            isValid = false;
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = "Please enter a valid email address";
            isValid = false;
        }

        // Validate message
        if (!formData.message.trim()) {
            newErrors.message = "Message is required";
            isValid = false;
        } else if (formData.message.trim().length < 10) {
            newErrors.message = "Message must be at least 10 characters";
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        emailjs.send(
            import.meta.env.VITE_EMAILJS_SERVICE_ID,
            import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
            { from_name: formData.name, from_email: formData.email, message: formData.message },
            import.meta.env.VITE_EMAILJS_PUBLIC_KEY
        )
        .then(() => {
            setSubmitted(true);
            setFormData({ name: "", email: "", message: "" });
            setErrors({ name: "", email: "", message: "" });
            setTimeout(() => setSubmitted(false), 3000);
        })
        .catch((error) => {
            console.error("Failed to send email:", error);
            alert("Failed to send message. Please try again.");
        });
    };

    return (
        <div style={{ minHeight: "100vh", background: "linear-gradient(to bottom right, #003366, #0A84FF, #64D2FF)", display: "flex", flexDirection: "column", fontFamily: "-apple-system, BlinkMacSystemFont, sans-serif" }}>

            {/* Header */}
            <header style={{ background: "linear-gradient(to right, #003366, #0A84FF)", padding: "16px 20px" }}>
                <div style={{ maxWidth: 448, margin: "0 auto", alignItems: "center" }}>
                    {/* <button
                        onClick={() => navigate("/")}
                        style={{ padding: 8, borderRadius: 8, border: "none", background: "rgba(255,255,255,0.1)", cursor: "pointer", color: "white", display: "flex", alignItems: "center" }}
                    >
                        <ArrowLeft size={22} />
                    </button> */}
                    <h1 style={{ color: "white", fontSize: 18, fontWeight: 600, margin: 0, display: 'flex', justifyContent: 'center', width: '100%' }}>Contact Us</h1>
                    <div style={{ width: 38 }} />
                </div>
            </header>

            <main style={{ flex: 1, padding: "24px 16px 100px", maxWidth: 448, margin: "0 auto", width: "100%", boxSizing: "border-box" }}>

                {/* Success banner */}
                {submitted && (
                    <div style={{ background: "rgba(48,209,88,0.15)", border: "1.5px solid rgba(48,209,88,0.4)", color: "#30D158", padding: "14px 20px", borderRadius: 14, marginBottom: 16, textAlign: "center", fontWeight: 600, fontSize: 14 }}>
                        ✓ Thanks! Your message has been sent.
                    </div>
                )}

                {/* Form card */}
                <div style={{ ...T.card, borderRadius: 20, overflow: "hidden", boxShadow: "0 8px 32px rgba(0,0,0,0.4)" }}>
                    <div style={{ padding: 24 }}>
                        <p style={{ ...T.textSec, textAlign: "center", marginBottom: 24, fontSize: 15, lineHeight: 1.5 }}>
                            Have feedback, questions, or suggestions? We'd love to hear from you!
                        </p>

                        <form onSubmit={handleSubmit}>
                            <FormInput label="Name"    name="name"    placeholder="Your name"                  value={formData.name}    onChange={handleChange} error={errors.name} />
                            <FormInput label="Email"   name="email"   placeholder="your.email@example.com"     value={formData.email}   onChange={handleChange} type="email" error={errors.email} />
                            <FormInput label="Message" name="message" placeholder="Tell us what's on your mind..." value={formData.message} onChange={handleChange} multiline error={errors.message} />

                            <button
                                type="submit"
                                style={{
                                    width: "100%", padding: "14px 0", borderRadius: 12, border: "none",
                                    background: "linear-gradient(to right, #0055AA, #0A84FF)",
                                    color: "white", fontWeight: 700, fontSize: 15, cursor: "pointer",
                                    display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                                    boxShadow: "0 4px 16px rgba(10,132,255,0.3)",
                                }}
                            >
                                <Send size={18} />
                                Send Message
                            </button>
                        </form>
                    </div>
                </div>
            </main>

            <NavBar currentPage="contact" />
        </div>
    );
}

export default Contact;