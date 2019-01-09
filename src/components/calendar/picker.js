import React from 'react';
import { Calendar, DateRange, DateRangePicker, DefinedRange } from 'react-date-range';
import { format, addDays } from 'date-fns';

import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file

const nameMapper = {
    da: 'Danish',
    de: 'German',
    el: 'Greek',
    enUS: 'English (United States)',
    eo: 'Esperanto',
    es: 'Spanish',
    frCH: 'French',
    fr: 'French',
    id: 'Indonesian',
    it: 'Italian',
    ja: 'Japanese',
    ko: 'Korean',
    nl: 'Dutch',
    ro: 'Romanian',
    ru: 'Russian',
    sv: 'Swedish',
    tr: 'Turkish',
    ua: 'Ukrainian',

};


function formatDateDisplay(date, defaultText) {
    if (!date) return defaultText;
    return format(date, 'MM/DD/YYYY');
}
export default class Picker extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.state = {
            showCl:false,
            dateRange: {
                selection: {
                    startDate: new Date(),
                    endDate: null,
                    key: 'selection',
                },
            },
            dateRangeWithDisabled: {
                selection: {
                    startDate: addDays(new Date(), 4),
                    endDate: null,
                    key: 'selection',
                },
            },
            definedRange: {
                selection: {
                    startDate: new Date(),
                    endDate: new Date(),
                    key: 'selection',
                },
            },
            dateRangePickerI: {
                selection: {
                    startDate: new Date(),
                    endDate: null,
                    key: 'selection',
                },
                compare: {
                    startDate: new Date(),
                    endDate: addDays(new Date(), 3),
                    key: 'compare',
                },
            },
            multipleRanges: {
                selection1: {
                    startDate: addDays(new Date(), 1),
                    endDate: null,
                    key: 'selection1',
                },
                selection2: {
                    startDate: addDays(new Date(), 4),
                    endDate: addDays(new Date(), 8),
                    key: 'selection2',
                },
                selection3: {
                    startDate: addDays(new Date(), 8),
                    endDate: addDays(new Date(), 10),
                    key: 'selection3',
                    showDateDisplay: false,
                    autoFocus: false,
                },
            },
            datePickerInternational: null,
            locale: 'es',
            dateRangePicker: {
                selection: {
                    startDate: new Date(),
                    endDate: addDays(new Date(), 7),
                    key: 'selection',
                },
            },
        };
    }

    handleChange(which, payload) {
        console.log(which, payload);
        this.setState({
            [which]: payload,
        });
    }
    handleRangeChange(which, payload) {
        console.log(which, payload);
        this.setState({
            [which]: {
                ...this.state[which],
                ...payload,
            },
        });
    }
    showCalendar() {
        this.setState({showCl : !this.state.showCl})
    }
    render() {
        const selectionRange = {
            startDate: new Date(),
            endDate: new Date(),
            key: 'selection',
        }
        return(
            <div>
                <div>
                    <input
                        type="text"
                        readOnly
                        value={formatDateDisplay(this.state.dateRangePicker.selection.startDate)}
                        onClick={()=>this.showCalendar()}
                    />
                    <input
                        type="text"
                        readOnly
                        value={formatDateDisplay(this.state.dateRangePicker.selection.endDate)}
                    />
                </div>
                <div>
                    {(this.state.showCl)?
                        <DateRangePicker
                            onChange={this.handleRangeChange.bind(this, 'dateRangePicker')}
                            showSelectionPreview={true}
                            moveRangeOnFirstSelection={false}
                            className={'PreviewArea'}
                            months={2}
                            ranges={[this.state.dateRangePicker.selection]}
                            direction="horizontal"
                        />:null
                    }

                </div>
            </div>
        )
    }
}
