import { useState, useEffect, useRef, useCallback } from "react";
import styled from "styled-components";
import SocketManager from "../utils/SocketManager";

const ChatContainer = styled.div`
    display: ${({ isVisible }) => (isVisible ? "flex" : "none")};
    position: fixed;
    bottom: 0;
    left: 20%;
    width: 40%;
    max-width: 400px;
    background-color: rgba(255, 255, 255, 0.5);
    border: 1px solid black;
    flex-direction: column;
    border-radius: 10px 10px 0 0;
    font-family: "BMJUA", sans-serif;
    padding: 10px;
    box-sizing: border-box;
`;

const ChatInputWrapper = styled.div`
    display: flex;
    flex-direction: row;
    background: lightblue;
    border-radius: 10px;
    font-family: "BMJUA", sans-serif;
`;

const ChatInput = styled.input`
    flex: 1;
    padding: 1em;
    font-size: 1em;
    border: none;
    border-radius: 10px;
    font-family: "BMJUA", sans-serif;
`;

const ChatBox = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [message, setMessage] = useState("");
    const chatInputRef = useRef(null);

    const sendMessage = useCallback(() => {
        if (message.trim()) {
            SocketManager.emitChatMessage(message.substring(0, 20));
            setMessage("");
        }
        setIsVisible(false);
    }, [message]);

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === "Enter") {
                if (isVisible) {
                    sendMessage();
                } else {
                    setIsVisible(true);
                }
            }
        };

        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [isVisible, sendMessage]);

    useEffect(() => {
        if (isVisible) {
            chatInputRef.current.focus();
        }
    }, [isVisible]);

    return (
        <ChatContainer isVisible={isVisible}>
            <ChatInputWrapper>
                <ChatInput
                    type="text"
                    placeholder="대화를 입력해주세요"
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
            </ChatInputWrapper>
        </ChatContainer>
    );
};

export default ChatBox;

