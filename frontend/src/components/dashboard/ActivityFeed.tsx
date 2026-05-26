import { useAlertStore } from "@/store/useAlertStore";

// Subscribes only to feed state, so alert/device updates do not force unrelated panels to rerender.
export function ActivityFeed() {
  const feed = useAlertStore((state) => state.feed);
  return (
    <div className="activity-feed">
      {feed.slice(0, 6).map((item, index) => (
        <article className="feed-item" key={`${item.time}-${item.title}-${index}`}>
          <div className="item-topline">
            <span className="item-title">{item.title}</span>
            <span className="item-time">{item.time}</span>
          </div>
          <p className="item-body">{item.body}</p>
        </article>
      ))}
    </div>
  );
}
