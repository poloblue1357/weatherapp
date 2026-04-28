import NavBar from "../components/NavBar";
import Header from "../components/Header"
import ExitSubmit from "../components/ExitSubmit"
import { useState } from 'react'
import ExitSearch from "../components/ExitSearch";


const T = {
    tabBar:      { background: "#2C2C2E", borderRadius: 12, padding: 4, display: "flex", gap: 4, marginBottom: 16, boxShadow: "0 2px 8px rgba(0,0,0,0.3)" },
    tabActive:   { background: "linear-gradient(to right, rgb(14, 165, 233), rgb(59, 130, 246))", color: "#FFFFFF" },
    tabInactive: { background: "transparent", color: "rgba(235,235,245,0.55)" },
};

function Exits() {
    const [activeTab, setActiveTab] = useState('search')
   
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-700 to-sky-500">
            <Header title="Dropzones & Exits" showBackButton={false} />
           
            <div className="flex-1 p-4 pb-20 max-w-md mx-auto w-full">
                <div style={T.tabBar}>
                    {["search", "submit"].map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            style={{
                                flex: 1, padding: "10px 0", borderRadius: 9, border: "none",
                                fontWeight: 700, fontSize: 14, cursor: "pointer", transition: "all 0.2s",
                                ...(activeTab === tab ? T.tabActive : T.tabInactive),
                            }}
                        >
                            {tab.charAt(0).toUpperCase() + tab.slice(1)}
                        </button>
                    ))}
                </div>
                
                {activeTab === 'search' ? (
                    <ExitSearch />
                ) : (
                    <ExitSubmit />
                )}
            </div>
           
            <NavBar currentPage="exits"/>
        </div>
    )
}

export default Exits