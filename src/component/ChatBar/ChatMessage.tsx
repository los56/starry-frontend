import { Box } from "@mui/material";
import { MouseEventHandler } from "react";

interface ChatData {
    sender: {
        id: string;
        nickname: string;
    };
    content: string;
    sendTime: number;
}

function ChatMessage({data, onClick}: {data: ChatData, onClick: MouseEventHandler}) {
    return (
        <Box onClick={onClick}>
            <span style={{marginRight: "4px"}}>{data.sender.nickname}</span>
            <span>{data.content}</span>
        </Box>
    )
}

export default ChatMessage;