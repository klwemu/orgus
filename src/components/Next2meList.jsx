import { createSignal, onMount, onCleanup } from "solid-js";

function Next2meList() {
	const [locationState, setLocationState] = createSignal("Fetching your location...");
	const [accuracyState, setAccuracyState] = createSignal(0);
	const [locationError, setLocationError] = createSignal("");
	const [headingAngle, setHeadingAngle] = createSignal(0); // Device orientation
	const [contacts, setContacts] = createSignal([]);
	const contactList = [
		{
			name: "John Doe",
			address: "123 Main St, Anytown, USA",
			latitude: 40.7128,
			longitude: -74.006,
		},
		{
			name: "Jane Smith",
			address: "456 Elm St, Othertown, USA",
			latitude: 40.7282,
			longitude: -73.7949,
		},
		{
			name: "Gemeindeplatz Meggenhofen",
			address: "4623 Meggenhofen",
			latitude: 48.1804866,
			longitude: 13.7940213,
		},
		{
			name: "Klaus Muckenhuber",
			address: "4625 Offenhausen",
			latitude: 48.1563192,
			longitude: 13.836618,
		},
		{
			name: "Pizzeria Garden",
			address: "4650 Lambach",
			latitude: 48.0907966,
			longitude: 13.8744528,
		},
		{
			name: "Alice Johnson",
			address: "789 Oak Rd, Somewhere, USA",
			latitude: 40.7489,
			longitude: -73.968,
		},
		{
			name: "Gasthof Wirt z'Friesam",
			address: "Friesam 9, 4902 Wolfsegg am Hausruck",
			latitude: 48.1179733,
			longitude: 13.7008912,
		},
	];

	function getUserLocation() {
		console.log(`Update user location ....`);
		setLocationState("Fetching your location...");
		return new Promise((resolve, reject) => {
			if ("geolocation" in navigator) {
				navigator.geolocation.getCurrentPosition(
					(position) => {
						const { latitude, longitude, accuracy } = position.coords;
						setAccuracyState((accuracy / 1000).toFixed(1)); // Convert to km
						setLocationState(`Location found! Accuracy=${accuracyState()} km`);
						resolve(position.coords);
					},
					(error) => {
						console.error(error);
						setLocationError(`Error: ${error.message}`);
						reject(error);
					},
					{ enableHighAccuracy: true, maximumAge: 0, timeout: 5000 }
				);
			} else {
				setLocationError("Geolocation is not supported by this browser.");
				reject(new Error("Geolocation not supported"));
			}
		});
	}

	function calculateDistance(lat1, lon1, lat2, lon2) {
		const R = 6371; // Radius of the Earth in km
		const dLat = ((lat2 - lat1) * Math.PI) / 180;
		const dLon = ((lon2 - lon1) * Math.PI) / 180;
		const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
		const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
		return R * c; // Distance in kilometers
	}

	function calculateAngle(lat1, lon1, lat2, lon2) {
		const toRad = (angle) => (angle * Math.PI) / 180;
		const toDeg = (rad) => (rad * 180) / Math.PI;

		const φ1 = toRad(lat1);
		const φ2 = toRad(lat2);
		const Δλ = toRad(lon2 - lon1);

		let angle = Math.atan2(Math.sin(Δλ) * Math.cos(φ2), Math.cos(φ1) * Math.sin(φ2) - Math.sin(φ1) * Math.cos(φ2) * Math.cos(Δλ));

		angle = toDeg(angle);
		return (angle + 360) % 360; // Normalize to 0-360
	}

	function calculateRealAngle(absoluteAngle) {
		const heading = headingAngle(); // Device orientation
		return (absoluteAngle - heading + 360) % 360; // Adjusted for device orientation
	}

	function renderContacts(userCoords) {
		const contactsWithDistance = contactList
			.map((contact) => {
				const distance = calculateDistance(userCoords.latitude, userCoords.longitude, contact.latitude, contact.longitude);
				const absoluteAngle = calculateAngle(userCoords.latitude, userCoords.longitude, contact.latitude, contact.longitude);
				const realAngle = calculateRealAngle(absoluteAngle);
				return { ...contact, distance, absoluteAngle, realAngle };
			})
			.sort((a, b) => a.distance - b.distance);

		setContacts(contactsWithDistance);
	}

	function handleDeviceOrientation(event) {
		const heading = event.alpha; // Compass heading (0-360)
		if (heading !== null) setHeadingAngle(heading);
	}

	onMount(async () => {
		try {
			const userCoords = await getUserLocation();
			renderContacts(userCoords);

			if ("ondeviceorientation" in window) {
				// Check if the device supports the `deviceorientation` event
				window.addEventListener("deviceorientation", handleDeviceOrientation);
			} else {
				console.warn("Device orientation not supported on this device.");
			}
		} catch (error) {
			console.error("App initialization failed:", error);
		}
	});

	onCleanup(() => {
		if ("ondeviceorientation" in window) {
			window.removeEventListener("deviceorientation", handleDeviceOrientation);
		}
	});

	return (
		<div id="next-2-me-content">
			<div id="location-status">{locationState()}</div>
			<div id="location-error">{locationError()}</div>
			<ul id="contacts-list">
				{contacts().map((contact) => (
					<li class="contact-item">
						<strong>{contact.name}</strong>
						<br />
						{contact.address}
						<br />
						Distance: {contact.distance.toFixed(1)} km
						<br />
						Absolute Angle: {contact.absoluteAngle.toFixed(0)}°
						<br />
						Real Angle: {contact.realAngle.toFixed(0)}°
					</li>
				))}
			</ul>
		</div>
	);
}

export default Next2meList;
