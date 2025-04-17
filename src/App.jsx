import './App.css'
import Auth from "./components/Auth.jsx";
import {BrowserRouter, Routes, Route} from "react-router-dom";
import {useSelector} from "react-redux";
import {selectCurrentUser} from "./store/currentUserSlice.js";
import {Home} from "./Home.jsx";

function App() {
    const user = useSelector(selectCurrentUser);


    return (
        <>
            {user.currentUser ?
                <BrowserRouter>
                    <Routes>
                        <Route index element={<Home/>}/>
                    </Routes>
                </BrowserRouter>
                :
                <Auth/>
            }
        </>
    )
}

export default App
