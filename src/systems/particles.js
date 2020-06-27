

export default (entities, { events, touches }) => {

	const pKeys = Object.keys(entities).filter(x => entities[x].particleEmitter);

	pKeys.forEach(x => {
		const emitter = entities[x].particleEmitter;
		const msg = events.find(e => e.type === "change-particles");
		const move = touches.find(e => e.type === "move" || e.type === "start");

		if (msg) {
			emitter.changeType(msg.value)
			emitter.start();
		}

		if (move) {
			emitter.move({ 
				x: move.event.locationX,
				y: move.event.locationY
			})
		}

		emitter.update();
	})

	return entities;
}