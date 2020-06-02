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
    const prevVal = usePrevious(val)
    return prevVal !== val
};
const usePrevious = (value) => {
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
        const defaultInsert = makeItemFormat([property.default]);
        return defaultInsert.concat(makeItemFormat(cloudletKeys));
        // return makeItemFormat(cloudletKeys);
    };

    const onSelectItem = (item, depth) => {
        console.log("20200602 on selectd == ", item, ": depth= ", depth);
        /** set cloudlts in select items box */
        if (depth === "region") {
            setSelectedRegion(item);
            if (props.compCloudlet && props.compCloudlet.length > 0) {
                console.log("20200602 cloudlet info == ", props.compCloudlet);
                setDepthOne(makeDepthTrees(props.compCloudlet, item, { byId: depth, depthId: "cloudletName", default: "Select Cloudlet" }));
            }
            /** set clusters in select items box */
        } else if (depth === "cloudlet") {
            // setSelectedCloudlet(item);
            if (props.compAppinst && props.compAppinst.length > 0) {
                console.log("20200602 appinst info == ", props.compAppinst);
                setDepthTwo(makeDepthTrees(props.compAppinst, item, { byId: depth, depthId: "clusterName", default: "Select Cluster" }));
            }
            /** set appinst in select items box */
        } else if (depth === "appinst") {
            // setSelectedCloudlet(item);
            // if (props.compAppinst && props.compAppinst.length > 0) {
            //     console.log("20200602 appinst info == ", props.compAppinst);
            //     setDepthTwo(makeDepthTrees(props.compAppinst, item, { byId: depth, depthId: "clusterName", default: "Select Cloudlet" }));
            // }
        }
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
            <FilterMenu regions={regions} depthOne={depthOne} depthTwo={depthTwo} depthThree={depthThree} itemTreeValues={itemTreeValues} onSelectItem={onSelectItem} />
        </Toolbar>
    );
};
export default HeaderFiltering;
