

const GITLAB_TOKEN="glpat-Dc23KoEL5dtBgogWYFm2"
const GITLAB_BASEURL = 'https://gitlab.com/api/v4'

export async function GetGitLabUserRepoList(){
    const url = `${GITLAB_BASEURL}/users/skarthik05/projects`
  const headers={
    "Authorization":`Bearer ${GITLAB_TOKEN}`
  }
  try {
    
    let listOfRepos = await fetch(url,{
      method:'GET',
      headers
    })
    listOfRepos = await listOfRepos.json()
    return (listOfRepos || []).reduce((list,cur)=>{
      list.push({
        id:cur.id,
        name:cur.name,
        path:cur.path,
        path_with_namespace:cur.path_with_namespace
      })
      return list
        },[])
    console.log(listOfRepos,'l-t')
  } catch (error) {
    console.error(error,'e');
  }
  }
  
  export async function GetGitLabRepoFiles({repo,isRecursive=false,branch='main'}){
  const url = `${GITLAB_BASEURL}/projects/${repo}/repository/tree?recursive=${isRecursive}&ref=${branch}`
  const headers={
    "Authorization":`Bearer ${GITLAB_TOKEN}`
  }
  try {
    
    let listOfRepos = await fetch(url,{
      method:'GET',
      headers
    })
  listOfRepos = await listOfRepos.json()
    console.log(listOfRepos,'l-t')
  } catch (error) {
    cons
}
  }
  export async function GetGitLabRepoFileContent({repo,isRecursive=false,branch='main',file_path=''}){
  const url =`${GITLAB_BASEURL}/projects/${repo}/repository/files/${file_path}?ref=${branch}`
  const headers={
    "Authorization":`Bearer ${GITLAB_TOKEN}`
  }
  try {
    
    let listOfRepos = await fetch(url,{
      method:'GET',
      headers
    })
    return 
    console.log(listOfRepos,'l-t')
  } catch (error) {
    cons
} 
}