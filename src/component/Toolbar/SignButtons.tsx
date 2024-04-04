import Box from "@mui/material/Box";
import Button from "@mui/material/Button";

import { useNavigate } from "react-router";

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