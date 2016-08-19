/*
 * Fire Notifications for failed jobs
 * @param notification
 *           Requires the id, title, message and url of the job to view
 */
function launchNotification(notification) {
  var notificationName = `${notification.title}_${notification.id}`;
  var myNotificationId = null;
  chrome.notifications.getPermissionLevel((level) => {
    if (level == "granted") {
      chrome.notifications.create(notificationName, {
        type: 'basic',
        iconUrl: 'icons/notification_icon.png',
        title: notification.title,
        message: notification.message,
        contextMessage: 'Click notification to view failure'
      }, (notificationId) => {
        myNotificationId = notificationId;
      });
      // Respond to the user's clicking on the notification
      chrome.notifications.onClicked.addListener((notificationId) => {
        console.log(notificationId, myNotificationId)
        if (notificationId === myNotificationId) {
          window.open(notification.url);
          chrome.notifications.clear(notificationId, () => ({}));
        }
      });
    }
  })
}
