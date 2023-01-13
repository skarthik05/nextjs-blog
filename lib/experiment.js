import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';
import { GetFileContentAPI, GetRepoContentApi } from './githubApis';


export async function getAllFiles(dirPath, arrayOfFiles=[]) {
 let files = fs.readdirSync(dirPath)


  files.forEach(function(file) {
    if (fs.statSync(dirPath + "/" + file).isDirectory()) {
      arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles)
    } else {
      arrayOfFiles.push(dirPath+"/"+file)
      
    }
  })
return arrayOfFiles
}
// export async function splitFileByPaths(arrayOfPaths){
//   return arrayOfPaths.map((fileName) => {
//     let file = fileName.split('/')
//     return {
//       params: {
//         slug: file.slice(1),
//       },
//     };
//  });
// }

export async function splitFilesByPath(arrayOfFiles){
  
  return arrayOfFiles.map(({path}) => {
    let file = path.split('/')
    if(file.length) file=file.slice(1)
    else file=file[0]
    return {
      params: {
        slug: file,
      },
    };
 });
}
// export  async function getPageData (slug){
//   const fullPath = path.join(process.cwd(),'sample', slug.join('/')) +'.md'
// if(!fs.existsSync(fullPath)) return false
//   const fileContents = fs.readFileSync(fullPath, 'utf8');

//   // Use gray-matter to parse the post metadata section
//   const matterResult = matter(fileContents);

//   // Use remark to convert markdown into HTML string
//   const processedContent = await remark()
//     .use(html)
//     .process(matterResult.content);
//   const contentHtml = processedContent.toString();

//   // Combine the data with the id and contentHtml
//   return {
//     slug,
//     contentHtml,
//     ...matterResult.data,
//   };
// }

export  async function getPageData (slug,repo){
  const {path,content} = await GetFileContentAPI({path:slug,GITHUB_REPO:repo})
  // Use gray-matter to parse the post metadata section
  if(content){

  const matterResult = matter(content);
  // // Use remark to convert markdown into HTML string
  const processedContent = await remark()
    .use(html)
    .process(matterResult.content);
  const contentHtml = processedContent.toString();

  // // Combine the data with the id and contentHtml
  return {
    slug,
    contentHtml,
    rawMdx:content,
    ...matterResult.data,
  };
}

}

export var walk = function(files,repo) {
  const tree = {
    // id:files[0].sha,
    name:files[0].path,
    path: `/${repo}`,
    children: []
  }
  // const tree = {
  //   name:slug,
  //   path: '',
  //   children: []
  // }
//  files= files.slice(1)

  for (const e of files) {
    let node = tree
    const nodenames = e.path.replace(tree.path,'').split('/')
    while (nodenames.length > 0) {
      const nodename = nodenames.shift()
      if (!node.children.map(e => e?.name).includes(nodename)) {
        node.children.push({
          // id:e.sha,
          name: nodename,
          path: [node.path, nodename].join('/'),
          children: []
        })
      }
      node = node.children.filter(e => e.name === nodename)[0]
    }
  }
  // fs.writeFileSync('flat-to-tree.json',JSON.stringify(tree),{encoding: "utf8"})
  return tree.children
}
export const URIEncode = ({uri})=>{
return encodeURIComponent(uri)
}
export const URIDecode = ({uri})=>{
return decodeURIComponent(uri)
}

// var _getAllFilesFromFolder = function(dir) {

//     var filesystem = require("fs");
//     var results = [];

//     filesystem.readdirSync(dir).forEach(function(file) {

//         file = dir+'/'+file;
//         var stat = filesystem.statSync(file);

//         if (stat && stat.isDirectory()) {
//             results = results.concat(_getAllFilesFromFolder(file))
//         } else results.push(file);

//     });

//     return results;

// };
