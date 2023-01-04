// import * as fs from 'fs'
import path from 'path'
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

export  async function getPageData (slug){
  const {path,content} = await GetFileContentAPI({path:slug})
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
    ...matterResult.data,
  };
}

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