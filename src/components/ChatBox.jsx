import { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import SocketManager from "../utils/SocketManager";

const ChatBox = ({ player }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [message, setMessage] = useState("");
    const chatInputRef = useRef(null);

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === "Enter") {
                if (isVisible) {
                    sendMessage();
                } else {
                    setIsVisible(true);
                }
            } else if (event.key === "Escape") {
                setIsVisible(false);
            }
        };

        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [isVisible]);

    useEffect(() => {
        if (isVisible) {
            chatInputRef.current.focus();
        }
    }, [isVisible]);

    const sendMessage = () => {
        if (message.trim() && player) {
            SocketManager.emitChatMessage(message.substring(0, 20));
            setMessage("");
        }
        setIsVisible(false);
    };

    return (
        <div
            id="chat-container"
            style={{
                display: isVisible ? "flex" : "none",
                position: "fixed",
                top: "70%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                height: "auto",
                width: "90%",
                maxWidth: "1000px",
                backgroundColor: "white",
                border: "1px solid black",
                flexDirection: "column",
                borderRadius: "10px",
                fontFamily: "'BMJUA', sans-serif",
            }}
        >
            <div
                id="chat-input-wrapper"
                style={{
                    display: "flex",
                    flexDirection: "row",
                    background: "lightblue",
                    borderRadius: "10px",
                    fontFamily: "'BMJUA', sans-serif",
                }}
            >
                <input
                    id="chat-input"
                    type="text"
                    placeholder="대화를 입력해주세요"
                    style={{
                        flex: 1,
                        padding: "1em",
                        fontSize: "1em",
                        border: "none",
                        borderRadius: "10px",
                        fontFamily: "'BMJUA', sans-serif",
                    }}
                    ref={chatInputRef}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={(e) => {
                        e.stopPropagation();
                        if (e.key === "Enter") {
                            sendMessage();
                        }
                    }}
                />
            </div>
        </div>
    );
};

ChatBox.propTypes = {
    player: PropTypes.object,
};

export default ChatBox;

