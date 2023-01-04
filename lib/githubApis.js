import {Octokit} from 'octokit'
const GITHUB_TOKEN ="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"
const GITHUB_BRANCH = 'main'
const GITHUB_REPO = "markdownfiles"
const GITHUB_OWNER = "skarthik05"
export async function getRepoBranchDirFiles(GITHUB_BRANCH,GITHUB_REPO){
  
  const octokit = new Octokit({
    auth: GITHUB_TOKEN
  })
  const RepoBranchDirDetails= await octokit.request(`GET /repos/${GITHUB_OWNER}/${GITHUB_REPO}/branches/${GITHUB_BRANCH}`, {
    owner: GITHUB_OWNER,
    repo: GITHUB_REPO,
    branch: GITHUB_BRANCH
  })
  return  RepoBranchDirDetails
}
export async function GetBranchDetailApi({GITHUB_BRANCH='main'}){
const octokit = new Octokit({
  auth: GITHUB_TOKEN
})

const branchDetails = await octokit.request(`GET /repos/${GITHUB_OWNER}/${GITHUB_REPO}/branches/${GITHUB_BRANCH}`, {
  owner:GITHUB_OWNER,
  repo: GITHUB_REPO,
  branch: GITHUB_BRANCH
})
return branchDetails?.data?.commit?.sha
}

export async function GetRepoFilesAPI({path}){
  const octokit = new Octokit({
    auth: GITHUB_TOKEN
  })
  const {data =null}= await octokit.rest.repos.getContent({
    owner:GITHUB_OWNER,
    repo: GITHUB_REPO,
    path
  })
  return data
}
export async function GetFileContentAPI({path}){
  const octokit = new Octokit({
    auth: GITHUB_TOKEN
  })
  const {data =null}= await octokit.rest.repos.getContent({
    owner:GITHUB_OWNER,
    repo: GITHUB_REPO,
    path
  })
  return{
    path:data.path,
    content:data.content? await base64Decoder(data.content):""
  
}
}
export async function GetRepoFileContent({path}){

  const octokit = new Octokit({
    auth: GITHUB_TOKEN
  })

// const result = await octokit.request(`GET /repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/sample`, {
  // owner:GITHUB_OWNER,
  // repo: GITHUB_REPO,
  // path: "sample"
// }) 

const {data =null}= await octokit.rest.repos.getContent({
  owner:GITHUB_OWNER,
  repo: GITHUB_REPO,
  path
})

if(data)
  return{
    path:data.path,
    content:data.content?base64Decoder(data.content):""
  
}
}
//@TODO: Check any filter can be added while api call
export async function GetRepoByBranchTreeApi({branchName}){
  const octokit = new Octokit({
    auth: GITHUB_TOKEN
  })
 const branchTreeDetails= await octokit.request(`GET /repos/${GITHUB_OWNER}/${GITHUB_REPO}/git/trees/${branchName}`, {
    owner: GITHUB_OWNER,
    repo: GITHUB_REPO,
    })
  return  branchTreeDetails.data.tree

}
async function base64Decoder(str){
  return new Buffer.from(str,'base64').toString()
}


//local
// async function GetFileContents(treeFiles=[]){
//   let contentsList = []
//   // console.log(treeFiles)
//   const contents = await Promise.all(treeFiles.map(async(file)=>{
//     if(file.type=='blob' || file.type=="file"){
//       return contentsList.push(await GetRepoContentApi({path:file.path}))}
//       else{
//         return contentsList.push({path:file.path,content:''})
//       }
//     }
//   ))
//   return contentsList
// }

//GIT
export async function GetRepoContentsApi(treeFiles=[]){
 let contents = await Promise.all(treeFiles.map(async(file)=>await GetRepoFileContent({path:file.path})))
 return contents
    
}