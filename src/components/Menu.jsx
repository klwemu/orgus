import Clock from "./Clock";
import "./Menu.css";
export function Menu() {
	return (
		<nav id="header">
			<div>
				<a href="/dashboard">Dashboard</a>
				<a href="/task">Task</a>
				<a href="/calendar">Calendar</a>
				<Clock />
				<a href="/plan">Plan</a>
				<a href="/contact">Contact</a>
				<a href="/next2me">Next2me</a>
			</div>
			<div>
				<a href="">
					<i class="icon-undo"></i>{" "}
				</a>
				<a href="/settings">
					<i class="icon-settings"></i>
				</a>
			</div>
		</nav>
	);
}
