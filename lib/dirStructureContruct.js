import { GetRepoByBranchTreeApi } from "./githubApis";

function splitInfo(trees = []) {
//   let dirInfo = trees.map((file) => file.path.split("/"));
return trees.reduce((files,cur)=>{
    files.push({
        path:cur.path,
        isDir:cur.type=='tree'?true:false,
        title:cur.path.split('\/')[0],
        slug:cur.path.split('\/')[0]

    })
    return files
},[])
}
// function testRecursive(){

// }
export async function getRootDirInfo() {
  console.log("---");
  // const rootDirInfo = await GetRepoByBranchTreeApi({branchName:"main"})
  const treeFiles = await GetRepoByBranchTreeApi({ branchName: "main" });
  return splitInfo(treeFiles);
}
