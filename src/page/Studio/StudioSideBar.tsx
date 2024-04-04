import { StudioPages } from './Studio';
import { Box, Button, Divider } from '@mui/material';
import { CSSProperties } from 'react';

function StudioSideBar({pageState}: {pageState: [StudioPages, React.Dispatch<React.SetStateAction<StudioPages>>]}) {
    const [page, setPage] = pageState;

    const buttonSx = {
        width: "100%",
        color: "black",
        fontSize: "0.9rem",
        fontWeight: "bold"
    }

    const navSx: CSSProperties = {
        display: "flex",
        flexDirection: "column",
        width: "145px",
        height: "100vh",
        padding: "8px",
        position: "fixed",
        background: "var(--background-gray)"
    }

    return (
        <nav style={navSx}>
            <Button sx={buttonSx} onClick={() => setPage(StudioPages.Dashboard)}>
                대시보드
            </Button>
            <Button sx={buttonSx} onClick={() => setPage(StudioPages.Dashboard)}>
                채널 설정
            </Button>
            <Divider />
            <Box fontSize={"0.85rem"} color={"gray"} textAlign={"center"}>스트림</Box>
            <Button sx={buttonSx} onClick={() => setPage(StudioPages.StreamSetting)}>
                방송 설정
            </Button>
            <Button sx={buttonSx} onClick={() => setPage(StudioPages.StreamBroadcast)}>
                송출
            </Button>
            <hr></hr>
        </nav>
    )
}

export default StudioSideBar;