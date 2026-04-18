import { useState } from "react"

function ExitAutocomplete({searchInput, setSearchInput, searchResults, searchSelect, testSearch, setSearchSelect}) {



    return (
        <div>
            {searchResults && 
                searchResults?.map((input, index) => 
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
                    >
                        {input.name}
                    </div>
                )
            }
        </div>
    )
}

export default ExitAutocomplete