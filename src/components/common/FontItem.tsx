import styled from '@emotion/styled'
import { Card, CardContent, CardHeader, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import { getFontLink } from '../../services/googleFontService'
import { FamilyMetadataList } from '../../types'

interface IFontItemProps {
    data: FamilyMetadataList
    fontSize: number
    exampleText: string
}

const CardStyle = styled(Card)`
    padding: 1rem;
    width:100%;
    min-height:300px;
`

function FontItem({ data, fontSize, exampleText }: IFontItemProps) {
    const [loading, setLoading] = useState<boolean>(true)
    useEffect(() => {
        getFontLink(data.family)
            .then((font) => {
                const fontFace = new FontFace(data.family, `url(${font.items[0].files.regular})`)
                fontFace.load().then((loadedFont) => {
                    document.fonts.add(loadedFont)
                    setLoading(false)
                }).catch(err => console.log(err))
            })
            .catch(err => console.log(err))
    }, [])
    return (

        loading ? <Typography>Loading...</Typography> :
            <CardStyle>
                <Typography variant="body1">{data.family}</Typography>
                <Typography variant="subtitle2">{data.designers.join(", ")}</Typography>
                <CardContent>
                    <Typography style={{ fontFamily: data.family, fontSize: fontSize }}>{exampleText}</Typography>
                </CardContent>
            </CardStyle>

    )
}

export default FontItem