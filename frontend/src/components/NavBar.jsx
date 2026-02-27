import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, Search, MapPin, Heart } from "lucide-react";
import  ParachuteIcon from '../assets/parachute-parachutist-svgrepo-com.svg?react'

const NavButton = ({ to, icon, label, active }) => (
    <Link
        to={to}
        style={{
        display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
        padding: "12px 24px", borderRadius: 12, textDecoration: "none", transition: "all 0.2s",
        color: active ? "#0A84FF" : "rgba(235,235,245,0.45)",
        width: 80
        }}
    >
    {React.cloneElement(icon, {
        size: 24,
        width: 22,
        height: 22,
        style: { fill: active ? "#0A84FF" : "rgba(235,235,245,0.45)", flexShrink: 0 }
    })}
    <span style={{ fontSize: 15, fontWeight: active ? 700 : 500 }}>{label}</span>
    </Link>
);

function NavBar({ currentPage }) {
    const location = useLocation();
    const current = currentPage || location.pathname.slice(1) || "home";

    return (
        <nav style={{
            position: "fixed", bottom: 0, left: 0, right: 0,
            background: "#2C2C2E", borderTop: "1px solid #38383A",
            maxWidth: 448, margin: "0 auto",
        }}>
            <div style={{ display: "flex", justifyContent: "space-around", padding: "8px 4px 4px" }}>
                <NavButton to="/"          icon={<Home />}   label="Home"      active={current === "" || current === "home"} />
                <NavButton to="/search"    icon={<Search />} label="Search"    active={current === "search"} />
                <NavButton to="/exits"     icon={<ParachuteIcon />} label="Jumpers" active={current === "exits"} />
                <NavButton to="/favorites" icon={<Heart />}  label="Favorites" active={current === "favorites"} />
            </div>
        </nav>
    );
}

export default NavBar;