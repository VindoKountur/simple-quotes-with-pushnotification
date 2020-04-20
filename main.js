const publicVapidKey =
  "BPdY8bZKAJuaHAHCtz_H5g_1qUp91vCB-iPOxJQlBKE4VYZLIjUynY1vkKtAk9srTzb4_H_wRYr1RpyNJSP3kBQ";
(setInterval(() => {
  const date = new Date();
  const jam = date.getHours();
  const menit = date.getMinutes();
  const detik = date.getSeconds();
  if (jam === 6 && menit === 0 && detik === 0) {
    sendPush();
  }
}, 1000))

const ele = {
  pushButton : document.querySelector('#pushNotif')
}
function sendPush() {
  send().catch(err => console.error(err));
}
// Register SW, Register Push, Send Push
async function send() {
  // Register Service Worker
  console.log("Registering service worker...");
  const register = await navigator.serviceWorker.register("./worker.js", {
    scope: "/"
  });
  console.log("Service Worker Registered...");

  // Register Push
  console.log("Registering Push...");
  const subscription = await register.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(publicVapidKey)
  });
  console.log("Push Registered...");
  // Send Push Notification
  console.log("Sending Push...");
  await fetch("https://make-life-easier.herokuapp.com/subscribe", {
    method: "POST",
    body: JSON.stringify(subscription),
    headers: {
      "content-type": "application/json"
    }
  });
  console.log("Push Sent...");
}

window.addEventListener('load', async () => {
  // Register Service Worker
  console.log("Registering service worker...");
  const register = await navigator.serviceWorker.register("./worker.js", {
    scope: "/"
  });
  console.log("Service Worker Registered...");

  // Register Push
  console.log("Registering Push...");
  const subscription = await register.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(publicVapidKey)
  });
  console.log("Push Registered...");
})

function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, "+")
    .replace(/_/g, "/");

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}