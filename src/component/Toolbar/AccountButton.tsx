import AccountCircle from "@mui/icons-material/AccountCircle";
import Box from "@mui/material/Box"
import Button from "@mui/material/Button" 
import Divider from "@mui/material/Divider" 
import IconButton from "@mui/material/IconButton";

import { useEffect, useRef, useState } from "react";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router";

import { useAppDispatch, useAppSelector } from "../../store/Hooks";
import { update } from "../../store/slice/UserInfoSlice";
import * as HttpClient from "../../tools/HttpClient";

export interface UserInfo {
    id: string;
    username: string;
    nickname: string;
    passwordChangeDate: Date;
}

function AccountButton() {
    const [cookies, setCookie, removeCookie] = useCookies();
    const [showOverlay, setShowOverlay] = useState(false);

    const userInfo = useAppSelector(state => state.userinfo);
    const dispatch = useAppDispatch();

    const menuRef = useRef<HTMLDivElement>(null);

    const navigate = useNavigate();

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        HttpClient.authGet("/api/user/user-info").then(res => {
            dispatch(update(res.data));
        }).catch(() => {
            console.error("사용자 정보를 불러오는 데 실패했습니다.")
        });

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        }
    }, [])

    const handleOpenOverlay = (e: any) => {
        setShowOverlay(!showOverlay);
    }

    const handleClickOutside = (e: any) => {
        if(!menuRef.current) {
            return;
        }

        if(!menuRef.current.contains(e.target)) {
            setShowOverlay(false)
        }
    }

    const logout = () => {
        removeCookie('accessToken');
        removeCookie('refreshToken')
    }

    const handleClickButton = (destURL: string) => {
        setShowOverlay(false);
        navigate(destURL);
    }

    if(!userInfo.info) {
        return <span></span>
    }

    return (
        <span ref={menuRef}>
            <IconButton onClick={handleOpenOverlay}>
                <AccountCircle sx={{fontSize: '2rem'}}/>
            </IconButton>

            {showOverlay && (
                <Box 
                    position={"absolute"}
                    right={"8px"}
                    top={`${45.25}px`}
                    zIndex={100} width={"120px"}
                    bgcolor={"gray"}
                    borderRadius={"7px"}>
                    <Box display={"flex"} flexDirection={"column"}>
                        <Button type="button" color="inherit" onClick={() => handleClickButton("/studio")}>스튜디오</Button>
                        <Button type="button" color="inherit" onClick={() => handleClickButton(`/channel/${userInfo.info?.id}`)}>내 채널</Button>
                        <Divider />
                        <Button type="button"color="inherit" onClick={() => handleClickButton("/mypage")}>정보 수정</Button>
                        <Button type="button" color="inherit" onClick={logout}>로그아웃</Button>
                    </Box>
                </Box>
            )}
        </span>
    )
}

export default AccountButton;