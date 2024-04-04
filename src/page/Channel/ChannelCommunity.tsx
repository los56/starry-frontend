import { useEffect, useState } from 'react';
import * as HttpClient from '../../tools/HttpClient';
import { Box, Button, CircularProgress, Pagination } from '@mui/material';
import { PostListData } from './types';
import ChannelPost from './ChannelPost';
import { useAppSelector } from '../../store/Hooks';
import { getId } from '../../tools/PathParser';
import { useNavigate, useParams } from 'react-router';

function ChannelCommunity() {
    const userInfo = useAppSelector(state => state.userinfo);

    const [page, setPage] = useState(1);
    const { channelId } = useParams();

    const navigate = useNavigate();

    const [postList, setPostList] = useState<PostListData | null>({
        page: -1, allPageCount: 0, allPostsCount: 0, posts: []
    })
    
    useEffect(() => {
        HttpClient.get(`/api/community/post?id=${channelId}&page=${page}`).then(res => {
            setPostList(res.data);
        }).catch(err => {
            alert("글 목록을 불러오는데 실패했습니다.");
            console.error(err);
            setPostList(null);
        })
    }, [channelId, page])

    if(!postList) {
        return (
            <Box>
                글 목록을 불러오지 못했습니다.
            </Box>
        )
    }

    if(postList.page === -1) {
        return (
            <Box justifyContent={"center"}>
                <CircularProgress />
            </Box>
        )
    }

    return (
        <Box display={"flex"} flexDirection={"column"} alignItems={"center"} gap={2}>
            {(userInfo.info && userInfo.info.id === channelId) && 
                <Box width={"100%"} textAlign={"end"} minHeight={"36.5px"}>
                    <Button onClick={() => navigate("../write")}>글쓰기</Button>
                </Box>
            }
            {postList.posts.map(v => <ChannelPost data={v}></ChannelPost>)}
            <Pagination count={postList.allPageCount} page={page} onChange={(e, v) => setPage(v)}/>
        </Box>
    )
}

export default ChannelCommunity;