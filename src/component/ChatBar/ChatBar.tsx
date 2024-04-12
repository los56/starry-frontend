import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

import * as StompJs from '@stomp/stompjs';
import { ChangeEvent, KeyboardEventHandler, ReactNode, UIEventHandler, useEffect, useRef, useState } from 'react';
import ChatMessage from './ChatMessage';
import { useCookies } from 'react-cookie';
import { useAppSelector } from '../../store/Hooks';
import { Divider } from '@mui/material';

interface ChatData {
    sender: {
        id: string;
        nickname: string;
    };
    content: string;
    sendTime: number;
}

function ChatBar({channelId, streamId}: {channelId: string, streamId: string}) {
    const [cookies, setCookies, removeCookies] = useCookies();
    const userInfo = useAppSelector(state => state.userinfo);

    const client = useRef<any>({});
    const chatContainerRef = useRef<HTMLDivElement>(null);
    const [chats, setChats] = useState<ChatData[]>([]);
    const [myMessage, setMyMessage] = useState("");
    const [moveScroll, setMoveScroll] = useState(false);

    const onReceiveMessage = (message: StompJs.Message) => {
        const messageJson: ChatData = JSON.parse(message.body);
        setChats((bef) => [...bef, messageJson]);
    }
    
    const sendMessage = () => {
        if(!client.current) {
            return;
        }

        if(!userInfo.info) {
            console.log("info not")
            return;
        }

        if(myMessage.length < 1) {
            return;
        }

        (client.current as StompJs.Client).publish({
            destination: `/send/`,
            body: JSON.stringify({
                roomId: streamId,
                senderId: userInfo.info.id,
                content: myMessage
            })
        });
        setMyMessage("");
    }

    const subscribe = () => {
        if(!client.current || !client.current.connect) {
            console.error("Failed connect to chat server");
        }

        (client.current as StompJs.Client).subscribe(`/subscribe/${streamId}`, onReceiveMessage)
    }

    const connect = () => {
        client.current = new StompJs.Client({
            brokerURL: `ws://${window.location.host}/api/chat`,
            onConnect: () => {
                console.log();
                subscribe();
            },
            connectHeaders: {
                channelId: channelId,
                streamId: streamId,
                accessToken: `Bearer ${cookies.accessToken}`
            }
        });
        (client.current as StompJs.Client).activate();
    }

    const disconnect = () => {
        (client.current as StompJs.Client).deactivate();
    }

    const onChangeMyMessage = (e: ChangeEvent<HTMLInputElement>) => {
        setMyMessage(e.currentTarget.value);
    }

    const onScrollContainer: UIEventHandler = (e) => {
        const isBottom = e.currentTarget.scrollHeight - e.currentTarget.clientHeight <= e.currentTarget.scrollTop + 1;
        if(isBottom) {
            setMoveScroll(false);
        } else {
            setMoveScroll(true);
        }
    }

    const onClickToLiveChat = () => {
        setMoveScroll(false);
        chatContainerRef.current?.lastElementChild?.scrollIntoView();
    }

    const onKeyDownInMessageInput: KeyboardEventHandler = (e) => {
        // Prevent twice send when korean message
        if(e.nativeEvent.isComposing) {
            return;
        }

        if(e.code === "Enter") {
            sendMessage();
        }
    }

    useEffect(() => {
        connect();
        return () => {
            disconnect();
        }
    }, [])
    
    useEffect(() => {
        if(!moveScroll) {
            chatContainerRef.current?.lastElementChild?.scrollIntoView();
        }
    }, [chats])

    return (
        <Box 
            maxWidth={"360px"} width={"100%"} 
            bgcolor={"var(--background-gray)"}>
            <Box display={"flex"} flexDirection={"column"} height={"100%"} px={2}>
                <Box my={1} textAlign={"center"}>
                    <h3>채팅</h3>
                </Box>
                <Divider />
                <Box width={"100%"} height={"100%"} my={1} position={"relative"} overflow={"hidden"}>
                    <Box width="100%" height={"100%"} overflow={"hidden auto"} ref={chatContainerRef} onScroll={onScrollContainer}>
                        {chats.map(v => <ChatMessage data={v} onClick={() => console.log(v.sender.id)}></ChatMessage>)}
                    </Box>
                </Box>
                {moveScroll && 
                    <Box display={"flex"} position={"absolute"} 
                    right="120px" bottom="100px" 
                    justifyContent={"center"} 
                    px={2} py={1} borderRadius={"12px"}
                    bgcolor={"black"} color="white" fontWeight={"bold"}
                    sx={{cursor: "pointer"}} onClick={onClickToLiveChat}>
                        실시간 채팅으로
                    </Box>
                }
                <Box mb={1}>
                    <TextField size='small' fullWidth value={myMessage} onChange={onChangeMyMessage} onKeyDown={onKeyDownInMessageInput}/>
                    <Button sx={{float: 'right'}} onClick={sendMessage}>채팅</Button>
                </Box>
            </Box>
        </Box>
    );
}

export default ChatBar;