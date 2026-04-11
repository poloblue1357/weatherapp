import { useState } from 'react'
import { postExitData } from '../api/exitAPI'

function ExitSubmit() {

        const [showForm, setShowForm] = useState(false)
        const [visible, setVisible] = useState('')
        const [fading, setFading] = useState('')
        const [error, setError] = useState()
        const [success, setSuccess] = useState()
        const [loading, setLoading] = useState(false)
        const initialFormState = {
            telephone: '', // 
            website: '', // 
            city: '', // 
            country: '', //
            lat: '', // 
            lon: '', // 
            name: '', // 
            email: '', // 
            zip: '', // 
            state: '', // 
            source: 'user',
        }
        const [formData, setFormData] = useState(initialFormState);

    const changeShowForm = () => {
        setShowForm(prev => !prev)
        // console.log(showForm)
    }
        
    const handleForm = (e) => {
        const { name, value } = e.target;

        setFormData(prev => ({
            ...prev,
            [name]: typeof value === 'string' ? value.trim() : value
        }));
    }

    const formSubmit = async(e) => {
        e.preventDefault()

        setError(null)
        setSuccess(false)
        setLoading(true)
        
        const errors = formValidation(formData);

        if (errors.length > 0) {
            setError(errors)
            setLoading(false)
            return;
        }

        try {

            formValidation(formData)

            const response = await postExitData(formData)

            if(response) {
                setSuccess(true)

                setVisible(true);
                setFading(false);
                setFormData(initialFormState)
        
                setTimeout(() => {
                    setFading(true); // start fade
                }, 4000);
        
                setTimeout(() => {
                    setVisible(false); // remove after fade
                }, 5000);
            }
        }
        catch (error) {
            console.log('error message: ',error.message)
            setError(error.message || 'Something went wrong')
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

    return (
        <div>
            {/* exit / dz input form  */}
            <button
                style={{background: 'white', border: '1px solid black', margin: "2px", padding: '5px', width: '145px'}}
                onClick={changeShowForm}
            >
                {showForm ? 'Hide' : 'Submit a DZ / Exit'}
            </button>


            <span style={{color: 'white'}}>* required fields</span>
            <br />
            
            {showForm && 
                <form 
                    onSubmit={formSubmit}
                    style={{paddingBottom: '0px'}}
                >
                    {error && (
                        <ul style={{ color: 'red', fontSize: '16px', margin: '4px' }}>
                            {error.map((msg, idx) => (
                                <li key={idx}>{msg}</li>
                            ))}
                        </ul>
                    )}
                    <input 
                        placeholder="* DZ / Exit Name"
                        name='name'
                        value={formData.name}
                        onChange={handleForm}
                        style={{padding: '10px', border: '1px solid black', margin: '5px', background: 'white'}}
                    />
                    <input 
                        placeholder="* Latitude"
                        name='lat'
                        value={formData.lat}
                        onChange={handleForm}
                        style={{padding: '10px', border: '1px solid black', margin: '5px', background: 'white'}}
                    />
                    <input 
                        placeholder="* Longitude"
                        name='lon'
                        value={formData.lon}
                        onChange={handleForm}
                        style={{padding: '10px', border: '1px solid black', margin: '5px', background: 'white'}}
                    />
                    <input 
                        placeholder="City"
                        name='city'
                        value={formData.city}
                        onChange={handleForm}
                        style={{padding: '10px', border: '1px solid black', margin: '5px', background: 'white'}}
                    />
                    <input 
                        placeholder="State / Province"
                        name='state'
                        value={formData.state}
                        onChange={handleForm}
                        style={{padding: '10px', border: '1px solid black', margin: '5px', background: 'white'}}
                    />
                    <input 
                        placeholder="Country"
                        name='country'
                        value={formData.country}
                        onChange={handleForm}
                        style={{padding: '10px', border: '1px solid black', margin: '5px', background: 'white'}}
                    />
                    <input 
                        placeholder="Postal Code"
                        name='zip'
                        value={formData.zip}
                        onChange={handleForm}
                        style={{padding: '10px', border: '1px solid black', margin: '5px', background: 'white'}}
                    />
                    <input 
                        placeholder="Email"
                        name='email'
                        value={formData.email}
                        onChange={handleForm}
                        style={{padding: '10px', border: '1px solid black', margin: '5px', background: 'white'}}
                    />
                    <input 
                        placeholder="Website"
                        name='website'
                        value={formData.website}
                        onChange={handleForm}
                        style={{padding: '10px', border: '1px solid black', margin: '5px', background: 'white'}}
                    />
                    <input 
                        placeholder="Telephone"
                        name='telephone'
                        value={formData.telephone}
                        onChange={handleForm}
                        style={{padding: '10px', border: '1px solid black', margin: '5px', background: 'white'}}
                    />
                    <button
                        style={{padding: '10px', border: '1px solid black', margin: '5px', background: 'white'}}
                        type="submit"
                        disabled={loading}
                    >
                        {loading ? 'Submitting…' : 'Submit the DZ / Exit Information'}
                    </button>
                    {/* notice the submission was received + fading out */}
                    {visible && success && (
                        <div style={{opacity: fading ? 0 : 1, transition: "opacity 1s ease", color: 'white', fontSize: '14px'}}>
                            Submission received!
                        </div>
                    )}
                </form>
            }
        </div>
    )
}

export default ExitSubmit