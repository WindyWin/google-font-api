import styled from '@emotion/styled'
import { Typography } from '@mui/material'
import { MyFontFace } from '../../types'
interface IFontVariantItemProps {
    fontFace: MyFontFace
    fontSize: number
    exampleText: string
}

const ArticleStyle = styled.article`
    width:100%;
    padding: 1rem;
    box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.132);
    
`

function FontVariantItem({ fontFace, fontSize, exampleText }: IFontVariantItemProps) {
    const { data, variantName } = fontFace
    return (
        <ArticleStyle>
            <Typography>
                {variantName}
            </Typography>
            <Typography style={{ fontFamily: data.family, fontSize, fontWeight: data.weight, fontStyle: data.style }}>
                {exampleText}
            </Typography>
        </ArticleStyle>
    )
}

export default FontVariantItem