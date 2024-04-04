import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import TextField from "@mui/material/TextField";

import { ChangeEvent, useState } from "react";

function ChannelWritePost() {
    const [content, setContent] = useState("");

    const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
        setContent(e.currentTarget.value);
    }

    const doWrite = () => {

    }

    return (
        <Box border={"1px solid gray"} borderRadius={"15px"}>
            <Box p={2}>
                <h3>글쓰기</h3>
            </Box>
            <TextField multiline rows={25} fullWidth placeholder="내용을 입력해주세요." value={content} onChange={handleOnChange}/>
            <Divider />
            <Box display={"flex"} justifyContent={"end"} alignItems={"center"} px={2} py={1} gap={1}>
                <span style={{fontSize: "0.85rem", color: "gray"}}>{content.length}/5000</span>
                <Button variant="contained">등록</Button>
            </Box>
        </Box>
    )
}

export default ChannelWritePost;