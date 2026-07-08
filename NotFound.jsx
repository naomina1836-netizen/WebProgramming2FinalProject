import { Link } from "react-router-dom";

function NotFound() {
    return (
        <section className="container" style={{ padding: "100px 20px", textAlign: "center" }}>
            <h1>404</h1>
            <p>Page not found.</p>

            <Link className="btn" to="/">
                Back Home
            </Link>
        </section>
    );
}

export default NotFound;