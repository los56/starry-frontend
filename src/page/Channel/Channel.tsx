import CallMade from "@mui/icons-material/CallMade";

import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";

import { useEffect, useState } from "react";
import { Route, Routes, useNavigate, useParams } from "react-router";

import * as HttpClient from '../../tools/HttpClient';
import ChannelCommunity from "./ChannelCommunity";
import ChannelVideos from "./ChannelVideos";
import ChannelHome from "./ChannelHome";
import ChannelWritePost from "./ChannelWritePost";

interface ChannelData {
    id: string;
    nickname: string;
    description: string;
    verified: boolean;
    bannerUrl?: string;
}

function Channel() {
    const [tabIndex, setTabIndex] = useState(0);
    const [channelData, setChannelData] = useState<ChannelData | null>({
        id: "", nickname: "", description: "", verified: false
    });
    const navigate = useNavigate();
    const {channelId} = useParams();

    const basePath = `/channel/${channelId}`;
    const pathSearch = window.location.search;

    useEffect(() => {
        setTabIndex(0);
        if(!channelId) {
            return;
        }
        HttpClient.get(`/api/channel?id=${channelId}`).then(res => {
            setChannelData(res.data);
        }).catch(() => {
            console.error("error");
            setChannelData(null);
        })
    }, [channelId]);

    if(!channelId || !channelData) {
        return (
            <Box m={"auto auto"} textAlign={"center"}>
                <p>존재하지 않는 채널입니다.</p>
                <p>스튜디오에서 채널을 개설해보세요!</p>
            </Box>
        )
    }

    if(channelData.id === "") {
        <Box m={"auto auto"} textAlign={"center"}>
            <CircularProgress />
        </Box>
    }

    const moveTab = (index: number) => {
        setTabIndex(index);
        switch(index) {
            case 0:
                navigate(`${basePath}`);
                break;
            case 1:
                navigate(`${basePath}/videos`);
                break;
            case 2:
                navigate(`${basePath}/community`);
                break;
            case 3:
                navigate(`${basePath}/info`);
                break;
        }
    }

    return (
        <Box width={"100%"} display={"flex"} flexDirection={"column"} p={"24px"}>
            <Box display={"flex"} flexDirection={"row"} alignItems={"center"}>
                <Avatar />
                <Box ml={2}>
                    <h2 style={{margin: 0}}>{channelData.nickname}</h2>
                    <div style={{height: "18px"}}>{channelData.description}</div>
                </Box>
            </Box>
            <Box>
                <Button sx={tabIndex === 0 ? activeTabButtonSx : nonActiveTabButtonSx} onClick={() => moveTab(0)}>홈</Button>
                <Button sx={tabIndex === 1 ? activeTabButtonSx : nonActiveTabButtonSx} onClick={() => moveTab(1)}>동영상</Button>
                <Button sx={tabIndex === 2 ? activeTabButtonSx : nonActiveTabButtonSx} onClick={() => moveTab(2)}>커뮤니티</Button>
                <Button sx={tabIndex === 3 ? activeTabButtonSx : nonActiveTabButtonSx} onClick={() => moveTab(3)}>정보</Button>
                <Box
                    display={"flex"} minWidth={"64px"} lineHeight={"1.75"} 
                    justifyContent={"center"} alignItems={"center"} p={"6px 8px"}
                    sx={{...nonActiveTabButtonSx, ...buttonTransition, float: "right", cursor: "pointer", ":hover": {background: "rgba(25, 118, 210, 0.04)"}}} onClick={() => navigate(`/stream/${channelId}`)}>
                    <CallMade sx={{fontSize: "1rem", verticalAlign: "middle", mr: "3px"}}/>
                    <p>채팅</p>
                </Box>
            </Box>
            <Box py={1}>
                <Routes>
                    <Route path="" element={<ChannelHome />} />
                    <Route path="/videos" element={<ChannelVideos />} />
                    <Route path="/community" element={<ChannelCommunity />} />
                    <Route path="/info" element={<div>정보</div>} />
                    <Route path="/write" element={<ChannelWritePost />} />
                </Routes>
            </Box>
        </Box>
    )
}

const nonActiveTabButtonSx = {
    color: "gray",
    fontSize: "0.95rem",
    fontWeight: "bold",
}

const activeTabButtonSx = {
    ...nonActiveTabButtonSx,
    color: "black",
    background: "var(--select-point)",
}

const buttonTransition = {
    transition: "background-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms, box-shadow 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms, border-color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms, color 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms" 
}


export default Channel;