import { useEffect, useState } from "react";
import api from "../services/api";
import toast from "react-hot-toast";

function AdminDashboard() {

    const [stats, setStats] = useState({});
    const [users, setUsers] = useState([]);
    const [jobs, setJobs] = useState([]);
    const [companies, setCompanies] = useState([]);

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadDashboard();
    }, []);

    async function loadDashboard() {

        try {

            const [
                statsRes,
                usersRes,
                companiesRes,
                jobsRes
            ] = await Promise.all([

                api.get("/admin/dashboard"),
                api.get("/admin/users"),
                api.get("/admin/companies"),
                api.get("/admin/jobs")

            ]);

            setStats(statsRes.data);
            setUsers(usersRes.data);
            setCompanies(companiesRes.data);
            setJobs(jobsRes.data);

        }

        catch (err) {

            console.error(err);

            toast.error("Failed to load dashboard.");

        }

        finally {

            setLoading(false);

        }

    }

    async function deleteUser(id){

        if(!window.confirm("Delete this user?")) return;

        try{

            await api.delete(`/admin/users/${id}`);

            setUsers(users.filter(user=>user.id!==id));

            toast.success("User deleted.");

        }

        catch{

            toast.error("Failed.");

        }

    }

    async function deleteJob(id){

        if(!window.confirm("Delete this job?")) return;

        try{

            await api.delete(`/admin/jobs/${id}`);

            setJobs(jobs.filter(job=>job.id!==id));

            toast.success("Job deleted.");

        }

        catch{

            toast.error("Failed.");

        }

    }

    if(loading){

        return(
            <div className="container">
                <h2>Loading...</h2>
            </div>
        );

    }

    return(

        <section className="dashboard-page">

            <div className="container">

                <h1 className="dashboard-title">
                    Admin Dashboard
                </h1>

                <div className="stats-grid">

                    <div className="stat-card">

                        <h2>{stats.users}</h2>

                        <p>Users</p>

                    </div>

                    <div className="stat-card">

                        <h2>{stats.companies}</h2>

                        <p>Companies</p>

                    </div>

                    <div className="stat-card">

                        <h2>{stats.jobs}</h2>

                        <p>Jobs</p>

                    </div>

                    <div className="stat-card">

                        <h2>{stats.applications}</h2>

                        <p>Applications</p>

                    </div>

                </div>

                <h2 className="section-title">
                    Users
                </h2>

                <table className="admin-table">

                    <thead>

                        <tr>

                            <th>Name</th>

                            <th>Email</th>

                            <th>Role</th>

                            <th></th>

                        </tr>

                    </thead>

                    <tbody>

                        {

                            users.map(user=>(

                                <tr key={user.id}>

                                    <td>{user.full_name}</td>

                                    <td>{user.email}</td>

                                    <td>{user.role}</td>

                                    <td>

                                        <button

                                            className="btn-danger"

                                            onClick={()=>deleteUser(user.id)}

                                        >

                                            Delete

                                        </button>

                                    </td>

                                </tr>

                            ))

                        }

                    </tbody>

                </table>

                <h2 className="section-title">
                    Jobs
                </h2>

                <table className="admin-table">

                    <thead>

                        <tr>

                            <th>Title</th>

                            <th>Company</th>

                            <th>Location</th>

                            <th></th>

                        </tr>

                    </thead>

                    <tbody>

                        {

                            jobs.map(job=>(

                                <tr key={job.id}>

                                    <td>{job.title}</td>

                                    <td>{job.company_name}</td>

                                    <td>{job.location}</td>

                                    <td>

                                        <button

                                            className="btn-danger"

                                            onClick={()=>deleteJob(job.id)}

                                        >

                                            Delete

                                        </button>

                                    </td>

                                </tr>

                            ))

                        }

                    </tbody>

                </table>

                <h2 className="section-title">
                    Companies
                </h2>

                <table className="admin-table">

                    <thead>

                        <tr>

                            <th>Name</th>

                            <th>Location</th>

                            <th>Website</th>

                        </tr>

                    </thead>

                    <tbody>

                        {

                            companies.map(company=>(

                                <tr key={company.id}>

                                    <td>{company.company_name}</td>

                                    <td>{company.location}</td>

                                    <td>{company.website}</td>

                                </tr>

                            ))

                        }

                    </tbody>

                </table>

            </div>

        </section>

    );

}

export default AdminDashboard;