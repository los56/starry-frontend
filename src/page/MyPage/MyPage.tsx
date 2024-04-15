import { Box } from "@mui/material";

function MyPage() {
    return (
        <Box height={"calc(100vh - 45.25px)"} display={"flex"} alignItems={"center"}>
            <Box
                display={"flex"}
                mx={"auto"} flexWrap={"wrap"}
                gap={4}>
                <Box>
                    <div>기본 정보</div>
                    <div>테스트</div>
                </Box>
                <Box>
                    asdf
                </Box>
            </Box>
        </Box>
    )
}

export default MyPage;