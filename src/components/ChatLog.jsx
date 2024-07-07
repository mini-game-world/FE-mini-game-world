import { useEffect, useState, useRef } from "react";
import styled from "styled-components";
import { EventBus } from "../EventBus";

const ChatLogContainer = styled.div`
    width: 100%;
    max-height: ${({ $visible }) =>
        $visible ? "150px" : "0"}; /* Reduced scrolling by half */
    background-color: rgba(255, 255, 255, 0.7);
    border: 1px solid black;
    border-radius: 10px;
    font-family: "BMJUA", sans-serif;
    padding: ${({ $visible }) => ($visible ? "10px" : "0")};
    box-sizing: border-box;
    overflow-y: auto;
    transition: max-height 0.3s ease, padding 0.3s ease;
    cursor: pointer;
`;

const Message = styled.div`
    padding: 5px;
    border-bottom: 1px solid #ddd;
    font-size: 0.9em; /* Reduced text size slightly */
    color: black; /* Changed text color to black */
`;

const ClearButton = styled.button`
    margin-top: 10px;
    padding: 0.5em 1em;
    font-family: "BMJUA", sans-serif;
    cursor: pointer;
    background-color: #f44336; /* Red background */
    color: white; /* White text */
    border: none;
    border-radius: 5px;
    display: ${({ $visible }) => ($visible ? "block" : "none")};
`;

const ChatLog = () => {
    const [messages, setMessages] = useState([]);
    const [visible, setVisible] = useState(true);
    const chatLogRef = useRef(null);

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

    useEffect(() => {
        if (chatLogRef.current) {
            chatLogRef.current.scrollTop = chatLogRef.current.scrollHeight;
        }
    }, [messages]);

    const clearChatLog = (e) => {
        e.stopPropagation();
        setMessages([]);
    };

    const toggleVisibility = () => {
        setVisible(!visible);
    };

    return (
        <div onClick={toggleVisibility}>
            <ChatLogContainer ref={chatLogRef} $visible={visible}>
                {messages.map((msg, index) => (
                    <Message key={index}>{msg}</Message>
                ))}
            </ChatLogContainer>
            <ClearButton $visible={visible} onClick={clearChatLog}>
                Clear Chat Log
            </ClearButton>
        </div>
    );
};

export default ChatLog;

