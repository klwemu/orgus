import { onMount, onCleanup } from "solid-js";

function CalendarGrid() {
	let containerRef; // Ref for the container
	let canvasRef; // Ref for the canvas

	const cols = 7 + 1; // Number of columns
	const rows = 48 + 1; // Number of rows

	function resizeCanvas() {
		const canvas = canvasRef;
		// const container = containerRef;
		const container = document.querySelector(".grid-container");
		const ctx = canvas.getContext("2d");

		// Debug: Log dimensions before adjustment
		console.log("Before resize:");
		console.log("Container height:", container.offsetHeight);
		console.log("Canvas height:", canvas.offsetHeight);

		// Set canvas dimensions to match the container
		const containerWidth = container.offsetWidth;
		const containerHeight = container.offsetHeight;

		canvas.width = containerWidth;
		canvas.height = containerHeight;

		// Debug: Log dimensions after adjustment
		console.log("After resize:");
		console.log("Container height:", container.offsetHeight);
		console.log("Canvas height:", canvas.offsetHeight);

		drawGrid(ctx, canvas);
	}

	function resizeCanvas() {
		const canvas = canvasRef;
		// const container = containerRef;
		const container = document.querySelector(".grid-container");
		// const container = canvas.parentElement.parentElement;
		const ctx = canvas.getContext("2d");

		// Match canvas size to the container size
		canvas.width = container.offsetWidth;
		canvas.height = container.offsetHeight;
		console.log(`resizeCanvas h=${canvas.height}`);

		drawGrid(ctx, canvas);
	}

	function drawGrid(ctx, canvas) {
		const w = canvas.width;
		const h = canvas.height;
		console.log(`drawGrid h=${h}`);
		ctx.clearRect(0, 0, w, h); // Clear canvas before redrawing
		ctx.strokeStyle = "#000";
		ctx.lineWidth = 1;
		const hStep = h / rows;
		const vStep = w / cols;
		for (let i = 1; i < rows; i++) {
			const y = Math.floor(i * hStep) + 0.5;
			ctx.beginPath();
			ctx.moveTo(0, y);
			ctx.lineTo(w, y);
			ctx.stroke();
			drawText(ctx, `h${i}`, 0, i, canvas);
		}
		for (let i = 1; i < cols; i++) {
			const x = Math.floor(i * vStep) + 0.5;
			ctx.beginPath();
			ctx.moveTo(x, 0);
			ctx.lineTo(x, h);
			ctx.stroke();
			drawText(ctx, `d${i}`, i, 0, canvas);
		}
	}

	function drawText(ctx, text, col, row, canvas) {
		const w = canvas.width;
		const h = canvas.height;
		const cellWidth = w / cols;
		const cellHeight = h / rows;

		ctx.font = "14px Arial";
		ctx.fillStyle = "#000";
		ctx.textAlign = "center";
		ctx.textBaseline = "middle";

		const x = (col + 0.5) * cellWidth;
		const y = (row + 0.5) * cellHeight;

		ctx.fillText(text, x, y);
	}

	// Set up canvas on mount and handle resizing
	onMount(() => {
		resizeCanvas(); // Initial resize and draw
		window.addEventListener("resize", resizeCanvas); // Listen to resize events

		// Cleanup on unmount
		onCleanup(() => {
			window.removeEventListener("resize", resizeCanvas);
		});
	});

	return (
		// <div ref={(el) => (containerRef = el)} class="grid-container">
		<canvas ref={(el) => (canvasRef = el)} id="gridCanvas"></canvas>
		// </div>
	);
}

export default CalendarGrid;
