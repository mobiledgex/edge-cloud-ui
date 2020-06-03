import React from "react";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";

/*
************** example of columns  ******************
// Don't care delete me
const columns = [
    { id: "name", label: "Name", minWidth: 170 },
    { id: "code", label: "ISO\u00a0Code", minWidth: 100 },
    {
        id: "population",
        label: "Population",
        minWidth: 170,
        align: "right",
        format: (value: number) => value.toLocaleString()
    },
    {
        id: "size",
        label: "Size\u00a0(km\u00b2)",
        minWidth: 170,
        align: "right",
        format: (value: number) => value.toLocaleString()
    },
    {
        id: "density",
        label: "Density",
        minWidth: 170,
        align: "right",
        format: (value: number) => value.toFixed(2)
    }
];
********************************************************** */

let parentSize = {};
const useStyles = makeStyles({
    root: {
        width: "100%",
        height: "100%"
    },
    container: {
        height: "calc(100% - 45px)",
        maxHeight: "calc(100% - 45px)"
    }
});

const StyledTableRow = withStyles(theme => ({
    root: {
        "&:nth-of-type(odd)": {
            backgroundColor: "#1E2123",
        },
    },
}))(TableRow);

const StyleTablePagination = withStyles(theme => ({
    toolbar: {
        minHeight: 20
    }
}))(TablePagination);

const StyledTableCell = withStyles(theme => ({
    root: {
        maxWidth: 250,
        overflow: "hidden",
        textOverflow: "ellipsis",
        borderBottom: "none",
        height: 40
    },
}))(TableCell);


let classes = null;
export default function MonitoringListViewer(props) {
    parentSize = props.sizeInfo;
    classes = useStyles();

    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [sizeH, setSizeH] = React.useState(190);
    const [data, setData] = React.useState(props.data);
    const [columns, setColumns] = React.useState([]);
    const [rows, setRows] = React.useState([]);

    React.useEffect(() => {
        parentSize = props.sizeInfo;
        if (classes && parentSize) {
            setSizeH(parentSize.height - 50);
        }
        if (props.data && props.data.length > 0) {
            setColumns(makeColumn(props.data[0]));
            setRows(props.data);
        }
    }, [props]);

    const makeColumn = list => {
        const keys = Object.keys(list);

        // ////
        return keys.map(key => ({
            id: key,
            label: key,
            minWidth: 50,
            align: "left"
        }));
    };

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    return (
        <div className={classes.root}>
            <TableContainer
                className={classes.container}
            >
                <Table stickyHeader aria-labelledby="tableTitle" aria-label="sticky table" size="small">
                    <TableHead>
                        <TableRow>
                            {columns.map(column => (
                                <TableCell
                                    key={column.id}
                                    align={column.align}
                                    style={{ minWidth: column.minWidth, fontWeight: 600, backgroundColor: "#2A2C33" }}
                                >
                                    {column.label.charAt(0).toUpperCase() + column.label.slice(1)}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows
                            .slice(
                                page * rowsPerPage,
                                page * rowsPerPage + rowsPerPage
                            )
                            .map(row => (
                                <StyledTableRow
                                    hover
                                    role="checkbox"
                                    tabIndex={-1}
                                    key={row.code}
                                >
                                    {columns.map(column => {
                                        const value = row[column.id];
                                        return (
                                            <StyledTableCell
                                                key={column.id}
                                                align={column.align}
                                            >
                                                {column.format
                                                    && typeof value === "number"
                                                    ? column.format(value)
                                                    : value}
                                            </StyledTableCell>
                                        );
                                    })}
                                </StyledTableRow>
                            ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <StyleTablePagination
                rowsPerPageOptions={[10, 25, 100]}
                component="div"
                count={rows.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onChangePage={handleChangePage}
                onChangeRowsPerPage={handleChangeRowsPerPage}
            />
        </div>
    );
}
