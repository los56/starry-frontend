import { ArrowBack, Visibility, VisibilityOff } from "@mui/icons-material";
import { Box, Button, Divider, FormControl, FormControlLabel, IconButton, InputAdornment, InputLabel, OutlinedInput, TextField, Checkbox } from "@mui/material";
import { ChangeEvent, useState } from "react";
import { useNavigate } from "react-router";
import { getQueries } from "../../tools/PathParser";

import * as HttpClient from '../../tools/HttpClient';

interface InputState {
    username: string;
    password: string;
    passwordre: string;
    nickname: string;
    email: string;
    eula: boolean;
    validate: {
        username: boolean;
        nickname: boolean;
        email: boolean;
    }
}

const initialState: InputState = {
    username: "", password: "", passwordre: "", nickname: "", email: "", eula: false,
    validate: {username: false, nickname: false, email: false}
}

function Register() {
    const navigate = useNavigate();
    const queries = getQueries();

    const [showPassword, setShowPassword] = useState(false);
    const [inputState, setInputState] = useState<InputState>({
        ...initialState
    });

    const inputChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        const nextState = {
            ...inputState,
            [e.currentTarget.name]: e.currentTarget.value
        };

        switch(e.currentTarget.name) {
            case "id":
                nextState.validate.username = false;
                break;
            case "nickname":
                nextState.validate.nickname = false;
                break;
            case "email":
                nextState.validate.email = false;
                break;
        }

        setInputState(nextState);
    }

    const checkValidate = () => {
        if(inputState.username.length < 1) {
            alert("아이디를 입력해주세요.");
            return false;
        }

        if(!inputState.validate.username) {
            alert("아이디 중복검사를 해주세요.");
            return false;
        }

        if(inputState.password.length < 1) {
            alert("비밀번호를 입력해주세요.");
            return false;
        }

        if(inputState.password.length < 8) {
            alert("비밀번호는 8자리 이상이어야 합니다.");
            return false;
        }

        if(inputState.passwordre.length < 1) {
            alert("비밀번호 확인을 입력해주세요.");
            return false;
        }

        if(inputState.password != inputState.passwordre) {
            alert("비밀번호와 비밀번호 확인이 일치하지 않습니다.");
            return false;
        }

        if(inputState.nickname.length < 1) {
            alert("닉네임을 입력해주세요");
            return false;
        }

        if(!inputState.validate.nickname) {
            alert("닉네임 중복 확인을 해주세요");
            return false;
        }

        if(inputState.email.length < 1) {
            alert("이메일을 입력해주세요.");
            return false;
        }

        if(!inputState.validate.email) {
            alert("이메일 중복확인을 해주세요.");
            return false;
        }

        return true;
    }

    const doSubmit = () => {
        if(!checkValidate()) {
            return;
        }

        HttpClient.post("/api/user/register", {
            username: inputState.username,
            password: inputState.password,
            nickname: inputState.nickname,
            email: inputState.email
        }).then(res => {
            alert("회원가입되었습니다.");
            navigate("/login");
        }).catch(err => {
            alert("오류가 발생했습니다.");
            console.error(err);
        })
    }

    const eulaChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        setInputState({
            ...inputState,
            eula: !inputState.eula
        });
    }

    const checkUsername = () => {
        if(inputState.username.length < 1) {
            alert("아이디를 입력해주세요.");
            return;
        }

        HttpClient.get(`/api/user/duplicate?method=username&data=${inputState.username}`).then(res => {
            const nextState = {
                ...inputState
            };
            if(res.data === true) {
                alert("아이디 중복입니다.");
                return;
            }
            nextState.validate.username = true;
            setInputState(nextState);
        }).catch(() => {
            alert("서버 오류입니다.")
        })
    }

    const checkNickname = () => {
        if(inputState.nickname.length < 1) {
            alert("닉네임을 입력해주세요.");
            return;
        }

        HttpClient.get(`/api/user/duplicate?method=nickname&data=${inputState.nickname}`).then(res => {
            const nextState = {
                ...inputState
            };
            if(res.data === true) {
                alert("닉네임 중복입니다.");
                return;
            }
            nextState.validate.nickname = true;
            setInputState(nextState);
        }).catch(() => {
            alert("서버 오류입니다.")
        })
    }

    const checkEmail = () => {
        if(inputState.email.length < 1) {
            alert("이메일을 입력해주세요.");
            return;
        }

        HttpClient.get(`/api/user/duplicate?method=email&data=${inputState.email}`).then(res => {
            const nextState = {
                ...inputState
            };
            if(res.data === true) {
                alert("이메일 중복입니다.");
                return;
            }
            nextState.validate.email = true;
            setInputState(nextState);
        }).catch(() => {
            alert("서버 오류입니다.")
        })
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
                <Box display={"flex"} alignItems={"center"} justifyContent={"center"}>
                    <span style={{height: "fit-content", fontSize: "1.25rem", fontWeight: 'bold'}}>회원가입</span>
                </Box>
                <Divider/>
                <Box
                    display={"flex"} flexDirection={"column"}
                    textAlign={"center"} gap={1} mt={2} >
                    <FormControl variant="outlined">
                        <InputLabel>아이디</InputLabel>
                        <OutlinedInput name={"username"} value={inputState.username} onChange={inputChangeHandler} endAdornment={
                            <InputAdornment position="end">
                                <Button variant="outlined" onClick={checkUsername}>
                                    중복 확인
                                </Button>
                            </InputAdornment>
                        }/>
                    </FormControl>
                    <FormControl variant="outlined">
                        <InputLabel>비밀번호</InputLabel>
                        <OutlinedInput name={"password"} value={inputState.password} onChange={inputChangeHandler}
                            type={showPassword ? "text" : "password"} 
                            endAdornment={
                            <InputAdornment position="end">
                                <IconButton edge="end" onClick={() => setShowPassword(!showPassword)}>
                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                        }/>
                    </FormControl>
                    <FormControl variant="outlined">
                        <InputLabel>비밀번호 확인</InputLabel>
                        <OutlinedInput name={"passwordre"} value={inputState.passwordre} onChange={inputChangeHandler}
                        type={showPassword ? "text" : "password"} 
                        endAdornment={
                            <InputAdornment position="end">
                                <IconButton edge="end" onClick={() => setShowPassword(!showPassword)}>
                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                        }/>
                    </FormControl>
                    <FormControl variant="outlined">
                        <InputLabel>닉네임</InputLabel>
                        <OutlinedInput name={"nickname"} value={inputState.nickname} onChange={inputChangeHandler}
                            endAdornment={
                            <InputAdornment position="end">
                                <Button variant="outlined" onClick={checkNickname}>
                                    중복 확인
                                </Button>
                            </InputAdornment>
                        }/>
                    </FormControl>                
                    <FormControl variant="outlined">
                        <InputLabel>이메일</InputLabel>
                        <OutlinedInput name={"email"} value={inputState.email} onChange={inputChangeHandler}
                            endAdornment={
                            <InputAdornment position="end">
                                <Button variant="outlined" onClick={checkEmail}>
                                    중복 확인
                                </Button>
                            </InputAdornment>
                        }/>
                    </FormControl>
                    <FormControlLabel 
                        label={
                        <InputLabel>
                            <a href="/eula.html" target="_blank">Starry 이용약관</a>
                            <span>에 동의합니다.</span>
                        </InputLabel>
                        }
                        control={<Checkbox checked={inputState.eula} name="eula" onChange={eulaChangeHandler}/>}
                    />
                    <Button variant="contained" onClick={() => doSubmit()}>회원가입</Button>
                </Box>
            </Box>
        </Box>
    )
}

export default Register;