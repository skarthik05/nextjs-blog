import React, { useEffect } from "react";
import TreeView from "@material-ui/lab/TreeView";
import MuiTreeItem from "@material-ui/lab/TreeItem";
import { withStyles } from "@material-ui/styles";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import Link from "next/link";
import { myContext } from "../lib/provider";
import { useRouter } from "next/router";

const MyTreeView = (props) => {
  const {
    data,
    expanded = [],
    selected,
    handleToggle,
    handleSelect,
    setExpanded,
    setSelected
  } = props;
  const { asPath = [] } = useRouter();
  const [defaultExpand, setDefaultExpand] = React.useState([]);
  useEffect(() => {
    if (asPath?.length && !expanded?.length) {
      let paths = asPath.split("/").slice(1);
      paths = paths.reduce((acc, path) => {
        if (acc[0]) acc.unshift(`${acc[0]}/${path}`);
        else acc.push(`/${path}`);
        return acc;
      }, []);
      setExpanded([...paths]);
      setSelected(asPath)
    } ;
  }, []);
  const renderTree = (nodes) => {
    if (!nodes || nodes.length === 0) {
      return null;
    }
    return nodes.map((node, index) => {
      let children = null;
      if (node.children && node.children.length) {
        children = renderTree(node.children);
      }
      return (
        <Link key={index} href={node.path}>
          <TreeItem
            key={index}
            nodeId={node.path}
            label={node.name}
            link={node.path ? node.path : null}
            children={children}
          ></TreeItem>
        </Link>
      );
    });
  };

  //  setVisitedNodes = (id, context) => {
  //   console.log(context,'c-tx')
  //   let visitedNodes = context.visitedNodes || []
  //   if (visitedNodes.includes(id)) {
  //     visitedNodes = visitedNodes.filter(nodeId => nodeId !== id)
  //   } else {
  //     visitedNodes.push(id)
  //   }
  //   context.setVisitedNodes(visitedNodes)
  // }
  return (
    <TreeView
      defaultCollapseIcon={<ExpandMoreIcon />}
      defaultExpandIcon={<ChevronRightIcon />}
      expanded={expanded}
      // defaultExpanded={defaultExpand}
      selected={selected}
      onNodeToggle={handleToggle}
      onNodeSelect={handleSelect}
    >
      {renderTree(data)}
    </TreeView>
  );
};

export default MyTreeView;

const TreeItem = withStyles({
  root: {
    "&.MuiTreeItem-root.Mui-selected > .MuiTreeItem-content .MuiTreeItem-label":
      {
        backgroundColor: "#F5F5F5",
      },
  },
})(MuiTreeItem);
