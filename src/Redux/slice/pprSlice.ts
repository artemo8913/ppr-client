// мне не нравится применение splice для изменения значения

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import mockRowData from "../../mock/rowData";
import { IRowData } from '../../Interface';

export const pprSlice = createSlice({
    name: 'ppr',
    initialState: {
        value: mockRowData
    },
    reducers: {
        add: (state) => {
        },
        remove: (state) => {
        },
        change: (state, action: PayloadAction<{ id: string, newValue: string | number, category: Array<string> }>) => {
            for (let index = 0; index < state.value.length; index++) {
                const row = state.value[index];
                if (row.id === action.payload.id) {
                    if (action.payload.category.length === 1) {
                        state.value.splice(index, 1,
                            { ...state.value[index], [action.payload.category[0]]: action.payload.newValue }
                        );
                        break;
                    }
                    if (action.payload.category.length === 2) {
                        state.value.splice(index, 1,
                            {
                                ...state.value[index],
                                [action.payload.category[0]]: {
                                    ...[action.payload.category[0]],
                                    [action.payload.category[0][1]]: action.payload.newValue
                                }
                            }
                        );
                        break;
                    }
                }
            }
        }
    }
})

export const { add, remove, change } = pprSlice.actions;

export default pprSlice.reducer;