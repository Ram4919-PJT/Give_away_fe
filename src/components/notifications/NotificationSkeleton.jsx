export default function NotificationSkeleton() {
  return (
    <div className="notif-skeleton" aria-hidden="true">
      <div className="notif-skeleton__icon" />
      <div className="notif-skeleton__body">
        <div className="notif-skeleton__line notif-skeleton__line--title" />
        <div className="notif-skeleton__line" />
        <div className="notif-skeleton__line notif-skeleton__line--badge" />
      </div>
      <div className="notif-skeleton__aside">
        <div className="notif-skeleton__time" />
        <div className="notif-skeleton__menu" />
      </div>
    </div>
  );
}

export function NotificationSkeletonList({ count = 6 }) {
  return (
    <>
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="notif-center__row-wrap">
          <NotificationSkeleton />
          {i < count - 1 && <div className="notif-center__divider" aria-hidden="true" />}
        </div>
      ))}
    </>
  );
}
