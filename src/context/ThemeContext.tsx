import { createTheme, CssBaseline, ThemeProvider as TP } from "@mui/material";
import { createContext, useMemo, useState } from "react";

// eslint-disable-next-line @typescript-eslint/no-empty-function
export const ThemeContext = createContext({ toggleColorMode: () => { } });


const ThemeProvider = ({ children }: any) => {
    const [mode, setMode] = useState<'light' | 'dark'>('light');
    const colorMode = useMemo(
        () => ({
            toggleColorMode: () => {
                setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
            },
        }),
        [],
    );

    const theme = useMemo(
        () =>
            createTheme({
                palette: {
                    mode,
                },
            }),
        [mode],
    );
    return (
        <ThemeContext.Provider value={colorMode}>
            <TP theme={theme}>
                <CssBaseline />
                {children}
            </TP >
        </ThemeContext.Provider>

    )
}

export default ThemeProvider;