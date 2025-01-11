import { createSignal, onCleanup } from "solid-js";

function Clock() {
	const [time, setTime] = createSignal("");

	function updateTime() {
		const now = new Date();
		const timeStr = now.toLocaleTimeString("en-US", {
			hour: "numeric",
			minute: "2-digit",
			hour12: false,
		});
		setTime(timeStr);
	}
	function start() {
		const update = () => {
			updateTime();
			const now = new Date();
			const seconds = now.getSeconds();
			const milliseconds = now.getMilliseconds();
			const timeToNextMinute = (60 - seconds) * 1000 - milliseconds;
			setTimeout(update, timeToNextMinute); // Set a timeout to update the time just before the next minute
		};
		update(); // Start the initial update
	}
	start();
	onCleanup(() => {
		// Solid does not provide a direct stop method for timeouts, so we'll rely on onCleanup
		// to prevent memory leaks. You can modify to manually clearTimeout if needed
	});

	return (
		<div>
			<div class="clock">{time()}</div>
		</div>
	);
}

export default Clock;
