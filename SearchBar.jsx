import { useState } from "react";
import { useNavigate } from "react-router-dom";

function SearchBar({ initialValue = "" }) {
    const [keyword, setKeyword] = useState(initialValue);
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        if (keyword.trim()) {
            navigate(`/jobs?search=${encodeURIComponent(keyword.trim())}`);
        } else {
            navigate("/jobs");
        }
    };

    return (
        <form onSubmit={handleSubmit} className="search-bar">
            <input
                type="text"
                placeholder="Search for jobs..."
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                className="search-input"
            />
            <button type="submit" className="btn search-btn">
                Search
            </button>
        </form>
    );
}

export default SearchBar;