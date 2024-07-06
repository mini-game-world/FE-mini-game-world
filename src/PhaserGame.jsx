import PropTypes from "prop-types";
import {
    forwardRef,
    useLayoutEffect,
    useRef,
    useEffect,
    useState,
} from "react";
import StartGame from "./StartGame";
import { EventBus } from "./EventBus";
import ChatBox from "./components/ChatBox";

export const PhaserGame = forwardRef(function PhaserGame(props, ref) {
    const game = useRef();
    const [currentPlayer, setCurrentPlayer] = useState(null);

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

        EventBus.on("player-ready", (player) => {
            setCurrentPlayer(player);
        });

        return () => {
            EventBus.removeListener("current-scene-ready");
            EventBus.removeListener("player-ready");
        };
    }, [ref]);

    return (
        <div id="game-container">
            <ChatBox player={currentPlayer} />
        </div>
    );
});

PhaserGame.propTypes = {
    currentActiveScene: PropTypes.func,
};

