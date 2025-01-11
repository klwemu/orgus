import { Title } from "@solidjs/meta";
import CalendarGrid from "~/components/CalendarGrid";

export default function Calendar() {
	return (
		<main>
			<div id="cal" class="grid-container">
				<CalendarGrid />
			</div>
		</main>
	);
}
