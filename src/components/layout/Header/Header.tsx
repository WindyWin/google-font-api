import styled from "@emotion/styled";
import { useTheme } from "@mui/material";
const HeaderStyle = styled.header`
    height: 64px;
    
`;



function Header() {
    const theme = useTheme();
    return (
        <HeaderStyle theme={theme}>
            <h1>Google font Api</h1>

        </HeaderStyle>
    )
}

export default Header