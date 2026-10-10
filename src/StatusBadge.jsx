import { Clock, UserCheck, Loader, CheckCircle2, XCircle } from "lucide-react";

const StatusBadge = ({ status }) => {
  const config = {
    PENDING: { cls: "badge-pending", label: "Pending", Icon: Clock },
    ASSIGNED: { cls: "badge-assigned", label: "Assigned", Icon: UserCheck },
    IN_PROGRESS: { cls: "badge-in_progress", label: "In Progress", Icon: Loader },
    COMPLETED: { cls: "badge-completed", label: "Completed", Icon: CheckCircle2 },
    CANCELLED: { cls: "badge-cancelled", label: "Cancelled", Icon: XCircle },
  };

  const { cls, label, Icon } = config[status] || config.PENDING;

  return (
    <span className={`badge-pill ${cls}`}>
      <Icon size={12} />
      {label}
    </span>
  );
};

export default StatusBadge;
