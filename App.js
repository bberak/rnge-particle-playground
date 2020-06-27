import React, { useRef } from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { GameEngine } from "react-native-game-engine";
import ParticleEmitter from "./src/components/particle-emitter";
import ParticleSystem from "./src/systems/particles";
import Timer from "./src/utils/perf-timer";

export default function App() {
  const gameEngine = useRef(null);

  return (
    <GameEngine 
      ref={gameEngine}
      style={{ backgroundColor: "white" }}
      timer={new Timer()}
      systems={[ParticleSystem]}
      entities={{
        p1: ParticleEmitter()
      }}
    >
      <View style={{ flex: 1, justifyContent: "flex-end" }}>
        <View style={{ flexDirection: "row" }}>
          <TouchableOpacity onPressIn={() => gameEngine.current.dispatch({ type: "change-particles", value: "squares" })} style={styles.button}>
            <Text style={{ color: "white" }}>Squares</Text>
          </TouchableOpacity>

          <TouchableOpacity onPressIn={() => gameEngine.current.dispatch({ type: "change-particles", value: "circles" })} style={styles.button}>
            <Text style={{ color: "white" }}>Circles</Text>
          </TouchableOpacity>
        </View>
      </View>
    </GameEngine>
  );
}

const styles = StyleSheet.create({
  button: {
    flex: 1,
    backgroundColor: "blue",
    padding: 20,
    margin: 5,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5
  }
});
