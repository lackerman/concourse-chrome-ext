/*
 * Fire Notifications for failed jobs
 * @param notification
 *           Requires the id, title, message and url of the job to view
 */
function launchNotification(notification) {
  var notificationId = `${notification.title}_${notification.id}`;
  chrome.notifications.getPermissionLevel((level) => {
    if (level == "granted") {
      // Clear previous notifications
      chrome.notifications.clear(notificationId, () => ({}));
      chrome.notifications.create(notificationId, {
        type: 'basic',
        iconUrl: 'icons/notification_icon.png',
        title: notification.title,
        message: notification.message,
        contextMessage: 'Click notification to view failure'
      }, (notificationId) => {});
      // Respond to the user's clicking on the notification
      chrome.notifications.onClicked.addListener((id) => {
        if (id === notificationId) {
          window.open(notification.url);
          chrome.notifications.clear(notificationId, () => ({}));
        }
      });
    }
  })
}
