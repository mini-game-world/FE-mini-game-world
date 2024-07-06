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

const ChatLogContainer = styled.div`
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

const ChatContainer = () => {
    return (
        <>
            <Container>
                <ChatBox />
            </Container>
            <ChatLogContainer>
                <ChatLog />
            </ChatLogContainer>
        </>
    );
};

export default ChatContainer;

