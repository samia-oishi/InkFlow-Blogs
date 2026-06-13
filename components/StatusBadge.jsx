import clsx from 'clsx';

const styles = {
  approved: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  pending: 'bg-amber-50 text-amber-700 ring-amber-200',
  rejected: 'bg-rose-50 text-rose-700 ring-rose-200',
};

export default function StatusBadge({ status = 'pending' }) {
  return (
    <span className={clsx('inline-flex rounded-full px-3 py-1 text-xs font-bold capitalize ring-1', styles[status] || styles.pending)}>
      {status}
    </span>
  );
}
