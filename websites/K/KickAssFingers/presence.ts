const presence = new Presence({
		clientId: "871843228213731340",
	}),
	time = Math.floor(Date.now() / 1000);

presence.on("UpdateData", () => {
	const presenceData: PresenceData = {
			largeImageKey: "https://i.imgur.com/9eu1lO1.png",
			startTimestamp: time,
		},
		data = document.querySelector("#premIdVars"),
		vars = JSON.parse(data.getAttribute("vars")),
		live = JSON.parse(data.getAttribute("liveScores"));
	presenceData.details = vars.details;

	if (vars.page === "test") {
		if (live?.chrOk === 0 && live?.chrKo === 0) presenceData.state = vars.ready;
		else
			presenceData.state = `${live.worPm} wpm, ${live.points} ${vars.points}, ${live.chrAcc}% ${vars.accuracy}`;

		if (document.querySelector("#resultsContent").textContent === "") {
			if (vars.testType === 0) {
				const residualTime = document
					.querySelector("#premIdVars")
					.getAttribute("residualTime");
				if (residualTime !== "") {
					presenceData.endTimestamp =
						Math.floor(Date.now() / 1000) + (parseInt(residualTime) + 1);
				}
			} else if (presenceData.state !== vars.ready)
				presenceData.state += `, ${Math.round(live.time)} ${vars.seconds}`;
		} else {
			presenceData.details = vars.finished;

			if (presenceData.state !== vars.ready)
				presenceData.state += `, ${live.time} ${vars.seconds}, ${vars.words} ${live.worOk}/${live.worKo}, ${vars.chars} ${live.chrOk}/${live.chrKo}`;
		}
	}

	if (
		!document
			.querySelector("#cntr-boxOverlay")
			.classList.contains("displayNone")
	) {
		presenceData.details = vars.checking_stats;
		delete presenceData.state;
	}

	if (presenceData.details) presence.setActivity(presenceData);
	else presence.setActivity();
});
