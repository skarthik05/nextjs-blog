import Head from "next/head";
import { useRouter } from 'next/router'
import Link from 'next/link';


import Layout from "../components/layout";
// import Date from '../components/date';
import { getPageData, splitFilesByPath,walk } from "../lib/experiment";
import {GetRepoByBranchTreeApiRecursive, GetRepoFilesAPI} from '../lib/githubApis'
import utilStyles from '../styles/utils.module.css'
import TreeFilter from '../components/TreeFilter';
import path from 'path'
export default function Post({ postData,files,parentChildTree }) {
    const router = useRouter()
    const {asPath,query:{slug}} =router
// const baseRoutes = []
// const uniqueFolders = {}
// const baseFolders = files

// baseFolders.forEach(file => {
//   let folderName = file.path.replace(slug.join('/'),'').split("/")[0]
//   baseRoutes.push({
//     path: '/' + file.path,
//     title: `${folderName.charAt(0).toUpperCase()}${folderName.slice(1)}`,
//   })

// })
/*
 <Layout>
    <Head>
      <title>{postData?.title}</title>
    </Head>
    <article>
      <h1 className={utilStyles.headingXl}>{postData?.title}</h1>
      <div className={utilStyles.lightText}>
      </div>
      {postData?postData &&(

        <div dangerouslySetInnerHTML={{ __html: postData?.contentHtml }} />
):
      (
        <section className={`${utilStyles.headingMd} ${utilStyles.padding1px}`}>
        <h2 className={utilStyles.headingLg}>Blog</h2>
        <ul className={utilStyles.list}>
       
        {baseRoutes?.length && baseRoutes.map((route,index)=>(
          <li className={utilStyles.listItem} key={index}>

          <Link key={index} 
          href={route.path}
          >
                      {route.title}
          </Link>
          </li>
  ))}
        </ul>
      </section>
      )
    }
    </article>
  </Layout>
*/
  return (
    <div class="row">
  <div style={{float:'left',width:'50%'}}>
  <TreeFilter data={parentChildTree} url={asPath} />
  </div>
  <div style={{float:'left',width:'50%'}}>

  { postData &&(
    <>
    <h1 className={utilStyles.headingXl}>{postData?.title}</h1>
    <div dangerouslySetInnerHTML={{ __html: postData?.contentHtml }} />
    </>
)} 
  </div>
</div>
    
  



  );
}
//Calls for local files
// export async function getStaticPaths(context) {
//     const files = await getAllFiles(path.join(process.cwd(),'sample'),[])
//    const paths=await splitFileByPaths(files)
//   return {
//     paths,
//     fallback: true,
//   };
// }


export async function getStaticPaths() {
  // const {params}=context
  // console.log(params,'pa')
  // const treeFiles = await GetRepoByBranchTreeApi({branchName:'main'})
  // const paths = await GetFileContents(treeFiles)
  // // const paths = await splitFilesByPath(contents)
  // console.log(paths,'paths')
return {
  paths:[],
  fallback: "blocking",//creates new path if not exist
};
}
export async function getStaticProps({params:{slug}}) {
  let postData=null,files=[];
  const isFile=slug[slug.length-1].includes('.')
  let path = slug.join('/')
  const recursiveTree = await GetRepoByBranchTreeApiRecursive({branchName:'main'})
const startWith =new RegExp("^"+slug[0])
  const filterByParentFolder = recursiveTree.filter((file)=>startWith.test(file.path))
  const parentChildTree =  walk(filterByParentFolder)
 if(isFile){
   postData = await getPageData(path)??null;
 }
// else{
// files = []//await GetRepoFilesAPI({path})
// }

  return {
    props: {
      postData,
      files,
      parentChildTree
    },
    revalidate: 5
  };
}
