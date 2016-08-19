const notificationMap = new Map();

/*
 * Fire Notifications for failed jobs
 * @param notification
 *           Requires the id, title, message and url of the job to view
 */
function launchNotification(notification) {
  chrome.notifications.getPermissionLevel((level) => {
    if (level == "granted") {
      const notificationId = `${notification.title}`;
      // Clear previous notifications
      chrome.notifications.clear(notificationId, (wasCleared) => ({}));

      chrome.notifications.create(notificationId, {
        type: 'basic',
        iconUrl: 'icons/notification_icon.png',
        title: notification.title,
        message: notification.message,
        contextMessage: 'Click notification to view failure'
      }, (notificationId) => {
        notificationMap.set(notificationId, notification);
      });
    }
  })
}

// Respond to the user's clicking on the notification
chrome.notifications.onClicked.addListener((id) => {
  if (notificationMap.has(id)) {
    const notification = notificationMap.get(id);
    window.open(notification.url);
    // Clear notification
    chrome.notifications.clear(id, (wasCleared) => ({}));
    notificationMap.delete(id);
  }
});
