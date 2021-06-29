const presence = new Presence({
    clientId: "801051549790765108"
  }),
  startTime = Math.floor(Date.now() / 1000);

function displayPresence(presenceData: PresenceData) {
  if (presenceData.details === null) {
    presence.setTrayTitle();
    presence.setActivity();
  } else
    presence.setActivity(presenceData);

}

presence.on("UpdateData", async () => {
  const presenceData: PresenceData = {
      largeImageKey: "logo",
      startTimestamp: startTime
    },
    path = document.location.pathname.toLowerCase();

  if (document.location.hostname === "i.upload.systems") {
    const notFoundElement = document.querySelector("i.fa-4x.text-danger.mb-2.fad.fa-map-signs");

    if (notFoundElement)
      presenceData.details = "Page not found";
    else {
      if (path.includes("collection")) {
        presenceData.details = "Browsing a collection";

        const collectionTitleElement = document.querySelector("h3.text-uppercase.card-title");

        if (!collectionTitleElement)
          presenceData.state = "Unknown Collection";
        else
          presenceData.state = collectionTitleElement.textContent.trim();

        const collectionAuthorElement = document.querySelector("h5.font-weight-bold.mb-0 a");

        if (collectionAuthorElement)
          presenceData.state += ` by ${collectionAuthorElement.textContent.trim()}`;

        const collectionCountElement = document.querySelector("p.font-weight-bold.mb-0.text-white-50");

        if (collectionCountElement)
          presenceData.state += ` (${collectionCountElement.textContent.trim()})`;

      } else {
        presenceData.state = "Viewing an upload";

        const uploadAuthorElement = document.querySelector("h5.mt-4.mb-0 a.font-weight-bold");

        if (uploadAuthorElement)
          presenceData.state += `Uploaded by ${uploadAuthorElement.textContent.trim()}`;
      }
    }
  } else if (document.location.hostname === "status.upload.systems") {
    presenceData.details = "Browsing the status page";
    presenceData.state = document.querySelector("span.status").textContent;
  } else {
    if (document.location.hostname === "upload.systems")
      presenceData.details = "Browsing upload.systems";
    else if (document.location.hostname === "beta.upload.systems")
      presenceData.details = "Browsing upload.systems beta";

    const siteVersionElement = document.getElementById("siteVersion");

    if (siteVersionElement)
      presenceData.details += ` ${siteVersionElement.innerText}`;

    const hiddenUsernameSetting = await presence.getSetting("usernameHidden");

    if (!hiddenUsernameSetting) {
      const welcomeElement = document.getElementById("welcomeText");

      if (welcomeElement) {
        const username = welcomeElement.innerText.replace("Welcome, ", "");

        presenceData.smallImageKey = "user";
        presenceData.smallImageText = `Logged in as ${username}`;
      }
    }

    switch (path) {
      case "/": {
        presenceData.state = "On the landing page";
        break;
      }

      case "/home": {
        presenceData.state = "Viewing the home page";
        break;
      }

      case "/domains/donate": {
        presenceData.state = "Donating a domain";
        break;
      }

      case "/domains/manage": {
        presenceData.state = "Managing their domains";
        break;
      }

      case "/rules": {
        presenceData.state = "Viewing the rules page";
        break;
      }

      case "/user/settings/profile": {
        presenceData.state = "Editing profile";
        break;
      }

      case "/user/settings/security": {
        presenceData.state = "Editing security settings";
        break;
      }

      case "/user/settings/uploadpreferences": {
        presenceData.state = "Editing upload preferences";
        break;
      }

      case "/user/settings/images": {
        presenceData.state = "Editing image settings";
        break;
      }

      case "/user/settings/subscription": {
        presenceData.state = "Editing subscription settings";
        break;
      }

      case "/user/settings/mail": {
        presenceData.state = "Editing mail accounts";
        break;
      }

      case "/tools": {
        presenceData.state = "Browsing tools";
        break;
      }

      case "/tools/uploader": {
        presenceData.state = "Uploading an image";
        break;
      }

      case "/tools/shorten": {
        presenceData.state = "Viewing shortened URLs";
        break;
      }

      case "/tools/pastes": {
        presenceData.state = "Viewing pastes";
        break;
      }

      case "/tools/pastes/new": {
        presenceData.state = "Creating a new paste";
        break;
      }

      case "/changelogs": {
        presenceData.state = "Viewing changelogs";
        break;
      }

      case "/themes": {
        presenceData.state = "Viewing themes gallery";
        break;
      }

      case "/user": {
        presenceData.state = "Viewing their user page";
        break;
      }

      case "/gallery": {
        presenceData.state = "Viewing gallery";
        break;
      }

      case "/domains": {
        presenceData.state = "Viewing the domain list";
        break;
      }
    }

    if (!presenceData.state) {
      if (path.startsWith("/admin"))
        presenceData.state = "Viewing an admin page";
      else if (path.startsWith("/changelog/")) {
        const changelogVersion = path.replace("/changelog/", "");
        presenceData.state = `Viewing ${changelogVersion} changelog`;
      } else if (
        path.startsWith("/user/") &&
        /\d+\/?$/.test(path.replace("/user/", ""))
      ) {
        const usernameElement = document.querySelector("main h2");

        if (usernameElement) {
          const username = usernameElement.textContent;
          presenceData.state = `Viewing ${username}'s profile`;
        } else
          presenceData.state = "Viewing a user's profile";
      } else if (
        path.startsWith("/user/") &&
        /\d+\/admin\/?/.test(path.replace("/user/", ""))
      ) {
        const usernameElement = document.querySelector("main h2");

        if (usernameElement) {
          const username = usernameElement.textContent;
          presenceData.state = `Viewing ${username}'s profile as admin`;
        } else
          presenceData.state = "Viewing a user's profile as admin";
      } else
        presenceData.state = "Page not found";
    }
  }

  return displayPresence(presenceData);
});
