import styled from "@emotion/styled";
import { Outlet } from "react-router-dom";
import Header from "./Header/Header";

const MainStyle = styled.main`
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