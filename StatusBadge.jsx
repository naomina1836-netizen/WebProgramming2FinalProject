function StatusBadge({ status }) {
    const getStatusClass = () => {
        switch (status?.toLowerCase()) {
            case 'pending':
                return 'status-pending';
            case 'reviewed':
                return 'status-reviewed';
            case 'accepted':
                return 'status-accepted';
            case 'rejected':
                return 'status-rejected';
            default:
                return 'status-pending';
        }
    };

    return (
        <span className={`status-badge ${getStatusClass()}`}>
            {status || 'Pending'}
        </span>
    );
}

export default StatusBadge;