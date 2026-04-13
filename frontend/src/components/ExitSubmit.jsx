import { useState } from 'react'
import { postExitData } from '../api/exitAPI'

function ExitSubmit() {
    const [visible, setVisible] = useState(false)
    const [fading, setFading] = useState(false)
    const [error, setError] = useState([])
    const [success, setSuccess] = useState(false)
    const [loading, setLoading] = useState(false)
    const [focusedField, setFocusedField] = useState('')
   
    const initialFormState = {
        telephone: '',
        website: '',
        city: '',
        country: '',
        lat: '',
        lon: '',
        name: '',
        email: '',
        zip: '',
        state: '',
        source: 'user',
    }
    const [formData, setFormData] = useState(initialFormState);

    const handleForm = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    }

    const formSubmit = async(e) => {
        e.preventDefault()
        setError([])
        setSuccess(false)
        setLoading(true)
       
        const errors = formValidation(formData);

        if (errors.length > 0) {
            setError(errors)
            setLoading(false)
            return;
        }

        try {
            const response = await postExitData(formData)

            if(response) {
                setSuccess(true)
                setVisible(true);
                setFading(false);
                setFormData(initialFormState)
       
                setTimeout(() => {
                    setFading(true);
                }, 9000);
       
                setTimeout(() => {
                    setVisible(false);
                }, 10000);
            }
        }
        catch (error) {
            console.log('error message: ',error.message)
            setError([error.message || 'Something went wrong'])
        } finally {
            setLoading(false)
        }
    }

    const formValidation = (formData) => {
        const formErrors = [];

        const name = formData.name?.trim() ?? '';
        const city = formData.city?.trim() ?? '';
        const state = formData.state?.trim() ?? '';
        const country = formData.country?.trim() ?? '';
        const zip = formData.zip?.trim() ?? '';
        const email = formData.email?.trim() ?? '';
        const telephone = formData.telephone?.trim() ?? '';
        const website = formData.website?.trim() ?? '';

        const postalRegex = /^[A-Za-z0-9\s\-]{3,10}$/;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneRegex = /^[+()0-9-\s]{7,20}$/;
        const websiteRegex = /^https?:\/\/.+\..+/i;

        // REQUIRED
        if (!name) formErrors.push("DZ / Exit name isn't valid");

        if (formData.lat === '') {
            formErrors.push("Latitude value isn't valid");
        }

        if (formData.lon === '') {
            formErrors.push("Longitude value isn't valid");
        }

        const lat = Number(formData.lat);
        const lon = Number(formData.lon);

        if (formData.lat !== '' && (isNaN(lat) || lat < -90 || lat > 90)) {
            formErrors.push("Latitude value isn't valid");
        }

        if (formData.lon !== '' && (isNaN(lon) || lon < -180 || lon > 180)) {
            formErrors.push("Longitude value isn't valid");
        }

        // OPTIONAL
        if (city && city.length < 2) {
            formErrors.push("City value isn't valid");
        }

        if (state && state.length < 2) {
            formErrors.push("State / Province isn't valid");
        }

        if (country && country.length < 2) {
            formErrors.push("Country value isn't valid");
        }

        if (zip && !postalRegex.test(zip)) {
            formErrors.push("Postal code isn't valid");
        }

        if (email && !emailRegex.test(email)) {
            formErrors.push("Email isn't valid");
        }

        if (telephone && !phoneRegex.test(telephone)) {
            formErrors.push("Telephone isn't valid");
        }

        if (website && !websiteRegex.test(website)) {
            formErrors.push("Website URL isn't valid");
        }

        return formErrors;
    };

    const inputStyle = (fieldName) => ({
        background: '#2C2C2E',
        border: focusedField === fieldName ? '2px solid #0A84FF' : '2px solid #38383A',
        color: '#FFFFFF',
        borderRadius: '12px',
        padding: '14px 16px',
        fontSize: '15px',
        outline: 'none',
        transition: 'border-color 0.2s'
    });

    return (
        <div>
            {/* Instructional Subheader */}
            <div style={{
                background: 'rgba(255,255,255,0.12)',
                borderLeft: '3px solid #0A84FF',
                borderRadius: '8px',
                padding: '12px 16px',
                marginBottom: '16px'
            }}>
                <p style={{ color: 'white', fontSize: '16px', margin: 0, lineHeight: '1.5', fontWeight: "bold" }}>
                    Can't find your spot? Add it here to help other jumpers.
                </p>
            </div>

            <form onSubmit={formSubmit}>
                {/* Required Fields Section */}
                <div style={{ background: 'rgba(255,255,255,0.08)', borderRadius: '12px', padding: '16px', marginBottom: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                        <h3 style={{ color: 'white', fontSize: '15px', fontWeight: '600', margin: 0 }}>DZ / Exit Information</h3>
                        <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '12px' }}>* required</span>
                    </div>
                   
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <input
                            type="text"
                            name="name"
                            placeholder="* DZ / Exit Name"
                            value={formData.name}
                            onChange={handleForm}
                            onFocus={() => setFocusedField('name')}
                            onBlur={() => setFocusedField('')}
                            style={inputStyle('name')}
                        />

                        <input
                            type="text"
                            name="lat"
                            placeholder="* Latitude"
                            value={formData.lat}
                            onChange={handleForm}
                            onFocus={() => setFocusedField('lat')}
                            onBlur={() => setFocusedField('')}
                            style={inputStyle('lat')}
                        />

                        <input
                            type="text"
                            name="lon"
                            placeholder="* Longitude"
                            value={formData.lon}
                            onChange={handleForm}
                            onFocus={() => setFocusedField('lon')}
                            onBlur={() => setFocusedField('')}
                            style={inputStyle('lon')}
                        />
                    </div>
                </div>

                {/* Additional Details Section */}
                <div style={{ background: 'rgba(255,255,255,0.08)', borderRadius: '12px', padding: '16px', marginBottom: '16px' }}>
                    <h3 style={{ color: 'white', fontSize: '15px', fontWeight: '600', margin: '0 0 12px 0' }}>Additional Details</h3>
                   
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <input
                            type="text"
                            name="city"
                            placeholder="City"
                            value={formData.city}
                            onChange={handleForm}
                            onFocus={() => setFocusedField('city')}
                            onBlur={() => setFocusedField('')}
                            style={inputStyle('city')}
                        />

                        <input
                            type="text"
                            name="state"
                            placeholder="State / Province"
                            value={formData.state}
                            onChange={handleForm}
                            onFocus={() => setFocusedField('state')}
                            onBlur={() => setFocusedField('')}
                            style={inputStyle('state')}
                        />

                        <input
                            type="text"
                            name="zip"
                            placeholder="Postal Code"
                            value={formData.zip}
                            onChange={handleForm}
                            onFocus={() => setFocusedField('zip')}
                            onBlur={() => setFocusedField('')}
                            style={inputStyle('zip')}
                        />

                        <input
                            type="text"
                            name="country"
                            placeholder="Country"
                            value={formData.country}
                            onChange={handleForm}
                            onFocus={() => setFocusedField('country')}
                            onBlur={() => setFocusedField('')}
                            style={inputStyle('country')}
                        />

                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={formData.email}
                            onChange={handleForm}
                            onFocus={() => setFocusedField('email')}
                            onBlur={() => setFocusedField('')}
                            style={inputStyle('email')}
                        />

                        <input
                            type="tel"
                            name="telephone"
                            placeholder="Telephone"
                            value={formData.telephone}
                            onChange={handleForm}
                            onFocus={() => setFocusedField('telephone')}
                            onBlur={() => setFocusedField('')}
                            style={inputStyle('telephone')}
                        />

                        <input
                            type="text"
                            name="website"
                            placeholder="Website"
                            value={formData.website}
                            onChange={handleForm}
                            onFocus={() => setFocusedField('website')}
                            onBlur={() => setFocusedField('')}
                            style={inputStyle('website')}
                        />
                    </div>
                </div>

                {/* Error list - ABOVE BUTTON */}
                {error.length > 0 && (
                    <ul style={{
                        background: 'rgba(220, 38, 38, 0.35)',
                        border: '2px solid rgba(220, 38, 38, 0.7)',
                        borderRadius: '12px',
                        padding: '12px 16px 12px 32px',
                        margin: '0 0 16px',
                        color: '#FCA5A5',
                        fontSize: '14px',
                        lineHeight: '1.6',
                        fontWeight: '600'
                    }}>
                        {error.map((msg, idx) => (
                            <li key={idx}>{msg}</li>
                        ))}
                    </ul>
                )}

                {/* Success message - ABOVE BUTTON */}
                {visible && success && (
                    <div style={{
                        opacity: fading ? 0 : 1,
                        transition: "opacity 1s ease",
                        background: 'rgba(34, 197, 94, 0.35)',
                        border: '2px solid rgba(34, 197, 94, 0.7)',
                        borderRadius: '12px',
                        padding: '14px 20px',
                        margin: '0 0 16px',
                        color: '#86EFAC',
                        fontSize: '14px',
                        fontWeight: '600',
                        textAlign: 'center'
                    }}>
                        ✓ Submission received!
                    </div>
                )}

                {/* Submit Button - Gray text */}
                <button
                    type="submit"
                    disabled={loading}
                    style={{
                        background: '#2C2C2E',
                        color: 'rgba(235,235,245,0.6)',
                        border: '2px solid #38383A',
                        borderRadius: '12px',
                        padding: '16px',
                        fontSize: '16px',
                        fontWeight: '700',
                        cursor: 'pointer',
                        width: '100%',
                        transition: 'border-color 0.2s'
                    }}
                    onMouseEnter={(e) => e.target.style.borderColor = '#0A84FF'}
                    onMouseLeave={(e) => e.target.style.borderColor = '#38383A'}
                >
                    {loading ? 'Submitting…' : 'Submit the DZ / Exit Info'}
                </button>
            </form>
        </div>
    )
}

export default ExitSubmit