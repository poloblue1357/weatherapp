import { useState } from "react";
import { ArrowLeft, Send } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import NavBar from '../components/NavBar';
import { EmailJSResponseStatus } from "@emailjs/browser";
import emailjs from "@emailjs/browser"

function Contact() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        message: "",
    });
    const [submitted, setSubmitted] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        emailjs.send(
            import.meta.env.VITE_EMAILJS_SERVICE_ID, 
            import.meta.env.VITE_EMAILJS_TEMPLATE_ID, 
            {
                from_name: formData.name,
                from_email: formData.email,
                message: formData.message,
            },
            import.meta.env.VITE_EMAILJS_PUBLIC_KEY 
        )
        .then(() => {
            setSubmitted(true)
            setFormData({ name: "", email: "", message: ""})
            setTimeout(() => setSubmitted(false), 3000)
        })
        .catch((error) => {
            console.error('Failed to send email:', error)
            alert(`Failed to send message. Please try again.`)
        })
    };

    return (
        <div className="min-h-screen bg-linear-to-b from-gray-50 to-gray-100 flex flex-col">
        <header className="bg-linear-to-r from-blue-600 to-blue-700 text-white p-4 shadow-lg">
            <div className="flex items-center justify-between max-w-md mx-auto">
            <button
                onClick={() => navigate('/')}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
                <ArrowLeft className="w-6 h-6" />
            </button>
            <h1 className="text-xl font-semibold tracking-wide">Contact Us</h1>
            <div className="w-10"></div>
            </div>
        </header>

        <main className="flex-1 p-6 pb-24 max-w-md mx-auto w-full">
            {submitted && (
            <div className="bg-green-50 border-2 border-green-500 text-green-700 p-4 rounded-2xl mb-6 text-center font-semibold">
                ✓ Thanks! Your message has been sent.
            </div>
            )}

            <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
            <p className="text-gray-700 text-center mb-6">
                Have feedback, questions, or suggestions? We'd love to hear from you!
            </p>

            <form className="space-y-4" onSubmit={handleSubmit}>
                <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Name
                </label>
                <input
                    type="text"
                    name="name"
                    placeholder="Your name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full p-4 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 transition-colors"
                />
                </div>

                <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email
                </label>
                <input
                    type="email"
                    name="email"
                    placeholder="your.email@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full p-4 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 transition-colors"
                />
                </div>

                <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Message
                </label>
                <textarea
                    name="message"
                    placeholder="Tell us what's on your mind..."
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    className="w-full p-4 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 transition-colors resize-none"
                ></textarea>
                </div>

                <button
                type="submit"
                className="w-full bg-linear-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-4 rounded-xl transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                >
                <Send className="w-5 h-5" />
                Send Message
                </button>
            </form>
            </div>
        </main>

        <NavBar currentPage="contact" />
        </div>
    );
}

export default Contact;
