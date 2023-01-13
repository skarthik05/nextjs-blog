import axios from 'axios'
const GITHUB_TOKEN ='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'
// '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'
// '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'
//"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"
//"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"
const GITHUB_BASEURL = "https://api.github.com"
const GITHUB_BRANCH = 'main'
const GITHUB_REPO = "markdownfiles"
const GITHUB_OWNER = "skarthik05"


export async function GetRepoFilesAPI({path}){

  let url =`${GITHUB_BASEURL}/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${path}`
  const headers={
    'Authorization':`token ${GITHUB_TOKEN}`
  }
  let {data=null}= await axios['get'](url,headers)
  return data
}
export async function GetFileContentAPI({path,GITHUB_REPO}){
 
    let url =`${GITHUB_BASEURL}/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${path}`
    const headers={
      'Authorization':`token ${GITHUB_TOKEN}`
    }
    let {data=null}= await axios['get'](url,headers)
    
  return{
    path:data.path,
    content:data.content? await base64Decoder(data.content):""
  
}
}
export async function GetRepoFileContent({path}){

let url =`${GITHUB_BASEURL}/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${path}`
const headers={
  'Authorization':`token ${GITHUB_TOKEN}`
}
let {data=null}= await axios['get'](url,headers)

if(data)
  return{
    path:data.path,
    content:data.content?base64Decoder(data.content):""
  
}
}
export async function GetRepoByBranchTreeApi({branchName,GITHUB_REPO}){
  try {

    let url =`${GITHUB_BASEURL}/repos/${GITHUB_OWNER}/${GITHUB_REPO}/git/trees/${branchName}`
    const headers={
      'Authorization':`token ${GITHUB_TOKEN}`
    }
    let branchTreeDetails= await axios['get'](url,headers)
  
     return  branchTreeDetails.data.tree
    
  } catch (error) {
    console.error(error,'GitTree');
  }

}
export async function GetRepoByBranchTreeApiRecursive({branchName,GITHUB_REPO}){

  try {
    let url =`${GITHUB_BASEURL}/repos/${GITHUB_OWNER}/${GITHUB_REPO}/git/trees/${branchName}?recursive=1`
    const headers={
      'Authorization':`token ${GITHUB_TOKEN}`
    }
    let branchTreeDetails= await axios['get'](url,headers)
  
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
  try {
    let url =`${GITHUB_BASEURL}/users/${username}/repos?sort=updated&per_page=2`
    const headers={
      'Authorization':`token ${GITHUB_TOKEN}`
    }
    let repoList= await axios['get'](url,headers)
    return (repoList?.data || []).reduce((list,cur)=>{
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
}
