import React, { useState, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import _ from "lodash";

class RendererClass extends React.Component {
	render() {
		return this.props.particleEmitter.particles.map((p) => (
			<View
				key={p.id}
				pointerEvents={"none"}
				style={[styles[p.type], { left: p.position.left, top: p.position.top }]}
			/>
		));
	}
}

class RendererClassWithSetNativeProps extends React.Component {
	UNSAFE_componentWillReceiveProps(nextProps) {
		nextProps.particleEmitter.particles.forEach(p => {
			const particle = this.refs[p.id];

			if (particle) {
				particle.setNativeProps({
					style: [styles[p.type], { left: p.position.left, top: p.position.top }]
				})
			}		
		})
	}

	shouldComponentUpdate(nextProps) {
		return Object.keys(this.refs).length !== nextProps.particleEmitter.particles.length
	}

	render() {
		return this.props.particleEmitter.particles.map((p) => (
			<View
				ref={p.id}
				key={p.id}
				pointerEvents={"none"}
				style={[styles[p.type], { left: p.position.left, top: p.position.top }]}
			/>
		));
	}
}

function RendererFunction(props) {
	return props.particleEmitter.particles.map((p) => (
		<View
			key={p.id}
			pointerEvents={"none"}
			style={[styles[p.type], { left: p.position.left, top: p.position.top }]}
		/>
	));
}

const styles = StyleSheet.create({
	circles: {
		position: "absolute",
		width: 20,
		height: 20,
		borderRadius: 20,
		backgroundColor: "pink",
		borderWidth: 2,
		borderColor: "black"
	},
	squares: {
		position: "absolute",
		width: 20,
		height: 20,
		backgroundColor: "pink",
		borderWidth: 2,
		borderColor: "black"
	}
});

export default ({
	maxLifetime = 40,
	maxParticles = 100,
	rate = 3,
	position = { x: 100, y: 100 },
	positionVariation = {
		x: { min: -2, max: 2 },
		y: { min: -2, max: 2 },
	},
	velocity = { x: 1, y: 1 },
	velocityVariation = {
		x: { min: -2, max: 2 },
		y: { min: -2, max: 2 },
	},
	gravity = { x: 0, y: 1 },
	mass = 1,
	paused = true,
	type = "squares"
} = {}) => {
	let lastId = 0;

	const create = () => {
		return {
			id: lastId++,
			mass,
			type: ps.particleEmitter.type,
			lifetime: 0,
			velocity: {
				x:
					velocity.x +
					_.random(velocityVariation.x.min, velocityVariation.x.max),
				y:
					velocity.y +
					_.random(velocityVariation.y.min, velocityVariation.y.max),
			},
			position: {
				left:
					ps.particleEmitter.position.x +
					_.random(positionVariation.x.min, positionVariation.x.max),
				top:
					ps.particleEmitter.position.y +
					_.random(positionVariation.y.min, positionVariation.y.max),
			},
		};
	};

	const update = (p) => {
		if (p.lifetime > maxLifetime) {
			//-- Reset this particle, but keep the id
			Object.assign(p, create(), { id: p.id });
		}
		else {
			const acceleration = { x: gravity.x / mass, y: gravity.y / mass };

			p.velocity.x += acceleration.x;
			p.velocity.y += acceleration.y;
			p.position.left += p.velocity.x;
			p.position.top += p.velocity.y;
			p.lifetime++;
		}
	};

	const ps = {
		renderer: RendererFunction, //-- Switch out the renderer component to whatever yields the best results
		particleEmitter: {
			maxLifetime,
			maxParticles,
			position,
			gravity,
			paused,
			type,
			particles: [],
			changeType(newType) {
				ps.particleEmitter.type = newType;
			},
			pause() {
				ps.particleEmitter.paused = true;
			},
			start() {
				ps.particleEmitter.paused = false;
			},
			move(newPosition) {
				ps.particleEmitter.position = newPosition;
			},
			update() {
				if (ps.particleEmitter.paused) return;

				//-- Update particles
				ps.particleEmitter.particles.forEach(update);

				//-- Add new particles if required
				if (ps.particleEmitter.particles.length < maxParticles) {
					_.range(0, rate).forEach(() =>
						ps.particleEmitter.particles.push(create())
					);
				}
			},
		},
	};

	return ps;
};
