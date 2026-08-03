import { useState } from 'react';
import { AlertTriangle, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../ui/Toast';
import { PRIORITY_QUEUE_ITEMS } from '../../../data/adminMockData';
import {
  AdminModuleShell, AdminStatStrip, AdminBadge, AdminEmpty
} from '../AdminModuleShell';

const PRIO_VARIANT = { Urgent: 'red', High: 'orange', Normal: 'muted' };

export default function AdminPriorityQueue() {
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [items] = useState(PRIORITY_QUEUE_ITEMS);

  const urgent = items.filter((i) => i.priority === 'Urgent').length;
  const pending = items.filter((i) => i.status === 'Pending').length;

  return (
    <AdminModuleShell title="Priority Queue" subtitle="High-priority cases and urgent platform actions requiring immediate attention.">
      <AdminStatStrip items={[
        ['Total Items', items.length, 'blue'],
        ['Urgent', urgent, 'red'],
        ['Pending', pending, 'orange'],
        ['Under Review', items.length - pending, 'purple']
      ]} />

      {items.length ? (
        <div className="admin-mod-priority-list">
          {items.map((item) => (
            <article key={item.id} className={`admin-mod-priority-item admin-mod-priority-item--${item.priority.toLowerCase()}`}>
              <div className="admin-mod-priority-item__icon">
                <AlertTriangle size={20} />
              </div>
              <div className="admin-mod-priority-item__body">
                <div className="admin-mod-priority-item__head">
                  <strong>{item.title}</strong>
                  <AdminBadge variant={PRIO_VARIANT[item.priority]}>{item.priority}</AdminBadge>
                  <AdminBadge variant="blue">{item.status}</AdminBadge>
                </div>
                <p>{item.entity} · {item.type} · {item.date}</p>
                <span>Assignee: {item.assignee}</span>
              </div>
              <button
                type="button"
                className="admin-mod-btn admin-mod-btn--primary"
                onClick={() => {
                  if (item.type === 'Verification') navigate('/dashboard/admin-verifications');
                  else if (item.type === 'Financial') navigate('/dashboard/admin-financial-assistance');
                  else showToast(`Processing ${item.title}…`, 'info');
                }}
              >
                Take Action <ArrowRight size={14} />
              </button>
            </article>
          ))}
        </div>
      ) : (
        <AdminEmpty icon={AlertTriangle} title="Queue is empty" desc="No priority items at the moment." />
      )}
    </AdminModuleShell>
  );
}
