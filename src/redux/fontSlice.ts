import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FamilyMetadataList } from "../types";
import jsonInitData from './../assets/data/fontData.json' assert { type: 'json' };
import { AllFontsResponse } from './../types/index';
import { RootState } from "./store";


interface FontSliceState {
    data: FamilyMetadataList[]
}

const initialState: FontSliceState = {
    data: Object.assign(jsonInitData.familyMetadataList)
}

export const fontSlice = createSlice({
    name: 'fontsList',
    initialState,
    reducers: {
        setFontsList: (state, action: PayloadAction<FamilyMetadataList[]>) => {
            state.data = action.payload
        }
    }
})

export const { setFontsList } = fontSlice.actions

export const selectFontsList = (state: RootState) => state.allFonts.data

export default fontSlice.reducer
