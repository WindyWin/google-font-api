import { useTheme } from "@emotion/react";
import { Checkbox, Divider, FormControl, FormControlLabel, Grid, IconButton, ListItemText, MenuItem, Select, Slider, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import FontItem from "../../components/common/FontItem";
import { useFilter } from "../../hooks/useFilter";
import { usePagination } from "../../hooks/usePagination";
import { selectFontsList, setFontsList } from "../../redux/fontSlice";
import { useAppDispatch, useAppSelector } from "../../redux/store";
import { getAllFonts } from "../../services/googleFontService";
import { FamilyMetadataList } from "../../types";
import { HomeStyled } from "./Home.styled";



const categoryCollection = [
    "Serif",
    "Sans Serif",
    "Display",
    "Handwriting",
    "Monospace",

]
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
    const { filterState, addUpdateFilter, removeAllFilter } = useFilter();
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
            dispatch(setFontsList(res))
            setLoading(false);
            setDisplayFonts((_) => {
                const newDisplayList = applyFilter();
                updateNewListPagination(newDisplayList.length);
                return newDisplayList.slice((pageNumber - 1) * defaultPageSize, pageNumber * defaultPageSize);
            })
        })
        document.querySelector("body")?.addEventListener("wheel", handleScrollToBottom)
        return () => {
            document.querySelector("body")?.removeEventListener("wheel", handleScrollToBottom);
        }
    }, []);

    const handleScrollToBottom = (e: WheelEvent) => {
        const { scrollTop, clientHeight, scrollHeight } = e.currentTarget as HTMLBodyElement;
        if (scrollTop + clientHeight >= scrollHeight) {
            console.log("bottom");
            goToNextPage();
            if (pageNumber * defaultPageSize <= maximumItems)
                setDisplayFonts((_) => {
                    return [..._, ...applyFilter().slice((pageNumber - 1) * defaultPageSize, pageNumber * defaultPageSize)];
                })
        }


    }
    useEffect(() => {
        setDisplayFonts((_) => {
            const newDisplayList = applyFilter();
            updateNewListPagination(newDisplayList.length);
            return newDisplayList.slice((pageNumber - 1) * defaultPageSize, pageNumber * defaultPageSize);
        })
    }, [filterState])

    //apply filter from filter state
    function applyFilter() {
        let filteredFonts = allFonts as FamilyMetadataList[];
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
    }


    return (
        <HomeStyled theme={theme}>
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
                            addUpdateFilter("preview.text_type", e.target.value)
                        }}
                        defaultValue={"sentence"}
                        style={{ marginRight: "10px", border: "none" }}
                    >
                        <MenuItem value="custom">Custom</MenuItem>
                        <MenuItem value="sentence">Sentence</MenuItem>
                        <MenuItem value="paragraph">Paragraph</MenuItem>
                    </Select>
                    <input value={filterState["preview.text"]} type="text" onChange={(e) => {
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
                        {categoryCollection.map(category =>
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
            <section>
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