import { useState } from "react";
import * as HttpClient from "../../tools/HttpClient"
import { useCookies } from "react-cookie";
import { Box, Button, ButtonGroup, Dialog, DialogActions, DialogContent, DialogTitle, FormGroup, InputAdornment, OutlinedInput } from "@mui/material";

interface ModalState {
    Warning: boolean;
    Regen: boolean;
}

function StreamBroadcast() {
    const [cookies, _sc, _rc] = useCookies();

    const [showStreamKey, setShowStreamKey] = useState(false);
    const [streamKey, setStreamKey] = useState("0000000000000000000000000000");
    const [modalState, setModalState] = useState<ModalState>({
        Warning: false,
        Regen: false,
    });

    const handleShowStreamKey = (state: boolean) => {
        if(state) {
            HttpClient.authGet('/api/studio/stream-key').then((res: any) => {
                setStreamKey(res.data.streamKey);
                setShowStreamKey(state);
            })
        } else {
            setStreamKey("0000000000000000000000000000");
            setShowStreamKey(state);
        }
        setShowStreamKey(state);
        handleCloseModal("Warning");
    }

    const handleOpenModal = (e: "Warning" | "Regen") => {
        setModalState({
            ...modalState,
            [e]: true
        });
    }

    const handleCloseModal = (e: "Warning" | "Regen") => {
        setModalState({
            ...modalState,
            [e]: false
        });
    }

    const regenStreamKey = () => {
        handleCloseModal("Regen");
        HttpClient.authGet("/api/channel/studio/regen-key").then(res => {
            setStreamKey(res.data.streamKey);
        });
    }

    return (
        <>
            <Box width={"100%"}>
                <FormGroup className="mb-3">
                    <label>방송 주소</label>
                    <OutlinedInput size="small" type="text" value="rtmp://localhost/relay" readOnly/>
                </FormGroup>
                <FormGroup>
                    <label>스트림 키</label>
                    <OutlinedInput size="small" type={showStreamKey ? "text" : "password"} value={streamKey} readOnly 
                        endAdornment = {
                        <InputAdornment position="end" sx={{alignItems: "center"}}> 
                            {showStreamKey ? 
                                <ButtonGroup>
                                    <Button type="button" variant="contained" onClick={() => handleOpenModal("Regen")}>재발급</Button>
                                    <Button type="button" variant="contained" onClick={() => handleShowStreamKey(false)}>숨기기</Button>
                                </ButtonGroup>
                                :
                                <Button type="button" variant="contained" color="error" onClick={() => handleOpenModal("Warning")}>보이기</Button>
                            }
                        </InputAdornment>
                        } />
                </FormGroup>
            </Box>

            <Dialog open={modalState.Warning} onClose={() => handleCloseModal("Warning")}>
                <DialogTitle>경고</DialogTitle>
                <DialogContent>
                        스트림 키가 노출될 경우 다른 사람이 본인의 방송을 시작할 수 있습니다.
                </DialogContent>
                <DialogActions>
                    <Button type="button" variant="contained" onClick={() => handleCloseModal("Warning")}>취소</Button>
                    <Button type="button" variant="contained" color="error" onClick={() => handleShowStreamKey(true)}>보이기</Button>
                </DialogActions>
            </Dialog>

            <Dialog open={modalState.Regen} onClose={() => handleCloseModal("Regen")}>
                <DialogTitle>재발급</DialogTitle>
                <DialogContent>
                    스트림 키를 재발급하시겠습니까?
                </DialogContent>
                <DialogActions>
                    <Button type="button" variant="contained" onClick={() => handleCloseModal("Regen")}>취소</Button>
                    <Button type="button" variant="contained" onClick={() => regenStreamKey()}>확인</Button>
                </DialogActions>
            </Dialog>
        </>
    )
}

export default StreamBroadcast;