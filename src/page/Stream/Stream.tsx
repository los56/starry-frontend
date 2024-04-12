import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";

import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import Hls from "hls.js";

import * as HttpClient from '../../tools/HttpClient'
import ChatBar from "../../component/ChatBar/ChatBar";
import FollowButton from "../../component/FollowButton/FollowButton";
import { useAppSelector } from "../../store/Hooks";

interface StreamData { 
    channel: {
        bannerUrl: string | null;
        description: string;
        id: string;
        nickname: string;
        verified: boolean
    };
    status: "LIVE" | "CLOSE";
    streamId: string;
    streamTitle: string;
    streamCategory: string;
    viewersCount?: number
}

function Stream() {
    const videoRef = useRef<HTMLVideoElement>(null);
    const location = useLocation();
    const navigate = useNavigate();

    const userInfo = useAppSelector(state => state.userinfo);

    const [streamData, setStreamData] = useState<StreamData>();

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
                const videoSrc = `/media/hls/${res.data.streamId}.m3u8`;

                if(Hls.isSupported()) {
                    const hls = new Hls();
                    hls.loadSource(videoSrc);
                    hls.attachMedia(videoRef.current as any);
                }
            }

            setStreamData(res.data);
        });

        const refreshEvent = setTimeout(() => {
            refresh(channelId);
        }, 5000);
    }, []);

    const refresh = (channelId: string) => {
        HttpClient.get("/api/stream/live?channel=" + channelId).then(res => {
            if(res.data.status == "LIVE" && !videoRef.current?.src) {
                const videoSrc = `/media/hls/${res.data.streamId}.m3u8`;

                if(Hls.isSupported()) {
                    const hls = new Hls();
                    hls.loadSource(videoSrc);
                    hls.attachMedia(videoRef.current as any);
                }
            }

            setStreamData(res.data);
            setTimeout(() => refresh(channelId), 5000);
        });
    }


    if(!streamData) {
        return (<div></div>)
    }

    return (
        <Box display={"flex"} width={"100%"} justifyContent={"space-between"} overflow={"auto"}>
            <Box display={"flex"} flexDirection={"column"} height={"80%"} width={"100%"}>
                <Box flexGrow={1}>
                    <video style={{width: "100%", height: "100%"}} ref={videoRef} controls/>
                </Box>
                <Box mx={2} mt={1}>
                    <h2 style={{margin: "8px 0"}}>{streamData?.streamTitle}</h2>
                    <Box display={"flex"} flexDirection={"row"} alignItems={"center"}>
                        <div style={{cursor: "pointer"}} onClick={() => navigate(`/channel/${streamData?.channel.id}`)}>
                            <Avatar sx={{width: 64, height: 64}}/>
                        </div>
                        <Box ml={1}>
                            <h3 style={{margin: 0, cursor: "pointer"}} onClick={() => navigate(`/channel/${streamData?.channel.id}`)}>{streamData?.channel.nickname}</h3>
                            <div>
                                <div>{}</div>
                                <div>{streamData?.streamCategory}</div>
                            </div>
                            {streamData.status === "LIVE" &&
                                <Box display={"flex"} gap={1} color={"gray"} fontSize={"0.9rem"}>
                                    <span>{streamData.viewersCount}명 시청 중</span>
                                    <Divider orientation="vertical" flexItem/>
                                    <span>업타임 00:00:00</span>
                                </Box>
                            }
                        </Box>
                        <Box justifySelf={"end"} ml={"auto"}>
                            {userInfo.info?.id != streamData.channel.id && <FollowButton channelId={streamData.channel.id}/>}
                        </Box>
                    </Box>
                </Box>
            </Box>
            <ChatBar channelId={streamData.channel.id} streamId={streamData.streamId}/>
        </Box>
    )
}

export default Stream;
