import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import OutlinedInput from '@mui/material/OutlinedInput';
import Search from '@mui/icons-material/Search';

import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useCookies } from 'react-cookie';

import logo from '../../logo.svg';

import SignButtons from './SignButtons';
import AccountButton from './AccountButton';

function Toolbar() {
    const [cookies, setCookie, removeCookie] = useCookies();
    const [searchKeyword, setSearchKeyword] = useState("");

    const navigate = useNavigate();

    return (
        <Box display={"flex"} justifyContent={"space-between"} height="45.25px" alignItems={"center"}>
            <Box sx={{cursor: "pointer"}}>
                <img src={logo} width={64} alt="logo" onClick={() => navigate("/")}/>
            </Box>
            <FormControl variant='outlined'>
                <OutlinedInput 
                    size='small' placeholder='검색어를 입력해주세요' sx={{minWidth: "425px"}}
                    endAdornment={
                        <InputAdornment position='end'>
                            <IconButton edge="end">
                                <Search />
                            </IconButton>
                        </InputAdornment>
                    }
                />
            </FormControl>
            <div>
                {cookies.accessToken ? (
                    <AccountButton />
                ) : (
                    <SignButtons />
                )}
            </div>
        </Box>
    )
}

export default Toolbar;