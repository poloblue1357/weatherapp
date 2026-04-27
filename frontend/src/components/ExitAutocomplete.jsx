function ExitAutocomplete({ setSelectedExit, setAutocompleteResults, searchLocation, setSearchInput, autocompleteResults }) {

    return (
        <>
            {autocompleteResults?.length > 0 && (
                <div className="bg-white rounded-xl shadow-lg border border-gray-200 mt-2">
                    {autocompleteResults.map((suggestion, index) => (
                        <div
                            key={index}
                            className="p-3 cursor-pointer hover:bg-blue-100 border-b border-gray-100 last:border-b-0 first:rounded-t-xl last:rounded-b-xl"
                            onClick={() => {
                                setSelectedExit(suggestion.name)
                                setAutocompleteResults([])
                                searchLocation(suggestion.name)
                                setSearchInput('')
                            }}
                        >
                            {suggestion.name}
                        </div>
                    ))}
                </div>
            )}
        </>
    )
}

export default ExitAutocomplete
