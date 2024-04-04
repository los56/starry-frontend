import {RouterProvider, createBrowserRouter} from 'react-router-dom';

import Sidebar from './component/Sidebar/Sidebar';
import Toolbar from './component/Toolbar/Toolbar';

import Main from './page/Main';
import Channel from './page/Channel/Channel';
import Studio from './page/Studio/Studio';
import Stream from './page/Stream/Stream';
import MyPage from './page/MyPage/MyPage';
import Register from './page/Auth/Register';
import Login from './page/Auth/Login';
import { Box } from '@mui/material';

const Viewport = ({children}: any) => {
    return (
        <Box                 
            display={"flex"}
            bgcolor={"var(--background-white-gray)"}
            height={"calc(100vh - 45.25px)"}
            overflow={"hidden"}>
                {children}
        </Box>
    )
}

const router = createBrowserRouter([
    {
        path: "/",
        element: <><Toolbar /><Viewport><Sidebar/><Main /></Viewport></>
    }, {
        path: "/channel/:channelId/*",
        element: <><Toolbar /><Viewport><Sidebar/><Channel /></Viewport></>
    }, {
        path: "/stream/*",
        element: <><Toolbar /><Viewport><Sidebar/><Stream /></Viewport></>
    } ,{
        path: "/studio",
        element: <><Toolbar /><Studio /></>
    }, {
        path: "/mypage",
        element: <MyPage />
    }, {
        path: "/login",
        element: <Login />
    }, {
        path: "/register",
        element: <Register />
    }
])

function App() {
    return (
        <Box minHeight={"100vh"}>
            <RouterProvider router={router} />
        </Box>
    );
}

export default App;
