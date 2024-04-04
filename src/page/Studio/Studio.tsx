import Box from "@mui/material/Box";

import { useState } from "react";
import { useCookies } from "react-cookie";

import StudioSideBar from "./StudioSideBar";
import StreamBroadcast from "./StreamBroadCast";
import StreamSetting from "./StreamSetting";

export enum StudioPages {
    "Dashboard",
    "StreamSetting",
    "StreamBroadcast"
}

function Studio() {
    const [cookies, setCookie, removeCookie] = useCookies();
    const [page, setPage] = useState<StudioPages>(StudioPages.Dashboard);

    if(!cookies.accessToken) {
        return (<div>
            로그인이 필요합니다.
        </div>)
    }

    return (
        <Box 
            display={"flex"}
            width={"100%"}>
            <StudioSideBar pageState={[page, setPage]}/>
            <Box width={"100%"} paddingLeft={"145px"}>
                <Box 
                    display={"flex"}
                    padding={"40px 50px 0"}>
                    {
                        {
                            0: <div></div>,
                            1: <StreamSetting />,
                            2: <StreamBroadcast />
                        }[page]
                    }
                </Box>
            </Box>
        </Box>
    )
}

export default Studio;