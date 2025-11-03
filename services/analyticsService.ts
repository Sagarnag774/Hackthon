
// FIX: Added 'manager_login', 'tour_created', 'tour_updated', and 'tour_deleted' to the EventName union type to allow tracking these events from App.tsx.
type EventName = 'session_start' | 'scan_initiated' | 'scan_success' | 'scan_failed' | 'tour_selected' | 'view_artwork_details' | 'click_related_work' | 'manager_login' | 'tour_deleted' | 'tour_created' | 'tour_updated';

interface EventPayload {
  userId: string | null;
  [key: string]: any;
}

export const trackEvent = (eventName: EventName, payload: EventPayload) => {
  const timestamp = new Date().toISOString();
  console.log(`[Analytics Event]`, {
    event: eventName,
    timestamp,
    ...payload
  });
  // In a real app, this would send data to a server:
  // fetch('/api/analytics', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({ eventName, payload, timestamp })
  // });
};
