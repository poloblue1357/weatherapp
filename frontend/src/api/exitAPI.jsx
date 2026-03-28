

export const fetchExitData = async(location) => {

    // Use localhost if running on your machine (dev), otherwise use the Render URL from .env
    const API_URL = window.location.hostname === 'localhost'
        ? 'http://localhost:8000'
        : import.meta.env.VITE_API_URL

    const url = `${API_URL}/api/exits?location=${encodeURIComponent(location || '')}`

    try {
        const response = await fetch(url)
        if(!response.ok) {
            const errText = await response.text()
            console.error('API error response:', errText)
            throw new Error(`HTTP ${response.status}: ${errText}`)
        }
        const jsonData = await response.json()
        console.log('jsonData: ', jsonData)
        return jsonData
    } catch (error) {
        console.error('Fetch failed:', error)
        return null
    }
}

export const postExitData = async(location) => {

    const API_URL = window.location.hostname === 'localhost'
    ? 'http://localhost:8000'
    : import.meta.env.VITE_API_URL

    const url = `${API_URL}/api/exits`

    const bodyData = {
        
    }

        try {
            const response = await fetch(url, {
                                        method: 'POST',
                                        headers: {
                                            'Content-Type': 'application/json'
                                        },
                                        body: JSON.stringify(bodyData)
                                    })
            if(!response.ok) {
                const errText = await response.text()
                console.error('API error response:', errText)
                throw new Error(`HTTP ${response.status}: ${errText}`)
            }
            const jsonData = await response.json()
            console.log('jsonData: ', jsonData)
            return jsonData
        } catch (error) {
            console.error('Fetch failed:', error)
            return null
        }
}