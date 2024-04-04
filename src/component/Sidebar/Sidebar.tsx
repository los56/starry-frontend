import { Avatar, Box } from '@mui/material';
import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/Hooks';

import * as HttpClient from '../../tools/HttpClient';
import { useNavigate } from 'react-router';

interface FollowingChannelData {
    channel: {
        id: string;
        nickname: string;
        profileImageUrl: string;
    };
    status: "LIVE" | "CLOSE",
    streamTitle: string;
    streamCategory: string;
}


function Sidebar() {
    const userInfo = useAppSelector(state => state.userinfo);
    const reqUpdate = useAppSelector(state => state.requestUpdate.value);
    const navigate = useNavigate();

    const [followings, setFollowings] = useState<FollowingChannelData[]>([]);

    useEffect(() => {
        if(!userInfo.isLogined) {
            return;
        } 
        HttpClient.authGet(`/api/channel/follow-list`).then(res => {
            setFollowings(res.data.list);
        }).catch(error => {
            console.error(error);
        })
    }, [userInfo, reqUpdate]);

    return (
        <Box
            maxWidth={"240px"} 
            width={"100%"} height={"100%"}
            bgcolor={"var(--background-gray)"} >
            <Box             
                display={"flex"}
                flexDirection={"column"}
                px={1} py={2}>
                <Box fontWeight={"bold"} mb={1} color={"gray"} fontSize={"0.9rem"}>
                    팔로잉 채널
                </Box>
                <ul>
                {
                    followings.map(v => (
                        <li key={v.channel.id}
                            onClick={() => navigate(v.status === "LIVE" ? `/stream/${v.channel.id}` :  `/channel/${v.channel.id}`)} 
                            style={{cursor: "pointer"}}>
                            <Box display={"flex"}>
                                <Avatar src={v.channel.profileImageUrl} sx={{border: (v.status === "LIVE") ? "2px solid red" : "none"}}/>
                                <Box ml={1}>
                                    <h4>{v.channel.nickname}</h4>
                                    {(v.status === "LIVE") ? 
                                        <span style={{fontSize: "0.85rem", color: "gray"}}>{v.streamCategory}</span> 
                                        : 
                                        <span style={{fontSize: "0.85rem", color: "gray"}}>오프라인</span>}
                                </Box>
                            </Box>
                        </li>
                    ))
                }
                </ul>
            </Box>
        </Box>
    );
}

export default Sidebar;