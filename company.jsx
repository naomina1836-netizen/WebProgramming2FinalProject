import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import toast from "react-hot-toast";

function Company() {

    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    const [form, setForm] = useState({

        company_name: "",
        description: "",
        location: "",
        website: ""

    });

    function handleChange(e) {

        setForm({

            ...form,
            [e.target.name]: e.target.value

        });

    }

    async function handleSubmit(e) {

        e.preventDefault();
        setIsLoading(true);

        try {

            const res = await api.post("/companies", form);

            toast.success(res.data.message);

            setForm({
                company_name: "",
                description: "",
                location: "",
                website: ""
            });

            navigate("/employer-dashboard");

        }

        catch (err) {

            console.error(err);

            toast.error(

                err.response?.data?.message ||

                "Failed to create company."

            );

        } finally {

            setIsLoading(false);

        }

    }

    return (

        <section className="page">

            <div className="container">

                <div className="form-card">

                    <h1>Create Your Company</h1>

                    <p>
                        Before posting jobs, tell job seekers about your company.
                    </p>

                    <form onSubmit={handleSubmit}>

                        <input
                            type="text"
                            name="company_name"
                            placeholder="Company Name"
                            value={form.company_name}
                            onChange={handleChange}
                            required
                        />

                        <input
                            type="text"
                            name="location"
                            placeholder="Location"
                            value={form.location}
                            onChange={handleChange}
                            required
                        />

                        <input
                            type="url"
                            name="website"
                            placeholder="Website"
                            value={form.website}
                            onChange={handleChange}
                        />

                        <textarea
                            name="description"
                            placeholder="Describe your company..."
                            rows="6"
                            value={form.description}
                            onChange={handleChange}
                            required
                        />

                        <button className="btn" disabled={isLoading}>

                            {isLoading ? "Creating..." : "Create Company"}

                        </button>

                    </form>

                </div>

            </div>

        </section>

    );

}

export default Company;