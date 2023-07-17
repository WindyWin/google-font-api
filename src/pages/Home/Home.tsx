import { useTheme } from "@emotion/react";
import { Checkbox, Divider, FormControl, FormControlLabel, Grid, IconButton, ListItemText, MenuItem, Select, Slider, Typography } from "@mui/material";
import { WheelEventHandler, useCallback, useEffect, useMemo, useState } from "react";
import FontItem from "../../components/common/FontItem";
import { useFilter } from "../../hooks/useFilter";
import { usePagination } from "../../hooks/usePagination";
import { selectFontsList, setFontsList } from "../../redux/fontSlice";
import { useAppDispatch, useAppSelector } from "../../redux/store";
import { getAllFonts } from "../../services/googleFontService";
import { FamilyMetadataList, IFilterStateParam } from "../../types";
import { HomeStyled } from "./Home.styled";



const categoryCollection = [
    "Serif",
    "Sans Serif",
    "Display",
    "Handwriting",
    "Monospace"]
const sortOptions = {
    newest: {
        display: "Newest",
        value: "newest"
    },
    popularity: {
        display: "Popularity",
        value: "popularity"
    },
    trending: {
        display: "Trending",
        value: "trending"
    },
    name: {
        display: "Name",
        value: "name"
    },
}

function Home() {
    const { filterState, addUpdateFilter, removeAllFilter, addUpdateMultiFilter } = useFilter();
    const [previewText, setPreviewText] = useState<string>(filterState["preview.text"]);
    const [loading, setLoading] = useState<boolean>(true);
    const numberOfStyleSelected: boolean = filterState.stylecount !== 0;
    const theme = useTheme();
    const allFonts = useAppSelector(selectFontsList);
    const dispatch = useAppDispatch();
    const [displayFonts, setDisplayFonts] = useState<FamilyMetadataList[]>([]);
    const defaultPageSize = 8;
    const { pageNumber, goToNextPage, maximumItems, updateNewListPagination } = usePagination(defaultPageSize, displayFonts.length);


    useEffect(() => {


        void getAllFonts().then((res) => {
            return dispatch(setFontsList(res))
        }).then(() => {
            setDisplayFonts(() => {
                const newDisplayList: FamilyMetadataList[] = applyFilter();
                updateNewListPagination(newDisplayList.length);
                setLoading(false);
                return newDisplayList.slice((pageNumber - 1) * defaultPageSize, pageNumber * defaultPageSize);
            })
        })
            //case request error 
            .catch(() => {
                //use local data font
                setDisplayFonts(() => {
                    const newDisplayList: FamilyMetadataList[] = applyFilter();
                    updateNewListPagination(newDisplayList.length);
                    setLoading(false);
                    return newDisplayList.slice((pageNumber - 1) * defaultPageSize, pageNumber * defaultPageSize);
                })
            })

    }, []);
    //apply filter from filter state
    const applyFilter = useCallback(
        () => {
            let filteredFonts = allFonts;
            //filter by category
            if (filterState.category.length > 0) {
                filteredFonts = filteredFonts.filter(font => filterState.category.includes(font.category));
            }
            //filter by query
            if (filterState.query !== "") {
                filteredFonts = filteredFonts.filter(font => font.family.toLowerCase().includes(filterState.query.toLowerCase()));
            }
            //filter by style
            if (filterState.stylecount !== 0) {
                filteredFonts = filteredFonts.filter(font => Object.keys(font.fonts).length >= filterState.stylecount);
            }
            //filter by sort
            switch (filterState.sort) {
                case "popularity":
                    filteredFonts = filteredFonts.sort((a, b) => b.popularity - a.popularity);
                    break;
                case "trending":
                    filteredFonts = filteredFonts.sort((a, b) => b.trending - a.trending);
                    break;
                case "name":
                    filteredFonts = filteredFonts.sort((a, b) => a.family.localeCompare(b.family));
                    break;
                case "newest":
                    filteredFonts = filteredFonts.sort((a, b) => a.lastModified.localeCompare(b.lastModified));
                    break;
                default:
                    break;
            }
            return filteredFonts;
        }, [allFonts, filterState])


    const handleScrollToBottom: EventHandler<HTMLElement> = useCallback(
        (event: Event) => {
            const { scrollTop, clientHeight, scrollHeight } = event.currentTarget as HTMLElement;
            if (scrollTop + clientHeight >= scrollHeight - 5) {
                if (goToNextPage())
                    setDisplayFonts((_) => {
                        return [..._, ...(applyFilter()).slice((pageNumber - 1) * defaultPageSize, pageNumber * defaultPageSize)];
                    })
            }
        }, [pageNumber, goToNextPage, applyFilter]
    )

    useEffect(() => {
        setDisplayFonts(() => {
            const newDisplayList: FamilyMetadataList[] = applyFilter();
            updateNewListPagination(newDisplayList.length);
            return newDisplayList.slice((pageNumber - 1) * defaultPageSize, pageNumber * defaultPageSize);
        })
    }, [filterState])



    return (
        <HomeStyled theme={theme}>
            <section className="action-bar-container">
                <div className="action-bar">
                    <div>
                        <i className="fa-solid fa-magnifying-glass"></i>
                        <input
                            value={filterState.query}
                            placeholder="Search for font..."
                            onChange={(e) => {
                                addUpdateFilter("query", e.target.value)
                            }}
                        />
                    </div>
                    <Divider orientation="vertical" flexItem ></Divider>
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
                </div>
            </section>
            <section className="filter-section">
                <FormControl>

                    <Select
                        className="category-filter__select"
                        multiple
                        value={filterState.category}
                        renderValue={(selected) => `Selected category: ${selected.length}`}
                        onChange={(e) => {
                            const newValue = (e.target.value as string[]).sort();
                            addUpdateFilter("category", newValue);
                        }}
                    >
                        {categoryCollection.map((category: string) =>
                        (
                            <MenuItem key={category} value={category}>
                                <Checkbox checked={filterState.category.indexOf(category) > -1}></Checkbox>
                                <ListItemText primary={category} />
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <FormControl>
                    <Select
                        value={[numberOfStyleSelected]}
                        multiple
                        renderValue={() => `Number of styles ${filterState.stylecount !== 0 ? filterState.stylecount.toString() + "+" : "All"}`}
                    >
                        <MenuItem >
                            <Checkbox
                                style={{ marginRight: "10px" }}
                                onClick={() => {
                                    addUpdateFilter("stylecount", numberOfStyleSelected ? 0 : 1)
                                }} checked={numberOfStyleSelected}></Checkbox>
                            <Slider
                                value={filterState.stylecount}
                                min={1}
                                max={18}
                                onChange={(_e, v) =>
                                    addUpdateFilter("stylecount", v as number)
                                }
                                disabled={!numberOfStyleSelected}></Slider>
                        </MenuItem>
                    </Select>
                </FormControl>
                <FormControlLabel control={<Checkbox value={filterState.vfonly} onChange={() => addUpdateFilter("vfonly", !filterState.vfonly)} />} label="Show only variable fonts" />
                <FormControlLabel control={<Checkbox value={filterState.coloronly} onChange={() => addUpdateFilter("coloronly", !filterState.coloronly)} />} label="Show only color fonts" />
            </section>
            <section className="sort-section">
                <Typography variant="h5" style={{ marginBottom: "10px" }}>
                    {`Showing ${displayFonts.length} fonts of ${maximumItems}`}
                </Typography>
                <Select
                    defaultValue={filterState.sort}
                    onChange={(e) => {
                        addUpdateFilter("sort", e.target.value)
                    }}
                    renderValue={() => `Sort by ${sortOptions[filterState.sort].display}`}
                >
                    <MenuItem value="trending">Trending</MenuItem>
                    <MenuItem value="newest">Newest</MenuItem>
                    <MenuItem value="popularity">Popularity</MenuItem>
                    <MenuItem value="name">Name</MenuItem>
                </Select>
            </section>
            <section onWheel={handleScrollToBottom} className="font-collection-section">
                <Grid container spacing={2}>

                    {loading ? <div>Loading...</div> : (

                        displayFonts.map((font, index) => (
                            <Grid key={index} item xs={3}>
                                <FontItem data={font} fontSize={filterState["preview.size"]} exampleText={filterState["preview.text"]} />
                            </Grid>))

                    )}
                </Grid>
            </section>
        </HomeStyled >
    )
}

export default Home;