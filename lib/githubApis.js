import {Octokit,App} from '@octokit/rest'
const GITHUB_TOKEN ="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"
const GITHUB_BASEURL = "https://api.github.com"
const GITHUB_BRANCH = 'main'
const GITHUB_REPO = "markdownfiles"
const GITHUB_OWNER = "skarthik05"
const octokit = new Octokit({
  auth: GITHUB_TOKEN,
})



// "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"
//"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"//"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"
// "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"//
//  octokit.rest.users.getAuthenticated().then((res)=>res).catch((e)=>console.error(e,'e-e'));
export async function getRepoBranchDirFiles(GITHUB_BRANCH,GITHUB_REPO){
  
  const RepoBranchDirDetails= await octokit.request(`GET /repos/${GITHUB_OWNER}/${GITHUB_REPO}/branches/${GITHUB_BRANCH}`, {
    owner: GITHUB_OWNER,
    repo: GITHUB_REPO,
    branch: GITHUB_BRANCH
  })
  return  RepoBranchDirDetails
}
export async function GetBranchDetailApi({GITHUB_BRANCH='main'}){
// const octokit = new Octokit({
//   auth: GITHUB_TOKEN
// })

const branchDetails = await octokit.request(`GET /repos/${GITHUB_OWNER}/${GITHUB_REPO}/branches/${GITHUB_BRANCH}`, {
  owner:GITHUB_OWNER,
  repo: GITHUB_REPO,
  branch: GITHUB_BRANCH
})
return branchDetails?.data?.commit?.sha
}

export async function GetRepoFilesAPI({path}){
  // const octokit = new Octokit({
  //   auth: GITHUB_TOKEN
  // })
  const {data =null}= await octokit.rest.repos.getContent({
    owner:GITHUB_OWNER,
    repo: GITHUB_REPO,
    path
  })
  return data
}
export async function GetFileContentAPI({path,GITHUB_REPO}){
  // const octokit = new Octokit({
  //   auth: GITHUB_TOKEN
  // })
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

  // const octokit = new Octokit({
  //   auth: GITHUB_TOKEN
  // })

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
export async function GetRepoByBranchTreeApi({branchName,GITHUB_REPO}){
  const octokit = new Octokit({
    auth: GITHUB_TOKEN
  })
  try {
    const branchTreeDetails= await octokit.request(`GET /repos/${GITHUB_OWNER}/${GITHUB_REPO}/git/trees/${branchName}`, {
       owner: GITHUB_OWNER,
       repo: GITHUB_REPO,
       })
     return  branchTreeDetails.data.tree
    
  } catch (error) {
    console.error(error,'GitTree');
  }

}
export async function GetRepoByBranchTreeApiRecursive({branchName,GITHUB_REPO}){
  const octokit = new Octokit({
    auth: GITHUB_TOKEN
  })
  console.log({GITHUB_REPO})
  try {
    const branchTreeDetails= await octokit.request(`GET /repos/${GITHUB_OWNER}/${GITHUB_REPO}/git/trees/${branchName}?recursive=1`, {
       owner: GITHUB_OWNER,
       repo: GITHUB_REPO,
       })
     return  branchTreeDetails.data.tree
    
  } catch (error) {
    console.error(error,'GitTree Recursive');
    
  }

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

export async function GetUserRepos({username}){
  console.log(username,'u-n')
  const octokit = new Octokit({
    auth: GITHUB_TOKEN
  })
  try {
    let {data=[]} = await octokit.request(`GET /users/${username}/repos?sort=updated&per_page=2`)
    return data.reduce((list,cur)=>{
      list.push({
        id:cur.id,
        name:cur.name,
        path:cur.url,
      })
      return list
        },[])
  } catch (error) {
    console.error(error,'GetUserRepos');
  }
// let data =[]
// let url = `${GITHUB_BASEURL}/users/repos?sort=updated&per_page=2`
// console.log({url})
// const headers = { Authorization: `token ${GITHUB_TOKEN}` };

// let test = await fetch(url,{
//   method:"get",
  
//   headers
// })
// test = await test.json()
// console.log(test,'t-s')

}
