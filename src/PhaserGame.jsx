import PropTypes from "prop-types";
import { forwardRef, useLayoutEffect, useRef, useEffect } from "react";
import StartGame from "./StartGame";
import { EventBus } from "./EventBus";
import ChatContainer from "./components/ChatContainer";

export const PhaserGame = forwardRef(function PhaserGame(props, ref) {
    const game = useRef();

    useLayoutEffect(() => {
        if (game.current === undefined) {
            game.current = StartGame("game-container");
            if (ref !== null) {
                ref.current = { game: game.current, scene: null };
            }
        }

        return () => {
            if (game.current) {
                game.current.destroy(true);
                game.current = undefined;
            }
        };
    }, [ref]);

    useEffect(() => {
        EventBus.on("current-scene-ready", (currentScene) => {
            if (ref.current) {
                ref.current.scene = currentScene;
            }
        });

        return () => {
            EventBus.removeListener("current-scene-ready");
        };
    }, [ref]);

    return (
        <div id="game-container">
            <ChatContainer />
        </div>
    );
});

PhaserGame.propTypes = {
    currentActiveScene: PropTypes.func,
};

