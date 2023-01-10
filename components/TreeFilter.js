import React, { useEffect } from "react";
import TextField from "@material-ui/core/TextField";
import { uniq } from "lodash";
import MyTreeView from "./MyTreeView";
import { useRouter } from "next/router";
// import { filterTree, expandFilteredNodes, getIDsExpandFilter } from "../util/filterTreeUtil";

const TreeFilter = (props) => {
  const { data, url = [] } = props;
  const router = useRouter();
  const { asPath } = router;
  const [expanded, setExpanded] = React.useState([]);
  const [selected, setSelected] = React.useState([]);
  const [subjectData, setSubjectData] = React.useState(data);
  const [selectedSingleItem, setSelectedSingleItem] = React.useState("");

  React.useEffect(() => {
    setSubjectData(() => data);
    // if(asPath?.length){
    //   let paths = asPath.split('/').slice(1)
    //   paths = paths.reduce((acc,path)=>{
    //     if(acc[0]) acc.unshift(`${acc[0]}/${path}`)
    //    else acc.push(`/${path}`)
    //    return acc
    //   },[])
    //   setExpanded([...paths])

    // }
  }, [data]);
  // const onFilterMouseUp = (e) => {
  //   const value = e.target.value;
  //   const filter = value.trim();
  //   let expandedTemp = expanded;
  //   if (!filter) {
  //     setSubjectData(() => data);
  //     setExpanded(['root']);
  //     return;
  //   }

  //   let filtered = filterTree(data, filter);
  //   filtered = expandFilteredNodes(filtered, filter);
  //   if (filtered && filtered.children) {
  //     // filtered.children.map((item) => {
  //     //   expandedTemp.push(item.id);
  //     // });
  //     expandedTemp = [];
  //     expandedTemp.push(...getIDsExpandFilter(filtered));
  //   }
  //   setExpanded(uniq(expandedTemp));
  //   setSubjectData(filtered);
  // };
  // if (event.target.closest(".MuiTreeItem-iconContainer")) {
  //   setExpanded(nodeIds);
  // }

  const handleToggle = (event, nodeIds) => {
    let expandedTemp = expanded;
    expandedTemp = nodeIds;
    setExpanded(expandedTemp);
  };

  const handleSelect = (event, nodeIds) => {
    setSelected(nodeIds);
    // When false (default) is a string this takes single string.
    // if (!Array.isArray(nodeIds)) {
    //   setSelectedSingleItem(nodeIds);
    // }
    // TODO: When `multiSelect` is true this takes an array of strings
  };
  // <TextField label="Filter ..." onKeyUp={onFilterMouseUp} />
  return (
    <div>
      <MyTreeView
        data={subjectData}
        expanded={expanded}
        selected={selected}
        handleToggle={handleToggle}
        handleSelect={handleSelect}
        setExpanded={setExpanded}
        setSelected={setSelected}
      />
    </div>
  );
};

export default TreeFilter;
