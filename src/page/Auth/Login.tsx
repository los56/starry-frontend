import { Visibility, VisibilityOff } from "@mui/icons-material";
import { Box, Button, FormControl, IconButton, InputAdornment, InputLabel, OutlinedInput, TextField } from "@mui/material";



import Logo from '../../logo.svg';
import { ChangeEvent, useState } from "react";
import { useNavigate } from "react-router";
import { getQueries } from "../../tools/PathParser";

import * as HttpClient from '../../tools/HttpClient';
import { useCookies } from "react-cookie";

interface InputState {
    username: string;
    password: string;
}

function Login() {
    const [cookies, setCookie, removeCookie] = useCookies();
    const [showPassword, setShowPassword] = useState(false);
    const [inputState, setInputState] = useState<InputState>({
        username: "", password :""
    })
    const navigate = useNavigate();

    const queries = getQueries();
    let redirect: string | undefined = undefined;

    if(queries.redirect) {
        redirect = queries.redirect;
    }

    const inputChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        setInputState({
            ...inputState,
            [e.currentTarget.name]: e.currentTarget.value
        })
    }

    const doLogin = () => {
        if(inputState.username.length < 1) {
            alert("아이디를 입력해주세요");
            return;
        }

        if(inputState.password.length < 1) {
            alert("비밀번호를 입력해주세요.");
            return;
        }

        HttpClient.post("/api/user/login", {
            username: inputState.username,
            password: inputState.password
        }).then(res => {
            console.log(res);
            setCookie('accessToken', res.data.accessToken);
            setCookie('refreshToken', res.data.refreshToken);
            navigate(redirect ? redirect : "/");
        }).catch(() => {
            alert("아이디 혹은 비밀번호가 잘못되었습니다.");
        })
    }

    const handleKeyDown = (e: any) => {
        if(e.key === "Enter") {
            doLogin();
        }
    }

    return (
        <Box 
            width={"100%"} height={"100%"} 
            display={"flex"} justifyContent={"center"}
            sx={{background: "white", left: 0, top: 0}} 
            position={"absolute"}>
            <Box
                width={480} height={480} alignSelf={"center"} 
                border={"1px solid black"}
                display={"flex"} flexDirection={"column"}
                padding={2} justifyContent={"center"} gap={1}>
                <Box textAlign={"center"}>
                    <img src={Logo} width={240}/>
                </Box>
                <TextField label="아이디" variant="outlined" name="username" value={inputState.username} 
                    onChange={inputChangeHandler} onKeyDown={handleKeyDown}></TextField>
                <FormControl variant="outlined">
                    <InputLabel>비밀번호</InputLabel>
                    <OutlinedInput value={inputState.password} name="password" onChange={inputChangeHandler}
                        type={showPassword ? "text" : "password"} onKeyDown={handleKeyDown}
                        endAdornment={
                        <InputAdornment position="end">
                            <IconButton edge="end" onClick={() => setShowPassword(!showPassword)}>
                                {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                        </InputAdornment>
                    }/>
                </FormControl>
                <Button variant="contained" onClick={doLogin}>로그인</Button>
                <Button variant="text" onClick={() => window.open("/register", "_blank")}>계정이 없으신가요? 회원가입</Button>
            </Box>
        </Box>
    )
}

export default Login;
