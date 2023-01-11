import Head from "next/head";
import { useRouter } from 'next/router'
import Link from 'next/link';


import Layout from "../components/layout";
// import Date from '../components/date';
import { getPageData, splitFilesByPath,walk } from "../lib/experiment";
import {GetRepoByBranchTreeApiRecursive, GetRepoFilesAPI,GetRepoByBranchTreeApi} from '../lib/githubApis'
import utilStyles from '../styles/utils.module.css'
import TreeFilter from '../components/TreeFilter';
import path from 'path'
export default function Post({ postData,files,parentChildTree }) {
    const router = useRouter()
    const {asPath,query:{slug}} =router
    const baseRoutes = []
const uniqueFolders = {}
const baseFolders = files
    baseFolders.forEach(file => {
      //   let folderName = file.path.split("/")[0]
      // if(!/.md*$/.test(folderName))
      //   uniqueFolders[folderName] = null
      if(file.type=='tree')
        baseRoutes.push({
          path:`/${slug[0]}/${file.path}`,
          title: `${file.path.charAt(0).toUpperCase()}${file.path.slice(1)}`,
        })
      
      
      })
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
 {parentChildTree?.length ?( <div style={{float:'left',width:'50%'}}>
  <TreeFilter data={parentChildTree} url={asPath} />
  </div>):
  <section className={`${utilStyles.headingMd} ${utilStyles.padding1px}`}>
  <h2 className={utilStyles.headingLg}>Headers</h2>
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
}
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
  let postData=null,files=[],parentChildTree=[],filterByParentFolder=[],treeList=[];
  const isFile=slug[slug.length-1].includes('.')
  if(slug.length==1){
    treeList = await GetRepoByBranchTreeApi({branchName:'main',GITHUB_REPO:slug[0]})
  }else{
    
    const startWith =new RegExp("^"+slug[1])
    // console.log({startWith},{slug})
    const recursiveTree = await GetRepoByBranchTreeApiRecursive({branchName:'main',GITHUB_REPO:slug[0]})
    filterByParentFolder = recursiveTree.filter((file)=>startWith.test(file.path))
    parentChildTree =  walk(filterByParentFolder,slug[0])
    let path = slug.slice(1).join('/')
   if(isFile){
     postData = await getPageData(path,slug[0])??null;
   }
  }
// else{
// files = []//await GetRepoFilesAPI({path})
// }

  return {
    props: {
      postData,
      files:treeList,
      parentChildTree
    },
    revalidate: 5
  };
}
