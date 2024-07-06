import { useState, useEffect, useRef, useCallback } from "react";
import styled from "styled-components";
import SocketManager from "../utils/SocketManager";

const ChatContainer = styled.div`
    display: ${({ $visible }) => ($visible ? "flex" : "none")};
    flex-direction: column;
    font-family: "BMJUA", sans-serif;
    width: 100%;
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
    const [visible, setVisible] = useState(false);
    const [message, setMessage] = useState("");
    const chatInputRef = useRef(null);

    const sendMessage = useCallback(() => {
        if (message.trim()) {
            SocketManager.emitChatMessage(message.substring(0, 20));
            setMessage("");
        }
        setVisible(false);
    }, [message]);

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === "Enter") {
                if (visible) {
                    sendMessage();
                } else {
                    setVisible(true);
                }
            }
        };

        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [visible, sendMessage]);

    useEffect(() => {
        if (visible) {
            chatInputRef.current.focus();
        }
    }, [visible]);

    return (
        <ChatContainer $visible={visible}>
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

