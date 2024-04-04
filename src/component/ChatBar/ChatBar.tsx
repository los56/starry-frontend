import { Box, Button, InputAdornment, OutlinedInput, TextField } from '@mui/material';

function ChatBar() {
    return (
        <Box 
            maxWidth={"360px"} width={"100%"} 
            bgcolor={"var(--background-gray)"}>
            <Box display={"flex"} flexDirection={"column"} height={"100%"} px={2}>
                <Box mt={1}>Chat Header</Box>
                <Box width={"100%"} height={"100%"} my={1}>Chat Body</Box>
                <Box mb={1}>
                    <TextField size='small' fullWidth/>
                    <Button sx={{float: 'right'}}>채팅</Button>
                </Box>
            </Box>
        </Box>
    );
}

export default ChatBar;