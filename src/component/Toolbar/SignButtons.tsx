import { Box, Button, Dialog, DialogContent, DialogTitle } from "@mui/material";
import axios from "axios";
import { ChangeEvent, FormEvent, useState } from "react";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router";

interface ModalShow {
    login: boolean,
    register: boolean
}

interface LoginInputs {
    username: string;
    password: string;
}

interface RegisterInputs {
    username: string;
    password: string;
    passwordRe: string;
    nickname: string;
    email: string;
    agreement: boolean;
}

interface DuplicateChecks {
    username: boolean;
    nickname: boolean;
    email: boolean;
}

function SignButtons() {
    const navigate = useNavigate();

    const moveToLogin = () => {
        const pathname = window.location.pathname;
        if(pathname != "/" && pathname != "") {
            navigate(`/login?redirect=${pathname}`);
        } else {
            navigate(`/login`);
        }
    }

    return (
        <Box display={"flex"} gap={1} mr="12px">
            <Button type="button" variant="contained" onClick={() => window.open("/register", "_blank")}>회원가입</Button>
            <Button type="button" variant="contained" onClick={() => moveToLogin()}>로그인</Button>
        </Box>
    );
}

export default SignButtons;