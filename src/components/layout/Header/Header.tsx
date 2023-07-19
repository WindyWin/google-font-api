import styled from "@emotion/styled";
import { useTheme } from "@mui/material";
import { Link } from "react-router-dom";
const HeaderStyle = styled.header`
    height: 64px;
    
`;



function Header() {
    const theme = useTheme();
    return (
        <HeaderStyle theme={theme}>
            <Link to="/">
                <h1>Google font Api</h1>
            </Link>

        </HeaderStyle>
    )
}

export default Header