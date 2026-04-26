

function ExitAutocomplete({ setIsSelecting, setSelectedTerm, setSearchResults, searchLocation, setSearchInput, searchResults }) {



    return (
        <div>
            {searchResults.length > 0 && 
                searchResults.map((input, index) => 
                    <div
                        key={index}
                        style={{
                                width: '100%',
                                padding: '20px 64px 20px 20px',
                                border: 0,
                                borderRadius: '16px',
                                fontSize: '16px',
                                background: 'white',
                                boxSizing: 'border-box',
                                outline: 'none'
                        }}
                        onClick={() => {
                            setSelectedTerm(input.name)
                            setSearchResults([])
                            searchLocation(input.name)
                            setSearchInput('')
                        }}
                    >
                        {input.name}
                    </div>
                )
            }
        </div>
    )
}

export default ExitAutocomplete