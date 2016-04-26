/// <reference path="PlatformerGameStates.ts"/>

class PlatformerGame {

    game: Phaser.Game;

    constructor() {
        // Instantiate Game
        this.game = new Phaser.Game(window.innerWidth, window.innerHeight, Phaser.AUTO, "GameArea");

        // Add States
        this.game.state.add("GameStartState", PlatformerGameStates.GameStartState, false);
        this.game.state.add("GameRunningState", PlatformerGameStates.GameRunningState, false);
        this.game.state.add("GameWonState", PlatformerGameStates.GameWonState, false);
        this.game.state.add("GameLostState", PlatformerGameStates.GameLostState, false);

        // Start Initial
        this.game.state.start("GameStartState", true, true);
    }
}