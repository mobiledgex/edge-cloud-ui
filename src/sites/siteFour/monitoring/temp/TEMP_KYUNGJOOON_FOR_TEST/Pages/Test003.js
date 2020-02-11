import React from "react";
import ReactDOM from "react-dom";
import { animated } from "react-spring";
import { PagerProvider, Pager, useOnFocus } from "@crowdlinker/react-pager";
import "./styles.css";

const { useState } = React;

const children = Array.from({ length: 1000 }).map((c, index) => (
    <div
        style={{
            flex: 1,
            display: "flex",
            padding: 10,
            borderRadius: 10,
            justifyContent: "center",
            alignItems: "center"
        }}
    >
        asdasdasdasdasdasdasdas123123123123123
    </div>
));

export default function Test003() {
    const [activeIndex, setActiveIndex] = useState(1);

    function onChange(index: number) {
        setActiveIndex(index);
    }

    return (
        <div style={{ maxWidth: "100%" }}>
            <div
                style={{
                    width: "100%",
                    display: "flex",
                    margin: "0 auto",
                    justifyContent: "center",
                    overflow: "hidden",
                    padding: 20
                }}
            >
                <div
                    style={{
                        height: 200,
                        width: 200,
                        alignSelf: "center",
                        padding: 10
                    }}
                >
                    <PagerProvider activeIndex={activeIndex} onChange={onChange}>
                        <Pager pageInterpolation={kilterCardConfig} clamp={{ next: 0 }}>
                            {children}
                        </Pager>
                    </PagerProvider>
                </div>
            </div>

            <h2 style={{ textAlign: "center" }}>Active Index: {activeIndex}</h2>
            <div style={{ display: "flex", justifyContent: "center" }}>
                <div
                    style={{
                        width: 300,
                        justifyContent: "space-between",
                        display: "flex"
                    }}
                >
                    <button
                        style={{
                            height: 50,
                            width: 100,
                            border: "thin solid black",
                            borderRadius: 10,
                            background: "transparent"
                        }}
                        onClick={() => onChange(activeIndex - 1)}
                    >
                        {"<"}
                    </button>
                    <button
                        style={{
                            height: 50,
                            width: 100,
                            border: "thin solid black",
                            borderRadius: 10,
                            background: "transparent"
                        }}
                        onClick={() => onChange(activeIndex + 1)}
                    >
                        {">"}
                    </button>
                </div>
            </div>
        </div>
    );
}

const colors = [
    "aquamarine",
    "coral",
    "gold",
    "cadetblue",
    "crimson",
    "darkorange",
    "darkmagenta",
    "salmon"
];

function Slide({ children, index }) {
    useOnFocus(() => {
        console.log("focused: ", index);
    });

    return (
        <animated.div
            style={{
                background: colors[index % colors.length],
                flex: 1,
                display: "flex",
                padding: 10,
                borderRadius: 10,
                justifyContent: "center",
                alignItems: "center"
            }}
        >
            {children}
        </animated.div>
    );
}
const kilterCardConfig = {
    transform: [
        {
            scale: {
                range: [-1, 0, 1],
                output: [0.95, 1, 0.95]
            }
        },

        {
            translateY: {
                unit: "px",
                range: [-1, 0, 1, 2],
                output: [0, 0, 10, -15]
            }
        },
    ],

    opacity: {
        range: [-2, -1, 0, 1, 2, 3, 4],
        output: [0, 0, 1, 1, 1, 0, 0]
    }
};


