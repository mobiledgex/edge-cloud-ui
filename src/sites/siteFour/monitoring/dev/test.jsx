<Legend
    style={{height: this.state.isLegendExpanded && this.state.currentClassification === CLASSIFICATION.CLUSTER ? chunkArrayClusterUsageList.length * legendHeight : legendHeight}}>

    {!this.state.loading && this.state.currentClassification === CLASSIFICATION.CLUSTER ?

        <div style={{flex: .97, marginTop: -3,}}>
            {chunkArrayClusterUsageList.map((itemList, outerIndex) => {
                return (
                    //desc: ################################
                    //desc: oneROW
                    //desc: ################################
                    <div style={{display: 'flex', marginTop: 0, marginLeft: 5, backgroundColor: 'transparent', height: 22,}}>
                        {itemList.map((item, index) => {
                            return (

                                //desc: ################################
                                //desc: cluster cell one
                                //desc: ################################
                                <Center2 style={{width: chunkedSize === 12 ? 135 : 390, backgroundColor: 'transparent'}}>
                                    {/*desc: ##############*/}
                                    {/*desc: circle area   */}
                                    {/*desc: ##############*/}
                                    <div
                                        style={{
                                            backgroundColor: this.state.chartColorList[index + (outerIndex * chunkedSize)],
                                            width: 15,
                                            height: 15,
                                            borderRadius: 50,
                                            marginTop: 3,
                                        }}
                                        title={item.cluster + " [" + item.cloudlet + "]"}
                                    >

                                    </div>

                                    {!this.state.isLegendExpanded ?
                                        <ClusterCluoudletLable
                                            style={{
                                                marginLeft: 4,
                                                marginRight: 10,
                                                marginBottom: 0,
                                                cursor: 'pointer',
                                                marginTop: 2,
                                            }}
                                            title={item.cluster + " [" + item.cloudlet + "]"}
                                        >
                                            {this.reduceLegendClusterName(item)}
                                        </ClusterCluoudletLable>
                                        :
                                        <ClusterCluoudletLable
                                            style={{
                                                marginLeft: 4,
                                                marginRight: 10,
                                                marginBottom: 0,
                                                cursor: 'pointer',
                                                marginTop: 2,


                                            }}
                                            title={item.cluster + " [" + item.cloudlet + "]"}
                                        >
                                            {this.reduceLegendClusterName(item)}
                                        </ClusterCluoudletLable>
                                    }
                                </Center2>

                            )
                        })}
                    </div>
                )
            })}
        </div> :
        !this.state.loading && this.state.currentClassification === CLASSIFICATION.APPINST &&
        <div style={{
            display: 'flex',
            flex: .975,
            justifyContent: 'center',
            marginLeft: 0,
            backgroundColor: 'transparent',
            marginTop: 3,
            width: '98.2%',
        }}>
            <div style={{backgroundColor: 'transparent'}}>
                <div style={{
                    backgroundColor: this.state.chartColorList[0],
                    width: 15,
                    height: 15,
                    borderRadius: 50,
                    marginTop: -2,
                }}>
                </div>
            </div>
            <ClusterCluoudletLable
                style={{marginLeft: 5, marginRight: 15, marginBottom: 2}}>
                {this.state.currentAppInst.split("|")[0]}
            </ClusterCluoudletLable>
        </div>

    }

    {/*desc: ################################*/}
    {/*desc: unfold_more_less_icon           */}
    {/*desc: ################################*/}
    {!this.state.loading && this.state.currentClassification === CLASSIFICATION.CLUSTER &&
    <div
        style={{
            display: 'flex',
            flex: .025,
            justifyContent: 'flex-end',
            alignItems: 'center',
            marginLeft: 0,
            marginRight: -15,
            cursor: 'pointer',
            //backgroundColor: 'blue',
        }}
        onClick={() => {
            if (this.state.chunkedSize === 12) {
                this.setState({
                    isLegendExpanded: true,
                    chunkedSize: 4,
                })
            } else {
                this.setState({
                    isLegendExpanded: false,
                    chunkedSize: 12,
                })
            }
        }}
    >
        {this.state.isLegendExpanded ?
            <div style={{display: 'flex', alignSelf: 'flex-start'}}>
                <UnfoldLess style={{fontSize: 18,}}/>
            </div>
            :
            <UnfoldMore style={{fontSize: 18, color: chunkArrayClusterUsageList.length > 1 ? 'rgb(118, 255, 3)' : 'white'}}/>
        }
    </div>
    }

</Legend>
