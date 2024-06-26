import DeleteForever from "@mui/icons-material/DeleteForever";
import Edit from "@mui/icons-material/Edit";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";

import { useEffect, useRef } from "react";

import { PostData } from "./types";

function ChannelPost({data, editable}: {data: PostData, editable?: boolean}) {
    const contentRef = useRef<HTMLParagraphElement>(null);

    useEffect(() => {
        if(contentRef.current) {
            contentRef.current.innerHTML = data.content.replace("\n", "<br/>");
        }
    }, [])

    return (
        <Box border={"1px solid var(--background-gray)"} width={"100%"} borderRadius={"12px"}>
            <Box px={2} py={1}>
                <Box display={"flex"} mb={1} justifyContent={"space-between"}>
                    <Box display={"flex"} alignItems={"center"} gap={1}>
                        <Avatar sx={{width: 36, height: 36}}/>
                        <h4>{data.writerData.nickname}</h4>
                    </Box>
                    {editable ? 
                    <Box display={"flex"} alignItems={"center"}>
                        <IconButton>
                            <Edit sx={{width: 18, height: 18, color: "green"}}/>
                        </IconButton>
                        <IconButton>
                            <DeleteForever sx={{width: 18, height: 18, color: "red"}}/>
                        </IconButton>
                    </Box> 
                    : 
                    <Box />
                    }
                </Box>

                <Box px={1}>
                    <p ref={contentRef}></p>
                </Box>
            </Box>
        </Box>
    )
}

export default ChannelPost;
