import { useState } from "react";
import styled from "styled-components";
import ChatBox from "./ChatBox";
import ChatLog from "./ChatLog";

const Container = styled.div`
    position: fixed;
    bottom: 0;
    left: 20%;
    width: 30%;
    max-width: 400px;
    background-color: rgba(255, 255, 255, 0.5);
    border: 1px solid black;
    border-radius: 10px 10px 0 0;
    font-family: "BMJUA", sans-serif;
    padding: 10px;
    box-sizing: border-box;
`;

const ChatLogToggleContainer = styled.div`
    position: fixed;
    bottom: 0;
    left: 55%;
    width: 30%;
    max-width: 400px;
    background-color: rgba(255, 255, 255, 0.5);
    border: 1px solid black;
    border-radius: 10px 10px 0 0;
    font-family: "BMJUA", sans-serif;
    padding: 10px;
    box-sizing: border-box;
`;

const ToggleButton = styled.button`
    padding: 0.5em 1em;
    font-family: "BMJUA", sans-serif;
    cursor: pointer;
    margin-bottom: 10px;
`;

const ChatContainer = () => {
    const [isLogVisible, setIsLogVisible] = useState(false);

    return (
        <>
            <Container>
                <ChatBox />
            </Container>
            <ChatLogToggleContainer>
                <ToggleButton onClick={() => setIsLogVisible(!isLogVisible)}>
                    {isLogVisible ? "Hide Chat Log" : "Show Chat Log"}
                </ToggleButton>
                {isLogVisible && <ChatLog />}
            </ChatLogToggleContainer>
        </>
    );
};

export default ChatContainer;

