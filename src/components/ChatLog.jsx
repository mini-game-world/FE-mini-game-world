import { useEffect, useState } from "react";
import styled from "styled-components";
import { EventBus } from "../EventBus";

const ChatLogContainer = styled.div`
    max-height: 300px;
    background-color: rgba(255, 255, 255, 0.7);
    border: 1px solid black;
    border-radius: 10px;
    font-family: "BMJUA", sans-serif;
    padding: 10px;
    box-sizing: border-box;
    overflow-y: auto;
`;

const Message = styled.div`
    padding: 5px;
    border-bottom: 1px solid #ddd;
`;

const ChatLog = () => {
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        const handleNewMessage = ({ nickname, message }) => {
            setMessages((prevMessages) => [
                ...prevMessages,
                `${nickname}: ${message}`,
            ]);
        };

        EventBus.on("chat message", handleNewMessage);

        return () => {
            EventBus.off("chat message", handleNewMessage);
        };
    }, []);

    return (
        <ChatLogContainer>
            {messages.map((msg, index) => (
                <Message key={index}>{msg}</Message>
            ))}
        </ChatLogContainer>
    );
};

export default ChatLog;

