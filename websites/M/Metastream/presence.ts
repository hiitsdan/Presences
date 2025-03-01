const presence = new Presence({
		clientId: "630462023003799583",
	}),
	strings = presence.getStrings({
		play: "general.playing",
		pause: "general.paused",
		live: "general.live",
	});

function getTime(list: string[]): number {
	let ret = 0;
	for (let index = list.length - 1; index >= 0; index--)
		ret += parseInt(list[index]) * 60 ** index;

	return ret;
}

function getTimestamps(audioTime: string, audioDuration: string): number[] {
	const startTime = Date.now();
	return [
		Math.floor(startTime / 1000),
		Math.floor(startTime / 1000) -
			getTime(audioTime.split(":").reverse()) +
			getTime(audioDuration.split(":").reverse()),
	];
}

let elapsed: number, oldUrl: string;

presence.on("UpdateData", async () => {
	if (window.location.href !== oldUrl) {
		oldUrl = window.location.href;
		elapsed = Math.floor(Date.now() / 1000);
	}

	let details,
		state,
		smallImageKey,
		smallImageText,
		startTimestamp = elapsed,
		endTimestamp,
		playing = true;

	const path = window.location.pathname;

	try {
		if (window.location.hostname.match("app.getmetastream.com")) {
			if (path === "/") {
				details = "Home";

				const menuItem = document.querySelector(
					".MenuTabs__tabItem__2ny6A.MenuTabs__selected__c65wY"
				);
				if (menuItem) state = `Viewing ${menuItem.textContent}`;
			}
			if (path.match("/settings")) {
				details = "Settings";

				const settingItem = document.querySelector(
					".SettingsMenu__tabItem__3ypki.SettingsMenu__selectedTab__OMITL"
				);
				if (settingItem) state = `Viewing ${settingItem.textContent}`;
			}
			if (path.match("/join")) {
				const disconnecctionLabel = document.querySelector(
					".Disconnect__info__3Uejx > span"
				);

				if (document.querySelector(".Connect__info__3Vwlv"))
					details = "Connecting...";
				else if (document.querySelector(".Disconnect__info__3Uejx")) {
					details = "Disconnected";

					if (disconnecctionLabel) state = disconnecctionLabel.textContent;
				} else if (document.querySelector(".MenuHeader__header__1SYq0"))
					details = "Setting up...";
				else {
					smallImageKey = "live";
					smallImageText = (await strings).live;

					const users =
						document.querySelector(".ListOverlay__list__1epFe") ||
						document.createElement("HTMLDivElement");

					if (
						users.childElementCount === 1 ||
						document.querySelector(".UserItem__menuBtn__1ST9k") !== null
					)
						details = `Hosting (${users.childElementCount} Users)`;
					else details = `Watching (${users.childElementCount} Users)`;

					const title = document.querySelector(".TitleBar__title__3VPpW");
					if (title && title.textContent !== "Metastream") {
						state = title.textContent;

						const current = document.querySelector(
								".Timeline__time__gcvG5:nth-child(1)"
							),
							duration = document.querySelector(
								".Timeline__time__gcvG5:nth-child(3)"
							);
						if (current && duration) {
							[startTimestamp, endTimestamp] = getTimestamps(
								current.textContent,
								duration.textContent
							);
						}

						const play: SVGUseElement = document.querySelector(
							".PlaybackControls__button__Q0pbe > svg > use"
						);
						if (play) {
							if (play.href.baseVal.endsWith("pause")) {
								smallImageKey = "play";
								smallImageText = (await strings).play;
								playing = true;
							} else {
								smallImageKey = "pause";
								smallImageText = (await strings).pause;
								playing = false;
							}
						}
					}
				}
			}
		}
	} catch (err) {
		presence.error(err);
	}

	presence.setActivity(
		{
			details,
			state,
			largeImageKey: "https://i.imgur.com/vAozqPN.png",
			smallImageKey,
			smallImageText,
			startTimestamp,
			endTimestamp,
		},
		playing
	);
});
