import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import axios from "axios";
import Hls from "hls.js";
import ChatBar from "../../component/ChatBar/ChatBar";
import { Avatar, Box, Button, Divider } from "@mui/material";
import * as HttpClient from '../../tools/HttpClient'
import FollowButton from "../../component/FollowButton/FollowButton";

interface StreamInfo { 
    channel: {
        bannerUrl: string | null;
        description: string;
        id: string;
        nickname: string;
        verified: boolean
    };
    status: "LIVE" | "CLOSE";
    streamId: string | null;
    streamTitle: string;
    streamCategory: string;
}

function Stream() {
    const videoRef = useRef<HTMLVideoElement>(null);
    const location = useLocation();
    const navigate = useNavigate();

    const [channelData, setChannelData] = useState<StreamInfo>();

    useEffect(() => {
        const paths = location.pathname.split("/");
        let channelId = "";
        for(let k of paths) {
            if(k.length === 32) {
                channelId = k;
            }
        }
        
        HttpClient.get("/api/stream/live?channel=" + channelId).then(res => {
            if(res.data.status == "LIVE") {
                const videoSrc = `http://localhost:8081/hls/${res.data.streamId}.m3u8`;

                if(Hls.isSupported()) {
                    const hls = new Hls();
                    hls.loadSource(videoSrc);
                    hls.attachMedia(videoRef.current as any);
                }
            }

            setChannelData(res.data);
        });
    }, [])

    if(!channelData) {
        return (<div></div>)
    }

    return (
        <Box display={"flex"} width={"100%"} justifyContent={"space-between"} overflow={"auto"}>
            <Box display={"flex"} flexDirection={"column"} height={"80%"} width={"100%"}>
                <Box flexGrow={1}>
                    <video style={{width: "100%", height: "100%"}} ref={videoRef} controls/>
                </Box>
                <Box mx={2} mt={1}>
                    <h2 style={{margin: "8px 0"}}>{channelData?.streamTitle}</h2>
                    <Box display={"flex"} flexDirection={"row"} alignItems={"center"}>
                        <div style={{cursor: "pointer"}} onClick={() => navigate(`/channel/${channelData?.channel.id}`)}>
                            <Avatar sx={{width: 64, height: 64}}/>
                        </div>
                        <Box ml={1}>
                            <h3 style={{margin: 0, cursor: "pointer"}} onClick={() => navigate(`/channel/${channelData?.channel.id}`)}>{channelData?.channel.nickname}</h3>
                            <div>
                                <div>{}</div>
                                <div>{channelData?.streamCategory}</div>
                            </div>
                            <Box display={"flex"} gap={1} color={"gray"} fontSize={"0.9rem"}>
                                <span>0명 시청 중</span>
                                <Divider orientation="vertical" flexItem/>
                                <span>업타임 00:00:00</span>
                            </Box>
                        </Box>
                        <Box justifySelf={"end"} ml={"auto"}>
                            <FollowButton channelId={channelData.channel.id}/>
                        </Box>
                    </Box>
                </Box>
            </Box>
            <ChatBar />
        </Box>
    )
}

export default Stream;
