import styled from "@emotion/styled";
import { Outlet } from "react-router-dom";
import Header from "./Header/Header";

const MainStyle = styled.main`
    padding: 0 60px;
`


function index() {
    return (
        <>
            <Header></Header>
            <MainStyle>
                <Outlet></Outlet>
            </MainStyle>
        </>
    )
}

export default index