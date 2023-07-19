import styled from "@emotion/styled";
import { Divider, IconButton, MenuItem, Select, Slider, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import FontVariantItem from "../../components/common/FontVariantItem";
import { useFilter } from "../../hooks/useFilter";
import { getFontLink } from "../../services/googleFontService";
import { IFilterStateParam, MyFontFace } from "../../types";

const FontDetailStyled = styled.div`
    padding: 0 60px;
    .preview-text-style__section{
        display:flex;
        width:100%;
        margin: 1rem 0;
        border:1px solid #ccc;
        border-radius: 50px;
        justify-content:space-between;
        padding:0 30px;
        &>div{
            display:flex;
            align-items:center;
            flex-grow:1;
        }
        input{
            border:none;
            font-size: 20px;
            outline:none;
            flex-grow:1;
        }
    }
`


function FontDetail() {
    const { id } = useParams();
    const [loading, setLoading] = useState<boolean>(true)
    const [data, setData] = useState<MyFontFace[]>([])
    const navigate = useNavigate();
    const { filterState, addUpdateFilter, removeAllFilter, addUpdateMultiFilter } = useFilter()
    const [previewText, setPreviewText] = useState<string>(filterState["preview.text"]);

    useEffect(() => {
        if (!id) navigate("/404")
        getFontLink(id!)
            .then((font) => {
                const fontFaces: MyFontFace[] = [];
                for (const [variant, source] of Object.entries(font.items[0].files)) {
                    const fontFaceDescriptors: FontFaceDescriptors = {
                        style: variant === "regular" ? "normal" : variant.includes("italic") ? "italic" : undefined,
                        weight: variant !== "regular" && variant !== "italic" ? variant.replace("italic", "") : undefined,
                    }

                    const fontFace = new FontFace(`${id}`, `url(${source.replace("http", "https")})`, fontFaceDescriptors)
                    fontFace.load().then((loadedFont) => {
                        document.fonts.add(loadedFont)
                    })
                        .catch((err) => console.log(err))
                    fontFaces.push({ variantName: variant, data: fontFace });
                }
                setData(fontFaces)
                setLoading(false)
            }
            )
            .catch(err => console.log(err))
    }, [])
    return (

        <FontDetailStyled>
            <section className="font-title__section"><Typography variant="h3">{`Font variant for ${id}`}</Typography></section>
            <section className="preview-text-style__section">
                <div>
                    <Select
                        onChange={(e) => {
                            let state: IFilterStateParam = {
                                "preview.text_type": e.target.value,
                            }
                            if (e.target.value === "sentence") {
                                state = { ...state, "preview.text": "The quick brown fox jumps over the lazy dog" }
                                setPreviewText("")
                            }
                            if (e.target.value === "paragraph") {
                                state = { ...state, "preview.text": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisl eget ultricies ultrices, nunc nisl aliquam nunc, vitae ultricies" }
                                setPreviewText("")
                            }
                            addUpdateMultiFilter(state);
                        }}
                        defaultValue={"sentence"}
                        value={filterState["preview.text_type"]}
                        style={{ marginRight: "10px", border: "none" }}
                    >
                        <MenuItem value="custom">Custom</MenuItem>
                        <MenuItem value="sentence">Sentence</MenuItem>
                        <MenuItem value="paragraph">Paragraph</MenuItem>
                    </Select>
                    <input disabled={filterState["preview.text_type"] !== "custom"}
                        value={previewText} type="text" onChange={(e) => {
                            setPreviewText(e.target.value)
                            addUpdateFilter("preview.text", e.target.value)
                        }} placeholder="Preview text" />
                </div>
                <Divider orientation="vertical" flexItem ></Divider>
                <div>
                    <Typography variant="body1" >
                        {`${filterState["preview.size"]}px`}
                    </Typography>
                    <Slider style={{ minWidth: "150px", marginLeft: "10px" }}
                        value={filterState["preview.size"]}
                        onChange={(_e, v) => { addUpdateFilter("preview.size", v as number) }} min={8} max={300}></Slider>
                </div>
                <IconButton
                    onClick={removeAllFilter}
                >
                    <i className="fa-solid fa-rotate"></i>
                </IconButton>
            </section>
            <div>
                {loading ? <div>Loading...</div> :
                    <div>{
                        data.map(
                            (fontFace: MyFontFace, index) => (
                                <FontVariantItem key={index} fontFace={fontFace} fontSize={filterState["preview.size"]} exampleText={filterState["preview.text"]}></FontVariantItem>
                            )
                        )}</div>}
            </div>
        </FontDetailStyled>
    )
}

export default FontDetail