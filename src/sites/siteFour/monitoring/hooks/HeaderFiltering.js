import React, { useState } from "react";
import { Toolbar, Grid } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import FilterMenu from "./FilterMenu";
import { groupBy, groupByCompare } from "../../../../utils";

const useStyles = makeStyles(theme => ({
    root: {
        flexGrow: 1,
    },
    paper: {
        padding: theme.spacing(2),
        textAlign: "center",
        color: theme.palette.text.secondary,
    },
}));
const makeItemFormat = items => (
    items.map(item => (
        {
            key: item,
            text: item,
            value: item
        }
    ))
);

const useCompare = (val: any) => {
    const prevVal = usePrevious(val);
    return prevVal !== val;
};
const usePrevious = value => {
    const ref = useRef();
    useEffect(() => {
        ref.current = value;
    });
    return ref.current;
};

const HeaderFiltering = props => {
    const classes = useStyles();
    const [title, setTitle] = useState("M");
    const [itemTreeValues, setItemTreeValues] = useState([[]]);
    const [regions, setRegions] = useState();
    const [selectedRegion, setSelectedRegion] = useState(props.selectedRegion);
    const [depthOne, setDepthOne] = useState();
    const [depthTwo, setDepthTwo] = useState();
    const [depthThree, setDepthThree] = useState();
    const [groupByCloudlet, setGroupByCloudlet] = useState();

    const makeDepthTrees = (items, selected, property) => {
        const groupByItem = groupBy(items, property.byId);
        //
        const groupCategory = groupByItem[selected] ? groupBy(groupByItem[selected], property.depthId) : [];
        const cloudletKeys = Object.keys(groupCategory);
        // const defaultInsert = makeItemFormat([property.default]);
        // return defaultInsert.concat(makeItemFormat(cloudletKeys));
        return makeItemFormat(cloudletKeys);
    };

    const onSelectItem = params => {
        const { depth, id, value } = params;
        console.log("20200602 on selectd == ", params, ": depth= ", depth, "id=", id);
        /** set cloudlts in select items box */
        if (id === "region") {
            setSelectedRegion(params);
            setDepthOne([]);
            setDepthTwo([]);
            setDepthThree([]);
            if (props.compCloudlet && props.compCloudlet.length > 0) {
                console.log("20200602 cloudlet info == ", props.compCloudlet);
                setDepthOne(makeDepthTrees(props.compCloudlet, value, { byId: id, depthId: "cloudletName", default: "Select Cloudlet" }));
            }
            /** set clusters in select items box */
        } else if (id === "cloudlet") {
            // setSelectedCloudlet(params);
            setDepthTwo([]);
            setDepthThree([]);
            if (props.compClusterinst && props.compClusterinst.length > 0) {
                console.log("20200602 compClusterinst info == ", props.compClusterinst);
                setDepthTwo(makeDepthTrees(props.compClusterinst, value, { byId: "cloudletName", depthId: "clusterName", default: "Select Cluster" }));
            }
            /** set appinst in select items box */
        } else if (id === "cluster") {
            setDepthThree([]);
            if (props.compAppinst && props.compAppinst.length > 0) {
                console.log("20200602 appinst info == ", props.compAppinst);
                setDepthThree(makeDepthTrees(props.compAppinst, value, { byId: "clusterName", depthId: "appName", default: "Select Appinstance" }));
            }
        }
    };

    const onHandleApplyFilter = filteredItem => {
        props.onHandleApplyFilter(filteredItem);
    };

    React.useEffect(() => {
        if (props.compCloudlet && props.compCloudlet.length > 0) {
            const groupRegion = groupBy(props.compCloudlet, "region");
            const regionKeys = Object.keys(groupRegion);
            const defaultInsert = makeItemFormat(["All"]);
            setRegions(defaultInsert.concat(makeItemFormat(regionKeys)));
        }
        if (props.title) {
            setTitle(props.title);
        }
    }, [props]);

    return (
        <Toolbar className="monitoring_title">
            <label className="content_title_label">Monitoring</label>
            <FilterMenu regions={regions} depthOne={depthOne} depthTwo={depthTwo} depthThree={depthThree} itemTreeValues={itemTreeValues} onSelectItem={onSelectItem} onHandleApplyFilter={onHandleApplyFilter} />
        </Toolbar>
    );
};
export default HeaderFiltering;
