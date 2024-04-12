import Add from "@mui/icons-material/Add";
import Remove from "@mui/icons-material/Remove";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

import { useEffect, useState } from "react";

import * as HttpClient from "../../tools/HttpClient";
import { useAppDispatch, useAppSelector } from "../../store/Hooks";
import { update } from "../../store/slice/RequestUpdateSlice";

function FollowButton({channelId}: {channelId: string}) {
    const [followed, setFollowed] = useState(false);
    const dispatch = useAppDispatch();

    const [dialogOpen, setDialogOpen] = useState(false);

    useEffect(() => {
        HttpClient.authGet(`/api/channel/relation?channelId=${channelId}`).then(res => {
            setFollowed(res.data.following);
        }).catch(error => {
            console.error(error);
        });
    }, [])
    
    const follow = () => {
        HttpClient.authGet(`/api/channel/follow?to=${channelId}`).then(res => {
            if(res.data === true) {
                setFollowed(true);
                dispatch(update());
            }
        }).catch(err => {
            console.error(err);
        })
    }

    const unfollow = () => {
        HttpClient.authGet(`/api/channel/un-follow?to=${channelId}`).then(res => {
            if(res.data === true) {
                setFollowed(false);
                dispatch(update());
            }
        }).catch(err => {
            console.error(err);
        })
    }

    return (
        <>
        {
            followed ?
            <Button variant="contained" sx={{background: "var(--main-color)", color: "black"}} onClick={() => setDialogOpen(true)}>
                <Remove />
                언팔로우
            </Button>
            :
            <Button variant="contained" sx={{background: "var(--main-color)", color: "black"}} onClick={() => follow()}>
                <Add />
                팔로우
            </Button>
        }  

        <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
            <DialogTitle>
                언팔로우
            </DialogTitle>
            <DialogContent>
                <DialogContentText>
                    언팔로우 하시겠습니까?
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => setDialogOpen(false)}>취소</Button>
                <Button onClick={() => {setDialogOpen(false); unfollow();}}>확인</Button>
            </DialogActions>
        </Dialog>
        </>
    )
}

export default FollowButton;