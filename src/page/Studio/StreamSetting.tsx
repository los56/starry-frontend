import FormGroup from "@mui/material/FormGroup";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import OutlinedInput from "@mui/material/OutlinedInput";
import Select from "@mui/material/Select";


import { ChangeEvent, useEffect, useState } from "react";

import { authGet, authPost } from "../../tools/HttpClient";

interface StreamInfo {
    streamTitle: string;
    streamCategory: string;
}

function StreamSetting() {
    const [streamInfo, setStreamInfo] = useState<StreamInfo>({
        streamTitle: "",
        streamCategory: ""
    });

    useEffect(() => {
        authGet("/api/channel/studio/stream-info").then(res => {
            console.log(res);
            setStreamInfo(res);
        }).catch(() => {
            console.error("error");
        });
    }, [])

    const onChangeTitle = (e: ChangeEvent<HTMLInputElement>) => {
        setStreamInfo({
            ...streamInfo,
            streamTitle: e.currentTarget.value
        })
    }

    const onChangeCategory = (e: any) => {
        setStreamInfo({
            ...streamInfo,
            streamCategory: (e.target.value)
        })
    }

    const applySetting = () => {
        authPost("/api/channel/studio/change-stream-info", streamInfo).then(res => {
            alert("적용되었습니다.")
        }).catch(() => {
            console.error("erorr")
        })
    }

    return (
        <Box
            width={"100%"}>
            <FormGroup>
                <label>방송 제목</label>
                <OutlinedInput size="small" value={streamInfo.streamTitle} onChange={onChangeTitle}></OutlinedInput>
            </FormGroup>
            <FormGroup>
                <label>방송 카테고리</label>
                <Select value={(streamInfo) ? streamInfo.streamCategory : ""} onChange={onChangeCategory}
                    size="small">
                    <MenuItem value={"Talking"}>Talking</MenuItem>
                    <MenuItem value={"Game"}>Game</MenuItem>
                    <MenuItem value={"Music"}>Music</MenuItem>
                </Select>
            </FormGroup>
            <Button variant="contained" type="button" onClick={applySetting}>적용하기</Button>
        </Box>
    )
}

export default StreamSetting;