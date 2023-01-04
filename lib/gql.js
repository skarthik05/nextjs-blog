const GITHUB_TOKEN ="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"
const GITHUB_BRANCH = 'main'
const GITHUB_REPO = "markdownfiles"
const GITHUB_OWNER = "skarthik05"
const BASE_ENDPOINT = "https://api.github.com/graphql"
// export async function getRepoContentsGQL(owner=GITHUB_OWNER,name=GITHUB_BRANCH,exp=""){
// let data = await fetch(BASE_ENDPOINT,{
//     method:"GET",
//     headers:{
//         Authorization:`Bearer ${GITHUB_TOKEN}`
//     },
//     query:
//     `query{ RepoFiles($owner: String!, $name: String!) {
//         repository(owner: ${owner}, name: ${name}) {
//           object(expression: ${exp}) {
//             ... on Tree {
//               entries {
//                 name
//                 type
//                 mode
                
//                 object {
//                   ... on Blob {
//                     byteSize
//                     text
//                     isBinary
//                   }
//                 }
//               }
//             }
//           }
//         }
//       }
//     }
//     `
// },
// )
// console.log(data,'dat')
    
// }
