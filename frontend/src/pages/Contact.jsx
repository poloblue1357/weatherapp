import { useState } from "react";

function Contact() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        message: "",
    });
    const [submitted, setSubmitted] = useState(false); // track submission

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(formData); // or send to API
        setSubmitted(true);     // show thank you message
        setFormData({ name: "", email: "", message: "" }); // reset form
    };

    return (
        <div className="max-w-2xl mx-auto p-6 flex flex-col gap-6">
            <h1 className="text-3xl font-bold text-center">Contact Us</h1>

            {/* Conditional thank you message */}
            {submitted && (
                <p className="text-green-600 text-center">
                Thanks! Your message has been sent.
                </p>
            )}

            <p className="text-center text-gray-700">
                Have feedback, questions, or suggestions about the Weather App?  
                Fill out the form below and we’ll get back to you!
            </p>

            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                <input
                type="text"
                name="name"
                placeholder="Name"
                value={formData.name}
                onChange={handleChange}
                className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <textarea
                name="message"
                placeholder="Message"
                value={formData.message}
                onChange={handleChange}
                rows={4}
                className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                ></textarea>
                <button
                type="submit"
                className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition"
                >
                Send
                </button>
            </form>
        </div>
    );
}

export default Contact;
